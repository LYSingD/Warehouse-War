function selectLevels(){
	var form='<form id="portform">';
	form+= '<p>Levels</p>';
	form+='<p><button id="easy">Easy</button>';
	form+='<p><button id="hard">Hard</button>';
	form+='</form>'
	document.getElementById('stage').innerHTML = form;
}	
