function register_form(){
	loginhtml = $("#loginform").html();
	var newform = "<form id='registerform'>"
	newform += '<p> Register </p><p><input type="text" id="username" placeholder="Username" required> </p><p><input type="password" id="password" placeholder="Password" required></input></p>';
	newform += '<p><button id="create" onclick="create_user()">Create</button></p><p><button id="goback" onclick="back()">Go back</button></p></form>'
	document.getElementById("stage").innerHTML = newform;
	
}