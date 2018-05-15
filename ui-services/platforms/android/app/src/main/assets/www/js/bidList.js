function cancelRequest() {
    window.location.href = "../views/account.html";
}

function getLoanBids() {
    let params = (new URL(document.location)).searchParams;
    let loanId = params.get("loanId");

    axios.post(thanosConfig.mongoService+":3001/sell/loan/bids",{
        loanId
    }).then((res) => {
        const loanData = res.data;
        document.getElementById('loan').innerHTML += `<tr id="loan"><td>${loanData.amount}</td><td>${loanData.duration}</td><td>${loanData.interest}</td><td>${loanData.installment}</td></tr>`;
        if(loanData.bid.length == 0) {
            document.getElementById('bidsComment').innerHTML += `<p id="noBid">No Bids Found</p>`;
        } else {
            document.getElementById('bidsComment').innerHTML += `<p id="yesBid">Following Bids Received</p>`;
            let append = '';
            for(let i = 0; i < loanData.bid.length; i++) {
                const bid = loanData.bid[i];
                append += `<tr id="${bid._id}" class='selectedRows' onclick='selectloan(this)'><td>${bid.amount}</td><td>${bid.duration}</td><td>${bid.interest}</td><td>${bid.installment}</td></tr>`;
            }
            document.getElementById('bidList').innerHTML += append;
            console.log("updated bids successfully")
        }
        
    })
}

function selectloan(element){
    amount = element.childNodes[0].innerHTML
    duration = element.childNodes[1].innerHTML
    interest = element.childNodes[2].innerHTML
    installment = element.childNodes[3].innerHTML

    if(element.style.backgroundColor == ""){
        for (let i = 0; i < document.getElementsByClassName("selectedRows").length; i++) {
            let elem = document.getElementsByClassName("selectedRows")[i];
            elem.style.backgroundColor = ""                  
        }    
        element.style.backgroundColor = "#c1d5e5"
    }else if (element.style.backgroundColor == "rgb(193, 213, 229)"){
        element.style.backgroundColor = ""       
    }
}

function approveBid() {
    for (let i = 0; i < document.getElementsByClassName("selectedRows").length; i++) {
        let element = document.getElementsByClassName("selectedRows")[i];
        console.log(element.id)
        if(element.style.backgroundColor == "rgb(193, 213, 229)"){
            const selectedBidId = element.id;
            axios.post(thanosConfig.mongoService+":3001/sell/bid/approve",{
                bidId: selectedBidId
            }).then((res) => {
                console.log(res.data);
                if(res.data.status == "y") {
                    alert("Loan successfully approved");
                    window.location.href = "../views/account.html"
                } else {
                    alert("something went wrong. Please try again.");
                    window.location.href = "../views/account.html"
                }
            })
        }
    };
}

function rejectBid() {
    for (let i = 0; i < document.getElementsByClassName("selectedRows").length; i++) {
        let element = document.getElementsByClassName("selectedRows")[i];
        console.log(element.id)
        if(element.style.backgroundColor == "rgb(193, 213, 229)"){
            const selectedBidId = element.id;
            axios.post(thanosConfig.mongoService+":3001/sell/bid/reject",{
                bidId: selectedBidId
            }).then((res) => {
                console.log(res.data);
                if(res.data.status == "y") {
                    location.reload();
                } else {
                    alert("something went wrong. Please try again.");
                    window.location.href = "../views/account.html"
                }
            })
        }
    };
}

getLoanBids()