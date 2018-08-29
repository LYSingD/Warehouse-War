function log(){
	var username = $("#username").val();
	var password = $("#password").val();
	var params = {
		async: false,
		method: "GET",
		url: "api/api.php", 
		data: JSON.stringify({ fun : "log" , username : username , password : password }),
        contentData: "application/JSON"

	};
	$.ajax(params).done(function(msg){
		var parse = JSON.parse(msg);
		if (parse == "good"){
			session_user = username;
			selectLevels();
			$("#easy").click(function(f){
				game_mode = 0;
				time_mode = 1000;
				setupGame(10,10);
				startGame(time_mode, game_mode);

			});
			$("#hard").click(function(f){
				game_mode = 1;
				time_mode = 500;
				setupGame(20,20);
				startGame(time_mode, game_mode);

			})
		}else{
			document.getElementById("response").value="Login failed";
		}
	});
}
