document.getElementById("phoneNumber").innerHTML = "You are connected to this Account from the phone number "+modify(localStorage.getItem("mobile"))

function modify(phoneNumber){
    let data = ""+phoneNumber
    return data.substring(0,3)+"-"+data.substring(3,6)+"-"+data.substring(6,10);
}