var privateKey = keythereum.recover(localStorage.getItem("password"), JSON.parse(localStorage.getItem("key")));
console.log(privateKey)
function submitRequest(){
     let value = document.getElementById('loanamount').value;
     let days = document.getElementById('days').value;
     let interest = document.getElementById('interest').value;
     let installment = document.getElementById('installment').value;
     let signature = signMessage(value+days+interest+installment+localStorage.getItem("userId"),privateKey)
    console.log("*",value,days,interest,installment,signature,"*")
    
     axios.post(thanosConfig.mongoService+":3001/buy",{
        nonce:1,
        user: localStorage.getItem("userId"),
        contract:"1231231223123",
        pubkey: JSON.parse(localStorage.getItem("key")).address,
        amount: value,
        duration: days,
        interest:interest,
        installment:installment,
        signature:signature

     }).then(function(response){
        console.log(response.data)
        if(response.data.status == "y"){
            alert(response.data.doc._id+" loan created");
            window.location.href="../views/account.html"

        }else{
            window.location.href="../views/borrow.html"
        }
     }).catch(function(err){
        console.log(err)
     })
}   

function cancelRequest(){
    location.window.href = "../views/account.html"
}

function signMessage (message, privateKey) {
    console.log(message,privateKey)
        var data = ethUtil.keccak(message, 256);
        console.log(data.toString('hex'))
        var privKey = ethUtil.toBuffer(privateKey, 'hex');
        console.log(privKey,"askldjfahsdjkfhajkshdfjkhasfkdjhasjkld")
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
