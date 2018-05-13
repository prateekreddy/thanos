console.log("register.js")
function register(){
    console.log("register")
    var registerDocument = document.getElementById("registerForm").elements;
    var name = registerDocument[0].value;
    var mobile = registerDocument[1].value;
    var password = registerDocument[2].value;
    console.log(name,mobile,password)
    if(name == undefined || name == null || password == undefined || password == null || mobile == undefined || mobile == null || name== "" || mobile == "" || password == ""){
        alert("Missing Fields")
    }else{
        createAccount(password,function(key){
            console.log(thanosConfig)
            axios.post(thanosConfig.loginServer+":8000"+"/auth/register",{
                phNo:"mobile",
                name:name,
                userKey: "0x"+key.address
            }).then(function(data){
                console.log(data)
                window.localStorage.setItem("key",key)
                window.localStorage.setItem("mobile",mobile)
                window.localStorage.setItem("name",name)
                window.localStorage.setItem("userId",data.userId)
                window.location.href="upi.html?mobile="+mobile
            }).catch(function(err){
                console.log(err)
                alert(err)
                alert("Sign Up Failed")
            })
        })
    }
}

const createAccount = (password, callback) => {
    const params = { keyBytes: 32, ivBytes: 16 };
   
    keythereum.create(params, (dk) => {
      const options = {
        kdf: 'pbkdf2',
        cipher: 'aes-128-ctr',
        kdfparams: {
          c: 262144,
          dklen: 32,
          prf: 'hmac-sha256',
        },
      };
      keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, (keyObject) => {
       // this is the encrypted private key
       callback(keyObject)
      });
    });
};