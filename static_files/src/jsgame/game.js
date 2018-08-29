function startGame(time, mode){
	console.log(1);
	time_start = new Date();
	time_mode = time;
	game_mode = mode;
	$(".controls").css("visibility", "visible");
	$("#pause").css("visibility", "visible");
	$(".score").css("visibility", "visible");
	$("#tut").css("visibility", "hidden");
	// Parameter - mode : 0 means easy, 1 means hard.
	if(interval === null){
		t = setTimeout(display, 1000);
		interval = setInterval(process, time_mode);
		document.addEventListener("keydown",KeyDown, false);	
	} 
}

function process(){
	if(typeof(stage.get_player()) == "undefined"){
		endGame(1);
	}else{
		stage.step(game_mode);
		stage.kill_monster();
		$(".score").text("Score:" + stage.score);
		if(stage.win()){
			endGame(0);
		};
	};
}
function endGame(win_lose){
	clearTimeout(t);
	clearInterval(interval);
	var button = $("img.move");
	for(var i=0; i<button.length;i++){
		button[i].style.pointerEvents = 'none';
	}
	document.removeEventListener("keydown", KeyDown, false);
	if(win_lose == 0){ //Player win the game.
		alert("You win!");
		$("#pause").fadeOut();
		$("#resume").fadeOut();
		$("#restart").fadeIn();
		$("#restart").css("visibility", "visible");
		//update(stage.score);
	}else{ //Player lose the game.
		alert("You lose!");
		$("#pause").fadeOut();
		$("#resume").fadeOut();
		$("#restart").fadeIn();
		$("#restart").css("visibility", "visible");
		//update(stage.score);
	}
}
//Function that pauseGame
function pauseGame(){
	// YOUR CODE GOES HERE
	$("#pause").fadeOut();
	$("#resume").fadeIn();
	$("#resume").css("visibility", "visible");
	clearTimeout(t);
	clearInterval(interval);
	var button = $("img.move");
	for(var i=0; i<button.length;i++){
		button[i].style.pointerEvents = 'none';
	}
	document.removeEventListener("keydown", KeyDown, false);
}
// Function that resume the Game
function resumeGame(){
	$("#resume").fadeOut();
	$("#pause").fadeIn();
	t = setTimeout(display, 1000);
	interval = setInterval(process, time_mode);
	var button = $("img.move");
	for(var i=0; i<button.length;i++){
		button[i].style.pointerEvents = 'auto';
	}
	document.addEventListener("keydown",KeyDown, false);
}

// Restart the game
function restartGame(){
	$("#resume").fadeOut();
	$("#pause").fadeOut();
	var button = $("img.move");
	for(var i=0; i<button.length;i++){
		button[i].style.pointerEvents = 'auto';
	}
	document.addEventListener("keydown",KeyDown, false);
	if(game_mode == 0){
		setupGame(10,10);
	}else{
		setupGame(20,20);
	}
	t = null;
	interval = null;
	startGame(time_mode, game_mode);
	$("#restart").fadeOut();
	$("#pause").fadeIn();

}

//function that dealing with key pressing down
function KeyDown(event){
	var key = String.fromCharCode(event.keyCode);

	switch(key){
		case "Q":
			stage.player_move(-1,-1);
			break;
		case "W":
			stage.player_move(-1, 0);
			break;
		case "E":
			stage.player_move(-1, 1);
			break;
		case "A":
			stage.player_move(0, -1);
			break;
		case "D":
			stage.player_move(0,1);
			break;
		case "Z":
			stage.player_move(1,-1);
			break;
		case "X":
			stage.player_move(1,0);
			break;
		case "C":
			stage.player_move(1,1);
			break;
	}

}

// Function that desplay the elapsed time
function display(){
	var time_end = new Date();

	var time_between = time_end - time_start;

	time_between = time_between / 1000;

	var secs = Math.round(time_between % 60);

	time_between = Math.floor(time_between/ 60);

	var mins = Math.round(time_between % 60);

	time_between = Math.floor(time_between / 60);

	$(".time").text("Elapsed time: " + mins + ":" + secs);
	t = setTimeout(display, 1000);
	$(".time").css("visibility", "visible");

}



