function submitRequest(){
     let value = document.getElementById('loanamount').value;
     let days = document.getElementById('days').value;
     let interest = document.getElementById('interest').value;
     let installment = document.getElementById('installment').value;

     axios.post(thanosConfig.mongoService+":3001/buy",{
        nonce:1,
        user: localStorage.getItem("userId"),
        contract:"1231231223123",
        pubkey:"321321321321",
        amount: value,
        duration: days,
        interest:interest,
        installment:installment,
        signature:{
            version:"10",
            r:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            s:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        }

     }).then(function(response){
        console.log(response.data)
        if(response.data.status == "y"){
            alert(response.data.doc._id+" loan created");
            window.location.href="../views/account.html"

        }else{
            window.location.href="../views/pending.html"
        }
     }).catch(function(err){
        console.log(err)
     })
}   

function cancelRequest(){
    location.window.href = "../views/account.html"
}