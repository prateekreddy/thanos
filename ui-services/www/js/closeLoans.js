var amount;
var duration;
var interest;
var installment;
var pubkey = JSON.parse(localStorage.getItem('key')).address
var privateKey = keythereum.recover(localStorage.getItem("password"), JSON.parse(localStorage.getItem("key")));
var loanId;
var borrowerId;
var lenderId;
var doc;
var ABI;
console.log(privateKey)
// document.getElementById("customers")
axios.post(thanosConfig.mongoService+":3001/buy/list",{

}).then(function(response){
    console.log(response.data)
    document.getElementById("customers").innerHTML

    for (let i = 0; i < response.data.length; i++) {
        var append = "<tr id='"+response.data[i]._id+"_"+response.data[i].user+"' class='selectedColumns' onclick='selectloan(this)'><td>"+response.data[i].amount+"</td><td>"+response.data[i].duration+"</td><td>"+response.data[i].interest+"</td><td>"+response.data[i].installment+"</td></tr>";
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