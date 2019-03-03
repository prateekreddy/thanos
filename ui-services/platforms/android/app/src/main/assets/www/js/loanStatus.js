let params = (new URL(document.location)).searchParams;
let loanId = params.get("loanId");

function cancelRequest() {
    window.location.href = "../views/openLoans.html";
}

function populateLoan() {
    axios.post(thanosConfig.mongoService+":3001/sell/loan/open",{
        loanId
    }).then((res) => {
        console.log(res.data)
        const loan = res.data.loan;
        let percentLoanCompleted, remainingAmount, duration, toRepayAmount;
        let totalAmount = parseInt(loan.amount + loan.amount*(loan.duration/365)*(loan.interest/100));
        let totalPaid = parseInt(totalAmount) - parseInt(loan.dueAmount);
        let percent = totalPaid*100/totalAmount;
        console.log(totalAmount,totalPaid,percent)
        document.getElementById('percentLoanCompleted').value = parseFloat(percent).toFixed(2);
        document.getElementById('remainingAmount').value = parseInt(loan.dueAmount);
        document.getElementById('duration').value = loan.duration;
        if(loan.dueAmount == 0) {
            alert('Entire Loan Amount repaid. Closing the Loan. Thank you.');
            window.location.href = "../views/openLoans.html";
        }
    }) 
}

populateLoan()