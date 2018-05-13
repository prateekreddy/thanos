// let value = document.getElementById('loanamount').value;
// let days = document.getElementById('days').value;
// let interest = document.getElementById('interest').value;
// let installment = document.getElementById('installment').value;


var tempDoc;
axios.post(thanosConfig.mongoService+":3001/buy/loan",{
    user: localStorage.getItem("userId")
}).then(function(response){
    console.log(response)
    if(response.data.status == "y"){
        document.getElementById("loanamount").value = response.data.doc.amount;
        document.getElementById("days").value = response.data.doc.duration;
        document.getElementById("interest").value = response.data.doc.interest;
        document.getElementById("installment").value = response.data.doc.installments;

        document.getElementById("loanId").innerHTML = response.data.doc._id;
        tempDoc = response.data.doc;
    }else{
        alert(response.data.info)
    }
})

function cancelRequest(){
    window.location.href = "../views/account.html"
}

function editLoan(){
    
    axios.post(thanosConfig.mongoService+":3001/buy/update",{
        user: localStorage.getItem("userId"),
        contract : tempDoc.contract,
        pubkey: tempDoc.pubkey,
        amount: document.getElementById("loanamount").value,
        interest: document.getElementById("interest").value,
        duration: document.getElementById("days").value,
        installments: document.getElementById("installment").value,
        signature:{
            version:tempDoc.signature.version,
            r: tempDoc.signature.r,
            s: tempDoc.signature.s
        }
    }).then(function(response){
        if(response.data.status == "y"){
            alert("Loan updated successfully")
            window.location.href ="../views/account.html"
        }else{
            alert(response.data.info)
        }
    })

}

// document.getElementById("loanamount").value == tempDoc.amount && document.getElementById("interest").value == tempDoc.interest && document.getElementById("days").value == tempDoc.duration && document.getElementById("installment").value == tempDoc.installments