async function fundLoan(loanId) {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const account = await getAccount(); // Make sure to define this function or replace with correct web3 account retrieval code
            const lendingContract = new web3.eth.Contract(lendingContractABI, lendingContractAddress);

            // Call the fundLoan function of the Lending Contract
            await lendingContract.methods.fundLoan(loanId).send({ from: account })
                .on('transactionHash', function (hash) {
                    // Transaction sent
                    console.log('Transaction hash:', hash);
                })
                .on('confirmation', function (confirmationNumber, receipt) {
                    // Transaction confirmed
                    console.log('Transaction confirmation:', confirmationNumber);
                })
                .on('error', function (error) {
                    // Transaction failed
                    console.error('Transaction error:', error);
                });

        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        console.error('MetaMask is not installed!');
    }
}

// Assume there's a button in your HTML with an id="fundLoanButton"
document.getElementById('fundLoanButton').addEventListener('click', function () {
    const loanId = document.getElementById('loanIdInput').value; // Make sure you have an input field for the loanId
    fundLoan(loanId);
});
