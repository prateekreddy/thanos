var amount;
var duration;
var interest;
var installment;
var pubkey = JSON.parse(localStorage.getItem('key')).address
// var privateKey = keythereum.recover(localStorage.getItem("password"), JSON.parse(localStorage.getItem("key")));
var privateKey;
var loanId;
var borrowerId;
var lenderId;
var doc;
var ABI;
console.log(privateKey)
// document.getElementById("customers")
axios.post(thanosConfig.mongoService+":3001/sell/loan/open/list",{
    userId: localStorage.getItem('userId')
}).then(function(response){
    console.log(response.data.openLoans)
    if(response.data.openLoans.length == 0) {
        document.getElementById("loanComment").innerHTML = "No Open Loans Found"   
    }

    for (let i = 0; i < response.data.openLoans.length; i++) {
        var append = "<tr id='"+response.data.openLoans[i]._id+"_"+response.data.openLoans[i].user+"' class='selectedColumns' onclick='selectloan(this)'><td>"+parseInt(response.data.openLoans[i].dueAmount)+"</td><td>"+response.data.openLoans[i].duration+"</td><td>"+response.data.openLoans[i].interest+"</td><td>"+response.data.openLoans[i].installment+"</td></tr>";
        document.getElementById("customers").innerHTML += append;        
    }
})

function selectloan(element){
    amount = element.childNodes[0].innerHTML
    duration = element.childNodes[1].innerHTML
    interest = element.childNodes[2].innerHTML
    installment = element.childNodes[3].innerHTML

    if(element.style.backgroundColor == ""){
        for (let i = 0; i < document.getElementsByClassName("selectedColumns").length; i++) {
            let elem = document.getElementsByClassName("selectedColumns")[i];
            elem.style.backgroundColor = ""                  
        }    
        element.style.backgroundColor = "#c1d5e5"
    }else if (element.style.backgroundColor == "rgb(193, 213, 229)"){
        element.style.backgroundColor = ""       
    }
}

function openLoan() {
    let idList;
    for (let i = 0; i < document.getElementsByClassName("selectedColumns").length; i++) {
        let element = document.getElementsByClassName("selectedColumns")[i];
        console.log(element.id)
        if(element.style.backgroundColor == "rgb(193, 213, 229)"){
            idList = element.id.split("_");
            window.location.href = "../views/repay.html?loanId="+idList[0];
        }
    };
    if(!idList) {
        alert("Please select a loan")
    }
}

function cancelRequest() {
    window.location.href = "../views/account.html";
}