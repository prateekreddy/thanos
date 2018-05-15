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

function cancelRequest(){
    window.location.href="../views/account.html"
}

function negotiate() {
    let idList;
    for (let i = 0; i < document.getElementsByClassName("selectedColumns").length; i++) {
        let element = document.getElementsByClassName("selectedColumns")[i];
        console.log(element.id)
        if(element.style.backgroundColor == "rgb(193, 213, 229)"){
            idList = element.id.split("_");
            window.location.href = "../views/negotiate.html?loanId="+idList[0]+"&borrowerId="+idList[1];
        }
    };
    if(!idList) {
        alert("Please select a Loan to negotiate")
    }
}

function negotiateList(){
    window.location.href = "../views/negotiationList.html"
}

function approve() {
    let idList;
    for (let i = 0; i < document.getElementsByClassName("selectedColumns").length; i++) {
        let element = document.getElementsByClassName("selectedColumns")[i];
        console.log(element.id)
        if(element.style.backgroundColor == "rgb(193, 213, 229)"){
            idList = element.id.split("_");
            axios.post(thanosConfig.mongoService+":3001/sell/loan/approve",{
                loanId: idList[0],
                lenderId: localStorage.getItem('userId')
            }).then((res) => {
                if(res.data.status == 'y') {
                    alert("Loan is approved. The funds has been transferred to the borrower.")
                    location.reload()
                } else {
                    alert("Something went wrong. Please try again later.")
                    window.location.href = "../views/account.html"
                }

            }) 
        }
    };
    if(!idList) {
        alert("Please select a Loan to negotiate")
    }
}

// function signedTx(abi,contractAddress,contractNonce, loanId, time, installment, interestRate, borrowerId, borrowerAddress, amount, hashedValue, version, r,s,count) {
//     const web3 = new Web3();
//     // web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

//     console.log(borrowerAddress)
//     const contract = web3.eth.contract(abi).at(contractAddress.toLowerCase());
//     console.log(contract)
//     const payload = contract.lend(parseInt(contractNonce), loanId.toLowerCase(), parseInt(time), parseInt(installment), parseInt(interestRate), borrowerId, borrowerAddress.toLowerCase(), parseInt(amount), hashedValue, version, r,s).getData();
//     console.log(payload)
//     // var payload = onBoardingContract.methods.lend(contractNonce, loanId, time, installment, interestRate, borrowerId, borrowerAddress, amount, hashedValue, version, r,s).encodeABI();

//     const nonce = web3.utils.toHex(count);
//     const gasPrice = web3.utils.toHex(2);

//     const txData = {
//         nonce,
//         gasPrice,
//         gasLimit: web3.utils.toHex(80000000),
//         to: contractAddress,
//         from: config.geth.account.address,
//         value: '0x00',
//         data: payload
//     };

//     const tx = new Tx(txData);
//     const privKey = Buffer.from(privateKey, 'hex')
//     tx.sign(privKey);

//     const rawTx = tx.serialize(); 
//     return rawTx
// }