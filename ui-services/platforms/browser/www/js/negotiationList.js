axios.post(thanosConfig.mongoService+":3001/sell/bid/list",{
    lenderId: localStorage.getItem("userId")
}).then((res) => {
    console.log(res.data);
    if(res.data.status == "y") {
        const negotiations = res.data.list;
        if(negotiations.length == 0) {
            document.getElementById('negotiationComment').innerHTML = `<p id="noBid">No Active Bids Found</p>`;
        } else {
            document.getElementById('negotiationComment').innerHTML = '';
            let append = '';
            for(let i = 0; i < negotiations.length; i++) {
                const bid = negotiations[i];
                append += `<tr id="${bid._id}" class='selectedRows' onclick='selectloan(this)'><td>${bid.amount}</td><td>${bid.duration}</td><td>${bid.interest}</td><td>${bid.installment}</td></tr>`;
            }
            document.getElementById('bidList').innerHTML += append;
            console.log("updated bids successfully")
        }
    } else {
        alert("something went wrong. Please try again.");
        window.location.href = "../views/account.html"
    }
})

function cancelRequest() {
    window.location.href = "../views/list.html";
}