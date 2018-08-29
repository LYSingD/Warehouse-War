function update(score){
	var params = {
		async: false,
		method: "POST", 
		dataType: 'json',
		url: "http://cslinux.utm.utoronto.ca:10520/api/gameusers/"+session_user+"/"+score.toString(), 
		data: JSON.stringify({username : session_user , score : score }),
		contentType: "application/json"
	};
	$.ajax(params);
}