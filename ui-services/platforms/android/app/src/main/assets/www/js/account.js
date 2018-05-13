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
        id: "midPendingTx",
        href: "../views/",
        active: false
    }, {
        id: "midCloseTx",
        href: "../views/",
        active: false
    }, {
        id: "borrow",
        href: "../views/borrow.html",
        active: true
    }, {
        id: "lend",
        href: "../views/lend.html",
        active: true
    }
];

for(let i = 0; i < redirections.length; i++) {
    if(redirections[i].active) {
        $(`#${redirections[i].id}`).on('click', (e) => {
            window.location = redirections[i].href
        });
    }
}