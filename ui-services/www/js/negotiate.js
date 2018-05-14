var tempDoc;

let params = (new URL(document.location)).searchParams;
let borrowerId = params.get("borrowerId");
let loanId = params.get("loanId");

axios.post(thanosConfig.mongoService+":3001/buy/loan",{
    user: borrowerId
}).then(function(response){
    console.log(response)
    if(response.data.status == "y"){
        document.getElementById("loanamount").value = response.data.doc.amount;
        document.getElementById("days").value = response.data.doc.duration;
        document.getElementById("interest").value = response.data.doc.interest;
        document.getElementById("installment").value = response.data.doc.installment;

        document.getElementById("loanId").innerHTML = response.data.doc._id;
        tempDoc = response.data.doc;
    }else{
        alert(response.data.info)
    }
})

function submitBid(){
    let value = document.getElementById('loanamount').value;
    let days = document.getElementById('days').value;
    let interest = document.getElementById('interest').value;
    let installment = document.getElementById('installment').value;
    // let signature = signMessage(value+days+interest+installment+localStorage.getItem("userId"))
   console.log("*",value,days,interest,installment,"*")
   
    axios.post(thanosConfig.mongoService+":3001/sell/bid",{
       lenderId: localStorage.getItem("userId"),
       borrowerId: borrowerId,
       loanId: loanId,
       amount: value,
       duration: days,
       interest:interest,
       installment:installment
    }).then(function(response){
       console.log(response.data)
       if(response.data.status == "y"){
           alert(response.data.doc._id+" Bid Successfully Submitted");
           window.location.href="../views/list.html"
       }else{
           alert("Apologies, there was some error in bid submission. Please try again later.")
            window.location.href="../views/accounts.html"
       }
    }).catch(function(err){
       console.log(err)
    })
}  

function cancelRequest(){
    window.location.href="../views/list.html"
}

// function signMessage (message, privateKey) {
//     console.log(message,privateKey)
//         var data = ethUtil.keccak(message, 256);
//         console.log(data.toString('hex'))
//         var privKey = ethUtil.toBuffer(privateKey, 'hex');
//         console.log(privKey,"askldjfahsdjkfhajkshdfjkhasfkdjhasjkld")
//         var signedMessage = ethUtil.ecsign(data, privKey)
//         console.log("r:  "+signedMessage.r.toString('hex'))
//         console.log("s:  "+signedMessage.s.toString('hex'))
//         console.log("v:  "+signedMessage.v)

//     const result = {
//         r: signedMessage.r.toString("hex"),
//         s: signedMessage.s.toString("hex"),
//         version: ""+(signedMessage.v),
//         hash: data.toString('hex')
//     };
//     return result;
// };