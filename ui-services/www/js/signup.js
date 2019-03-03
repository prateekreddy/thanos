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
                phNo:mobile,
                name:name,
                password:password,
                userKey: "0x"+key.address
            }).then(function(response){
                console.log(response.data)
                if(response.data.status=="Registered"){
                    window.localStorage.setItem("key",JSON.stringify(key))
                    window.localStorage.setItem("mobile",mobile)
                    window.localStorage.setItem("name",name)
                    window.localStorage.setItem("userId",response.data.userId)
                    window.localStorage.setItem("password",password)
                    axios.post(thanosConfig.mongoService+":3001/register", {
                       userId: response.data.userId,
                       creditScore: 1000 
                    }).then((resp) => {
                        if(resp.data.status == 'y') {
                            window.location.href="upi.html?mobile="+mobile;
                        } else {
                            alert("Registration failed")
                        }
                    });
                }else{
                    alert("Registration failed")
                }
                
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