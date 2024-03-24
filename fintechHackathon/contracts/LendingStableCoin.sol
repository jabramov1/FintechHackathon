// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract LendingStablecoin {
    // Define a Loan structure with more detailed attributes
    struct Loan {
        address borrower;
        address lender;
        uint256 principalAmount;
        uint256 interestRate; // As a percentage, e.g., 5% is represented as 5
        uint256 dueDate; // Timestamp of when the loan is due
        uint256 amountRepaid; // Tracks how much has been repaid
        bool isFunded; // Whether the loan is funded by a lender
    }

    IERC20 public stablecoin; // Interface for the stablecoin
    Loan[] public loans; // Dynamic array to store loans

    // Define events for tracking contract activities
    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 principalAmount,
        uint256 interestRate,
        uint256 dueDate
    );
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanRepaid(uint256 indexed loanId, uint256 repaymentAmount);
    event LoanFullyRepaid(uint256 indexed loanId);

    constructor(address _stablecoinAddress) {
        stablecoin = IERC20(_stablecoinAddress);
    }

    // Borrowers can call this function to request a new loan
    function requestLoan(
        uint256 _principalAmount,
        uint256 _interestRate,
        uint256 _loanDuration
    ) external {
        uint256 dueDate = block.timestamp + _loanDuration;
        loans.push(
            Loan({
                borrower: msg.sender,
                lender: address(0),
                principalAmount: _principalAmount,
                interestRate: _interestRate,
                dueDate: dueDate,
                amountRepaid: 0,
                isFunded: false
            })
        );
        emit LoanRequested(
            loans.length - 1,
            msg.sender,
            _principalAmount,
            _interestRate,
            dueDate
        );
    }

    // Lenders use this function to fund a loan
    function fundLoan(uint256 _loanId) external {
        Loan storage loan = loans[_loanId];
        require(!loan.isFunded, "Loan already funded");
        loan.lender = msg.sender;
        loan.isFunded = true;
        stablecoin.transferFrom(
            msg.sender,
            address(this),
            loan.principalAmount
        );
        emit LoanFunded(_loanId, msg.sender);
    }

    // Borrowers call this to make repayments
    function repayLoan(uint256 _loanId, uint256 _repaymentAmount) external {
        Loan storage loan = loans[_loanId];
        require(loan.isFunded, "Loan not funded");
        require(
            block.timestamp <= loan.dueDate,
            "Loan repayment period has expired"
        );
        require(
            msg.sender == loan.borrower,
            "Only the borrower can make repayments"
        );
        loan.amountRepaid += _repaymentAmount;
        stablecoin.transferFrom(msg.sender, loan.lender, _repaymentAmount);
        emit LoanRepaid(_loanId, _repaymentAmount);

        // Check if the loan is fully repaid including interest
        uint256 totalDue = loan.principalAmount +
            ((loan.principalAmount * loan.interestRate) / 100);
        if (loan.amountRepaid >= totalDue) {
            emit LoanFullyRepaid(_loanId);
        }
    }

    // Utility function to view a specific loan details
    function getLoanDetails(
        uint256 _loanId
    ) external view returns (Loan memory) {
        return loans[_loanId];
    }
}
