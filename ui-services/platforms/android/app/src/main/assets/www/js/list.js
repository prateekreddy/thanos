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

function negotiate(){
    console.log("negotiate")
    for (let i = 0; i < document.getElementsByClassName("selectedColumns").length; i++) {
        let element = document.getElementsByClassName("selectedColumns")[i];
        console.log(element.id)
        if(element.style.backgroundColor == "rgb(193, 213, 229)"){
            axios.post(thanosConfig.mongoService+":3001/sell",{
                id: element.id.split("_")[0],
                lender: localStorage.getItem("userId")
            }).then(function(response){
                if(response.data.status == "y"){
                    //send to blockchain confirm
                    //check if success or fail
                    
                    // axios.post(thanosConfig.loginServer+":8000/loan/getNonce",{
                    //     borrower: element.id.split("_")[1]
                    // }).then(function(response){
                    //         let nonce = response.data;
                    //         console.log(nonce)
                    //         axios.post(thanosConfig.loginServer+":8000/loan/getAddressById",{
                    //             Id:lender
                    //         }).then(function(response){
                    //             let lenderAddress = response.data
                    //             axios.post(thanosConfig.loginServer+":8000/loan/getAddressById",{
                    //                 Id:element.id.split("_")[1]
                    //             }).then(function(response){
                    //                 let borrowerAddress = response.data;
                    //                 axios.post(thanosConfig.loginServer+":8000/loan/request",{
                    //                     //continue here
                    //                 })
                    //             })
                    //         })
                    // })
                    alert("Approve Success")
                }else{
                    alert("Approve Failed")
                }
            })
        }else{

        }
            
    }
}

function cancelRequest(){
    window.location.href="../views/account.html"
}

// function negotiate(){

// }
// function signedTx(web3, Tx, abi, method, params, toAddress, fromPrivKey, fromAddress) {
//     const 
// }

// const onBoardingContract = new web3.eth.Contract(abi, contractAddress);
// payload = onBoardingContract.methods.onBoardUser(userPubKey, shopId, aadharNo, authId).encodeABI();
// web3.eth.getTransactionCount(config.geth.account.address).then((count) => {
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
//     const privKey = Buffer.from(config.geth.account.privKey, 'hex')
//     tx.sign(privKey);

//     const rawTx = tx.serialize();
// })