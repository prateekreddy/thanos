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

function negotiate(){
    console.log("negotiate")
    for (let i = 0; i < document.getElementsByClassName("selectedColumns").length; i++) {
        let element = document.getElementsByClassName("selectedColumns")[i];
        console.log(element.id)
        if(element.style.backgroundColor == "rgb(193, 213, 229)"){
            loanId = element.id.split("_")[0];
            lenderId = localStorage.getItem("userId");
            borrowerId = element.id.split("_")[0];

            axios.post(thanosConfig.mongoService+":3001/sell",{
                id: element.id.split("_")[0],
                lender: localStorage.getItem("userId")
            }).then(function(response){
                if(response.data.status == "y"){
                    //send to blockchain confirm
                    //check if success or fail
                    doc = response.data.doc;
                    axios.post(thanosConfig.loginServer+":8000/loan/getNonce",{
                        borrower: element.id.split("_")[1]
                    }).then(function(response){
                            let nonce = response.data;
                            console.log(nonce)
                            axios.post(thanosConfig.loginServer+":8000/loan/getAddressById",{
                                Id:localStorage.getItem("userId")
                            }).then(function(response){
                                let lenderAddress = response.data
                                axios.post(thanosConfig.loginServer+":8000/loan/getAddressById",{
                                    Id:element.id.split("_")[1]
                                }).then(function(response){
                                    let borrowerAddress = response.data;
                                    axios.post(thanosConfig.loginServer+":8000/loan/getAbi",{
                                        entityType:"user"
                                    }).then(function(response){
                                        ABI = response.data
                                        axios.post(thanosConfig.loginServer+":8000/loan/getEthTxNonce",{
                                            address:pubkey
                                        }).then(function(response){
                                            let txNonce = response.data;
                                            // var rawTx = signedTx(ABI,lenderAddress,nonce,"0x"+rlp.encode(loanId).toString('hex'),duration,installment,interest,"0x"+rlp.encode(borrowerId).toString("hex"),borrowerAddress,amount,"0x"+doc.signature.hash,parseInt(doc.signature.version),"0x"+doc.signature.r,"0x"+doc.signature.s,txNonce)
                                            // console.log(rawTx)
                                            // abi,contractAddress,contractNonce, loanId, time, installment, interestRate, borrowerId, borrowerAddress, amount, hashedValue, version, r,s,count
                                            axios.post(thanosConfig.loginServer+":8000/loan/request",{
                                                // abi:ABI,
                                                lenderAddress:lenderAddress,
                                                nonce:nonce,
                                                loanId:"0x"+rlp.encode(loanId).toString('hex'),
                                                duration:parseInt(duration),
                                                installment:parseInt(installment),
                                                interest:parseInt(interest),
                                                borrowerId:"0x"+rlp.encode(borrowerId).toString("hex"),
                                                borrowerAddress:borrowerAddress,
                                                amount:parseInt(amount),
                                                hashedValue:"0x"+doc.signature.hash,
                                                v:parseInt(doc.signature.version),
                                                r:"0x"+doc.signature.r,
                                                s:"0x"+doc.signature.s,
                                                txNonce:parseInt(txNonce),
                                                privateKey:privateKey.toString("hex"),
                                                address: pubkey
                                            }).then(function(response){
                                                if(response.data.status == "y"){
                                                    alert("Approve Success, raw transaction created successfully")
                                                }else{
                                                    axios.post(thanosConfig.mongoService+":3001/sell/unset",{
                                                        id:element.id.split("_")[0]
                                                    }).then(function(response){
                                                        if(response.data.status == "y"){
                                                            alert("Rejected")
                                                        }else{
                                                            alert("Server Fail")
                                                        }
                                                    })
                                                }
                                            }).catch(function(error){
                                                console.log(error)
                                                axios.post(thanosConfig.mongoService+":3001/sell/unset",{
                                                    id:element.id.split("_")[0]
                                                }).then(function(response){
                                                    if(response.data.status == "y"){
                                                        alert("Rejected")
                                                    }else{
                                                        alert("Server Fail")
                                                    }
                                                })
                                            })
                                            
                                        }).catch(function(error){
                                            console.log(error)
                                            axios.post(thanosConfig.mongoService+":3001/sell/unset",{
                                                id:element.id.split("_")[0]
                                            }).then(function(response){
                                                if(response.data.status == "y"){
                                                    alert("Rejected")
                                                }else{
                                                    alert("Server Fail")
                                                }
                                            })
                                        })
                                    }).catch(function(error){
                                        console.log(error)
                                        axios.post(thanosConfig.mongoService+":3001/sell/unset",{
                                            id:element.id.split("_")[0]
                                        }).then(function(response){
                                            if(response.data.status == "y"){
                                                alert("Rejected")
                                            }else{
                                                alert("Server Fail")
                                            }
                                        })
                                    })
                                }).catch(function(error){
                                    console.log(error)
                                    axios.post(thanosConfig.mongoService+":3001/sell/unset",{
                                        id:element.id.split("_")[0]
                                    }).then(function(response){
                                        if(response.data.status == "y"){
                                            alert("Rejected")
                                        }else{
                                            alert("Server Fail")
                                        }
                                    })
                                })
                            }).catch(function(error){
                                console.log(error)
                                axios.post(thanosConfig.mongoService+":3001/sell/unset",{
                                    id:element.id.split("_")[0]
                                }).then(function(response){
                                    if(response.data.status == "y"){
                                        alert("Rejected")
                                    }else{
                                        alert("Server Fail")
                                    }
                                })
                            })
                    }).catch(function(error){
                        console.log(error)
                        axios.post(thanosConfig.mongoService+":3001/sell/unset",{
                            id:element.id.split("_")[0]
                        }).then(function(response){
                            if(response.data.status == "y"){
                                alert("Rejected")
                            }else{
                                alert("Server Fail")
                            }
                        })
                    })
                    
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