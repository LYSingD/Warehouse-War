function selectPorts(){
	var form='<form id="portform">';
	form+= '<p>Port</p>';
	form+='<p><button id="port1">10521</button>';
	form+='</form>'
	document.getElementById('stage').innerHTML = form;
	
}	
