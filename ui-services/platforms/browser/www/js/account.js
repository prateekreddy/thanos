document.getElementById("username").innerHTML = "Welcome "+localStorage.getItem("name")
document.getElementById("userId").innerHTML = "#"+localStorage.getItem("userId")+", since 2018"

const redirections = [
    {
        id: "midupi",
        href: "../views/upi.html",
        active: true
    }, {
        id: "midRunningTx",
        href: "../views/",
        active: false
    }, {
        id: "midCloseTx",
        href: "../views/",
        active: false
    }, {
        id: "lend",
        href: "../views/list.html",
        active: true
    },{
        id:"logout",
        href: "../index.html",
        active:true
    }
];

for(let i = 0; i < redirections.length; i++) {
    if(redirections[i].active) {
        $(`#${redirections[i].id}`).on('click', (e) => {
            window.location = redirections[i].href
        });
    }
}

function borrowClick(){
 axios.post(thanosConfig.mongoService+":3001/buy/count",{
     user:localStorage.getItem("userId")
 }).then(function(response){
     console.log(response.data)
    if(response.data.info == 0){
        window.location.href = "../views/borrow.html"
    }else{
        alert("Already Loan")
        window.location.href = "../views/pending.html"
    }
 })
}

function getCreditScore() {
    axios.get(thanosConfig.loginServer+":8000/loan/getReputation?userId="+localStorage.getItem("userId")).then((resp) => {
        console.log(resp.data);
        document.getElementById("scorenumber").innerHTML = resp.data;
    });
}


getCreditScore();

function pendingClick(){
    axios.post(thanosConfig.mongoService+":3001/buy/count",{
        user:localStorage.getItem("userId")
    }).then(function(response){
        console.log(response.data)
       if(response.data.info == 0){
            alert("No Pending Loans")
            window.location.href = "../views/borrow.html";
        }else{
            window.location.href = "../views/pending.html"
       }
    })
}

function lendClick(){
    console.log("lendClick")
}