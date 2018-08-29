//Deal with the music feature
function pauseMusic(){
	var music_id = document.getElementById("myAudio");
	var play_id = document.getElementById("music");
	music_id.pause();
	play_id.innerHTML = "Enable Music";
	play_id.onclick = playMusic;
}
function playMusic(){
	var music_id = document.getElementById("myAudio");
	var play_id = document.getElementById("music");
	music_id.play();
	play_id.innerHTML = "Disable Music";
	play_id.onclick = pauseMusic;
}
function video(){
	var div = document.getElementById("tutorial");
	var button = document.getElementById("tut");
	var video_id = document.getElementById("tut_video");
	div.style.display="block";
	pauseMusic();
	window.onclick=function(event){
		if (event.target != button ){
			div.style.display = "none";
			playMusic();
		}
		
	}
}