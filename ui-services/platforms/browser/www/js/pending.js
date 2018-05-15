// let value = document.getElementById('loanamount').value;
// let days = document.getElementById('days').value;
// let interest = document.getElementById('interest').value;
// let installment = document.getElementById('installment').value;

// var privateKey;
// var privateKey = keythereum.recover(localStorage.getItem("password"), JSON.parse(localStorage.getItem("key")));
// console.log(privateKey)

var tempDoc;
var loanId;
axios.post(thanosConfig.mongoService+":3001/buy/loan",{
    user: localStorage.getItem("userId")
}).then(function(response){
    console.log(response)
    if(response.data.status == "y"){
        document.getElementById("loanamount").value = response.data.doc.amount;
        document.getElementById("days").value = response.data.doc.duration;
        document.getElementById("interest").value = response.data.doc.interest;
        document.getElementById("installment").value = response.data.doc.installment;
        loanId = response.data.doc._id;
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
    let value = document.getElementById("loanamount").value;
    let interest = document.getElementById("loanamount").value;
    let duration = document.getElementById("loanamount").value;
    let installment = document.getElementById("loanamount").value;
    // var signature = signMessage(value+days+interest+installment+localStorage.getItem("userId"),privateKey)
    var signature = tempDoc.signature;
    axios.post(thanosConfig.mongoService+":3001/buy/update",{
        user: localStorage.getItem("userId"),
        contract : tempDoc.contract,
        pubkey: tempDoc.pubkey,
        amount: document.getElementById("loanamount").value,
        interest: document.getElementById("interest").value,
        duration: document.getElementById("days").value,
        installment: document.getElementById("installment").value,
        signature:signature
    }).then(function(response){
        if(response.data.status == "y"){
            alert("Loan updated successfully")
            window.location.href ="../views/account.html"
        }else{
            alert(response.data.info)
        }
    })
}

// document.getElementById("loanamount").value == tempDoc.amount && document.getElementById("interest").value == tempDoc.interest && document.getElementById("days").value == tempDoc.duration && document.getElementById("installment").value == tempDoc.installment

function negotiate(){
    console.log("negotiate")
    axios.post(thanosConfig.mongoService+":3001/sell/list",{
        _id:tempDoc._id
    }).then(function(response){
        console.log(response.data)
    })
}

function openBidList() {
    window.location.href = '../views/bidList.html?loanId='+loanId;
}

function signMessage (message, privateKey) {
    console.log(message,privateKey)
        var data = ethUtil.keccak(message, 256);
        console.log(data.toString('hex'))
        var privKey = ethUtil.toBuffer(privateKey, 'hex');
        console.log(privKey)
        var signedMessage = ethUtil.ecsign(data, privKey)
        console.log("r:  "+signedMessage.r.toString('hex'))
        console.log("s:  "+signedMessage.s.toString('hex'))
        console.log("v:  "+signedMessage.v)

    const result = {
        r: signedMessage.r.toString("hex"),
        s: signedMessage.s.toString("hex"),
        version: ""+(signedMessage.v),
        hash: data.toString('hex')
    };
    return result;
};
