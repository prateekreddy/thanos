console.log("signin.js")
function signin(){
    console.log("signin")
    // console.log(localStorage.getItem("password"), JSON.parse(localStorage.getItem("key")))
    // var privateKey = keythereum.recover(localStorage.getItem("password"), JSON.parse(localStorage.getItem("key")));
    // console.log(privateKey)
    var registerDocument = document.getElementById("signinForm").elements;
    var mobile = registerDocument[0].value;
    var password = registerDocument[1].value;
    console.log(mobile,password)
    if(password == undefined || password == null || mobile == undefined || mobile == null || mobile == "" || password == ""){
        alert("Missing Fields")
    }else{
        axios.post(thanosConfig.loginServer+":8000"+"/auth/login",{
            phNo:mobile,
            password:password
        }).then(function(response){
            console.log(response.data)
            if(response.data.login){
                window.location.href="account.html"
                localStorage.setItem("password",password)
            }else{
                alert("incorrect password")
            }
        }).catch(function(err){
            console.log(err)
            alert("login failed")
        })
    }
}