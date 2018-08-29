function log(char){
	console.log(char);
	var username = $("#username").val();
	var password = $("#password").val();
	var params = {
		async: false,
		method: "POST",
		dataType: 'json',
		url: "http://cslinux.utm.utoronto.ca:10520/", 
		data: JSON.stringify({"username":username , "password":password}),
        contentType: "application/json",
        success: function(response){
        	if(response.response == "empty"){
        		alert('1. Username cannot be empty\n2. Password cannot be empty');
        	} else if (response.response == "no-matched"){
        		alert('Failed to login:\n1. Username or Password is wrong');
        	}else {
        		session_user = username;
        		if(char == 'guest'){
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

					});
				}else{
					selectPorts();
					$("#port1").click(function(){
						socket.onclose = function (event) {
						// alert("closed code:" + event.code + " reason:" +event.reason + " wasClean:"+event.wasClean);
						alert("Server Maintaining");
						};
						socket.onmessage = function (event) {
							var point=JSON.parse(event.data);

							var context = document.getElementById('theCanvas').getContext('2d');
							context.fillStyle = 'rgba(255,0,0,1)';
				   			context.fillRect(point.x, point.y, 2, 2);
						};

						game_mode = 1;
						time_mode = 500;
						setupGame(20,20);
						startGame(time_mode, game_mode);
				
					});
				}
			}
		}
	};
	$.ajax(params);
}
