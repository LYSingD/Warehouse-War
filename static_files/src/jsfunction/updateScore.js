function update(score){
	var params = {
		async: false,
		method: "POST", 
		url: "api/api.php", 
		data: JSON.stringify({ fun : "update_score" , username : session_user , score : score }),
	}
	contentData: "application/JSON"
	$.ajax(params);
}