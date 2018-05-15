var amount;
var duration;
var interest;
var installment;
var pubkey = JSON.parse(localStorage.getItem('key')).address
var privateKey;
// var privateKey = keythereum.recover(localStorage.getItem("password"), JSON.parse(localStorage.getItem("key")));
var loanId;
var borrowerId;
var lenderId;
var doc;
var ABI;
console.log(privateKey)
// document.getElementById("customers")
axios.post(thanosConfig.mongoService+":3001/sell/loan/closed/list",{
    userId: localStorage.getItem('userId')
}).then(function(response){
    console.log(response.data.closedLoans)
    

    if(response.data.closedLoans.length == 0) {
        document.getElementById("loanComment").innerHTML = "No Closed Loans Found"   
    }

    for (let i = 0; i < response.data.closedLoans.length; i++) {
        var append = "<tr id='"+response.data.closedLoans[i]._id+"_"+response.data.closedLoans[i].user+"' class='selectedColumns' onclick='selectloan(this)'><td>"+response.data.closedLoans[i].amount+"</td><td>"+response.data.closedLoans[i].duration+"</td><td>"+response.data.closedLoans[i].interest+"</td><td>"+response.data.closedLoans[i].installment+"</td></tr>";
        document.getElementById("customers").innerHTML += append;        
    }
})

// function selectloan(element){
//     amount = element.childNodes[0].innerHTML
//     duration = element.childNodes[1].innerHTML
//     interest = element.childNodes[2].innerHTML
//     installment = element.childNodes[3].innerHTML

//     if(element.style.backgroundColor == ""){
//         for (let i = 0; i < document.getElementsByClassName("selectedColumns").length; i++) {
//             let elem = document.getElementsByClassName("selectedColumns")[i];
//             elem.style.backgroundColor = ""                  
//         }    
//         element.style.backgroundColor = "#c1d5e5"
//     }else if (element.style.backgroundColor == "rgb(193, 213, 229)"){
//         element.style.backgroundColor = ""       
//     }
// }

function cancelRequest(){
    window.location.href = "../views/account.html"
}
