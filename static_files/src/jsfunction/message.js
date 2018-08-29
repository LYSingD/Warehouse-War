function message(data){
	var result = JSON.parse(data)['result'];
	if(parseInt(result) == 0){
		return("Success");
	}else{
		return("Failed");
	}
}