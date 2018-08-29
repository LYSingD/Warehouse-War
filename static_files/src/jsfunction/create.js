function create_user(){
	var username = $("#username").val();
	var password = $("#password").val();
	var params = {
		async: false,
		method: "PUT",
		url: "api/api.php", 
		data: JSON.stringify({ fun : "create" , username : username , password : password }),
        contentData: "application/JSON"
	};
	$.ajax(params).done(function(msg){
		var parse = JSON.parse(msg);
		document.getElementById("response").value=parse;
	});
}