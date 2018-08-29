/* This serves the static content and runs a RESFUL api using express 
	for user managment, and allows users to advertis and pick worlds to join.
*/

// Serves static content.
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var format = require('util').format;
var assert = require('assert');

//Initialize
var app = express();
var port = 10520;
var users = {};
var output = {};
var current_users = "";
var url = 'mongodb://liyan23:35133@mcsdb.utm.utoronto.ca/liyan23_309';
var db = mongojs('liyan23:35133@mcsdb.utm.utoronto.ca/liyan23_309', ['liyan23_309']);

/* The first login page */
// Set up the static folder
app.use('/', express.static(path.join(__dirname,'static_files'))); 

// Body-parser
/*
Base on research:
.json() parses the text as JSON and expses the result to request
.urlencoded({extended: false || true}): parses the text as URL with simple (false) or complciated (true)
*/
app.use(bodyParser.urlencoded({ extended: false})); //to support URL-encoded bodies
app.use(bodyParser.json()); //to support JSON-encoded bodies

//Check the Validator
app.use(expressValidator());

/* The Login page */
app.post('/', function(req, res){
	var name = req.body.username;
	var password = req.body.password;

	req.checkBody('username', 'Username cannot be empty').notEmpty();
	req.checkBody('password', 'Password cannot be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.json({response:'empty'});
	}else{
		mongodb.connect(url, function(err, db){
			if (err){
				throw err;
			} else {
				var collection = db.collection('gameusers');
				var result = collection.find({"username":name, "password":password});
				result = result.toArray(function(err, docs){
					assert.equal(err, null);

					var doc = docs[0];
					if(docs.length > 0){
						users[name] = {'username': doc.username, 'password': doc.password, 'score':doc.score, 'num_played': doc.num_played, 'avg_score': doc.avg_score, 'highest_score':doc.highest_score};
						res.json({response: 'success'});
					}else{
						res.json({response:'no-matched'});
					}
				})
				//Go to Lobby




			}
		});
	}
});
/* The Register page */
app.post('/register', function (req, res){
	var name = req.body.name;
	var password1 = req.body.fir_password;
	var password2 = req.body.sec_password;

	req.checkBody('name', 'Username Cannot be empty').notEmpty();
	req.checkBody('fir_password', 'Password Cannot be empty').notEmpty();
	req.checkBody('sec_password', 'Confirm Password Cannot be empty').notEmpty();
	req.checkBody('sec_password', 'Confirm Password is not same as the first password').equals(req.body.fir_password);

	var errors = req.validationErrors();

	if(errors){
		res.json({response:'empty'});
	}else{
		mongodb.connect(url, function(err, db){
			if (err){
				throw err;
			} else {
				var collection = db.collection('gameusers');
				var result = collection.find({"username":name, "password":password1});
				result = result.toArray(function(err, docs){
					assert.equal(err, null);
					if(docs.length > 0){
						res.json({response:'failed'});
					}else{
						var data = {"username":name, "password":password1, "score":[], "num_played":0, "avg_score":0, "highest_score":0};
						var insert = collection.insert(data);
						users[name] = {'username': data.username, 'password': data.password, 'score':data.score, 'num_played': data.num_played, 'avg_score': data.avg_score, 'highest_score':data.highest_score};
						res.json({response:'success'});
					}
				})
			}
		});
	}

});

//Dealing with the API.
app.get('/api', function(req,res){
	res.send("Please use /api/gameusers");
});

app.get('/api/gameusers', function(req, res){
	mongodb.connect(url, function(err, db){
		if(err){
			throw err;
		} else {
			var collection = db.collection('gameusers');
			var result = collection.find();
			result = result.toArray(function(err, docs){
				assert.equal(err, null);
				for (var i = 0; i < docs.length; i++){
					output[i] = docs[i].username;					
				}
				res.json(output);
			});
		}
	});
});

app.get('/api/gameusers/:username', function(req, res){
	mongodb.connect(url, function(err, db){
		if(err){
			throw err;
		} else {
			var collection = db.collection('gameusers');
			var result = collection.find({"username":req.params.username});
			result = result.toArray(function(err, docs){
				assert.equal(err, null);
				var doc = docs[0];
				if(docs.length == 0){
					res.send("No such user");
				}else{
					if(req.params.username in users){
						res.json(users[req.params.username]);
					}else{
						res.send("You have to login in first");
					}
				}
			})
		}
	})
});

app.get('/api/gameusers/:username/password', function(req,res){
	mongodb.connect(url, function(err, db){
		if(err){
			throw err;
		} else {
			var collection = db.collection('gameusers');
			var result = collection.find({"username":req.params.username});
			result = result.toArray(function(err, docs){
				assert.equal(err, null);
				var doc = docs[0];
				if(docs.length == 0){
					res.send("No such user");
				}else{
					if(req.params.username in users){
						res.json(users[req.params.username].password);
					}else{
						res.send("You have to login in first");
					}
				}
			})
		}
	})
});

app.get('/api/gameusers/:username/score', function(req,res){
	mongodb.connect(url, function(err, db){
		if(err){
			throw err;
		} else {
			var collection = db.collection('gameusers');
			var result = collection.find({"username":req.params.username});
			result = result.toArray(function(err, docs){
				assert.equal(err, null);
				var doc = docs[0];
				if(docs.length == 0){
					res.send("No such user");
				}else{
					if(req.params.username in users){
						res.json(users[req.params.username].score);
					}else{
						res.send("You have to login in first");
					}
				}
			})
		}
	})

});

app.get('/api/gameusers/:username/num_played', function(req,res){
	mongodb.connect(url, function(err, db){
		if(err){
			throw err;
		} else {
			var collection = db.collection('gameusers');
			var result = collection.find({"username":req.params.username});
			result = result.toArray(function(err, docs){
				assert.equal(err, null);
				var doc = docs[0];
				if(docs.length == 0){
					res.send("No such user");
				}else{
					if(req.params.username in users){
						res.json(users[req.params.username].num_played);
					}else{
						res.send("You have to login in first");
					}
				}
			})
		}
	})

});

app.get('/api/gameusers/:username/avg_score', function(req,res){
	mongodb.connect(url, function(err, db){
		if(err){
			throw err;
		} else {
			var collection = db.collection('gameusers');
			var result = collection.find({"username":req.params.username});
			result = result.toArray(function(err, docs){
				assert.equal(err, null);
				var doc = docs[0];
				if(docs.length == 0){
					res.send("No such user");
				}else{
					if(req.params.username in users){
						res.json(users[req.params.username].avg_score);
					}else{
						res.send("You have to login in first");
					}
				}
			});
		}
	})
});

app.get('/api/gameusers/:username/highest_score', function(req,res){
	mongodb.connect(url, function(err, db){
		if(err){
			throw err;
		} else {
			var collection = db.collection('gameusers');
			var result = collection.find({"username":req.params.username});
			result = result.toArray(function(err, docs){
				assert.equal(err, null);
				var doc = docs[0];
				if(docs.length == 0){
					res.send("No such user");
				}else{
					if(req.params.username in users){
						res.json(users[req.params.username].highest_score);
					}else{
						res.send("You have to login in first");
					}
				}
			})
		}
	})
});

app.post('/api/gameusers/:username/:score', function(req,res){
	mongodb.connect(url, function(err,db){
		if(err){
			throw err;
		} else {
			var collection = db.collection('gameusers');
			var result = collection.find({"username":req.params.username});
			result = result.toArray(function(err, docs){
				assert.equal(err, null);
				var doc = docs[0];
				if(docs.length == 0){
					res.send("No such user");
				}else{
					var score_list = doc.score;
					var num_played = doc.num_played;
					var avg_score = 0;
					var highest_score = parseInt(doc.highest_score);
					score_list.push(req.params.score);
					num_played++;
					if(req.params.score > highest_score){
						highest_score = parseInt(req.params.score);
					}
					for(var i = 0; i < score_list.length; i++){
						avg_score = avg_score + parseInt(score_list[0]);
					}
					avg_score = avg_score / score_list.length;
					console.log(score_list);
					console.log(num_played);
					console.log(avg_score);
					console.log(highest_score);
					db.collection('gameusers').update({"username":req.params.username}, {"username":req.params.username, "password":doc.password, "score": score_list, "num_played": num_played, "avg_score":avg_score, "highest_score": highest_score});
				}
			});
			
		}
	})
});


app.listen(port, 'cslinux.utm.utoronto.ca', function () {
  console.log('Example app listening on port '+ port + '!');
});

