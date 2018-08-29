function create_user(){
	var username = $("#username").val().toLowerCase();
	var password = $("#password").val().toLowerCase();
	var con_password = $("#con_password").val().toLowerCase();
	var params = {
		async: false,
		method: "POST",
		dataType: 'json',
		url: "http://cslinux.utm.utoronto.ca:10520/register", 
		data: JSON.stringify({name:username , fir_password:password, sec_password: con_password }),
        contentType: "application/json",
        success: function(data){
        	if(data.response == "empty"){
        		alert('1. Username cannot be empty\n2. Password cannot be empty');
        	} else if(data.response == "failed"){
        		alert('1. Failed to register, username already existed.');
        	}else{
        		alert('Register successfully, back to login page.')
        	}
        }
    };
	$.ajax(params);
}