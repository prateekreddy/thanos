console.log("signin.js")
function signin(){
    console.log("signin")
    var registerDocument = document.getElementById("signinForm").elements;
    var mobile = registerDocument[0].value;
    var password = registerDocument[0].value;
    console.log(mobile,password)
    if(password == undefined || password == null || mobile == undefined || mobile == null || mobile == "" || password == ""){
        alert("Missing Fields")
    }else{
        axios.post(thanosConfig.loginServer+":8000"+"/auth/login",{
            phNo:mobile,
            password:password
        }).then(function(response){
            if(response.login){
                window.location.href="account.html"
            }else{
                alert("incorrect password")
            }
        }).catch(function(err){
            alert("login failed")
        })
    }
}