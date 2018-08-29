function selectLevels(){
	var form='<form id="levelform">';
	form+= '<p>LEVELS</p>';
	form+='<p><button id="easy">Easy</button>';
	form+='<p><button id="hard">Hard</button>';
	form+='</form>'
	document.getElementById('stage').innerHTML = form;
}	
