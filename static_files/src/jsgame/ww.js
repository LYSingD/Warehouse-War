// Stage
// Note: Yet another way to declare a class, using .prototype.

function Stage(width, height, stageElementID){
	this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
	this.player=null; // a special actor, the player
	this.score=0; // a score of the player

	// the logical width and height of the stage
	this.width=width;
	this.height=height;

	// the element containing the visual representation of the stage
	this.stageElementID=stageElementID;

	// take a look at the value of these to understand why we capture them this way
	// an alternative would be to use 'new Image()'
	this.blankImageSrc=document.getElementById('blankImage').src;
	this.monsterImageSrc=document.getElementById('monsterImage').src;
	this.playerImageSrc=document.getElementById('playerImage').src;
	this.boxImageSrc=document.getElementById('boxImage').src;
	this.wallImageSrc=document.getElementById('wallImage').src;
}

// initialize an instance of the game
Stage.prototype.initialize=function(){
	// Create a table of blank images, give each image an ID so we can reference it later
	var s='<table id="game_table">';	
	var id = 1;
	for(var i=0; i < this.width; i++){
		var row = '<tr class="row" id=' + i.toString() + '>';
		for(var j=0; j < this.height; j++)
		{
			var col = '<td class="col" id=' + j.toString() + '>'; 
			var img='<img class="Blank" id=' + id.toString() + ' src=' + this.blankImageSrc;
			img+= ' width=24px height=24px>';
			col+=img+'</td>';
			row+=col;
			id+=1;
		}
		row+='</tr>';
		s+= row;
	}
	s+="</table>";
	// YOUR CODE GOES HERE
	// Put it in the stageElementID (innerHTML)
	document.getElementById(this.stageElementID).innerHTML = s;

	// Add the player to the center of the stage
	var avg_width = Math.ceil(this.width / 2) - 1;
	var avg_height = Math.ceil(this.height / 2) - 1;
	var player = this.playerImageSrc;
	var target_id = this.getStageId(avg_height, avg_width);
	var target_object = document.getElementById(target_id);
	target_object.src = player;
	target_object.className = "Player";
	this.addActor(target_object);

	// Add walls around the outside of the stage, so actors can't leave the stage
	var wall = this.wallImageSrc;
	for (var i=0; i < this.height; i++){
		var target_row = i;
		if (i == 0 || i == this.height - 1){
			for (var j=0; j < this.width; j++){
				var target_col = j;
				var target_id = this.getStageId(target_row, target_col);
				document.getElementById(target_id).src = wall;
				document.getElementById(target_id).className = "Wall";
			}
		}else{
			for (var j=0; j < this.width; j++){
				if (j == 0 || j == this.width - 1){
					var target_col = j;
					var target_id = this.getStageId(target_row, target_col);
					document.getElementById(target_id).src = wall;
					document.getElementById(target_id).className = "Wall";
				}
			}
		}
	}

	// Add some Boxes to the stage

	// Set up the maximun boxes can each row contains.
	var max_boxes = Math.ceil(this.width/3);
	for (var i=1; i < this.width-1; i++){
		var target_row = i;
		var num_boxes = 0;
		//Math.random()*Math.ceil(this.width/4))+1) is the formula that I created to calculate the maximun gap between boxes.
		for(var j=Math.floor((Math.random()*Math.ceil(this.width/4))+1); j < this.height - 1; j=j+Math.floor((Math.random()*Math.ceil(this.width/4))+1))
		{
			var target_col = j;
			var target_id = this.getStageId(target_row, target_col);
			var target_object = document.getElementById(target_id);
			if(target_object.className == "Player" || num_boxes >= max_boxes){
				continue;
			}
			var boxes=this.boxImageSrc;		
			target_object.src = boxes;
			target_object.className = "Boxes";
			this.addActor(target_object);
			num_boxes++;
		}
	}

	// Add in some Monsters
	// The first 3 line is the formula that I created to calculate the number of monster in different given width and given height.
	var num_monster_denominator = this.width + this.height;
	var num_monster_numerator = this.width * this.height;
	var num_monster = num_monster_numerator / num_monster_denominator;
	//Random assign the monster in the map.
	var m = 1
	while(m <= num_monster){
		var monsters=this.monsterImageSrc;
		location_row = Math.floor((Math.random()*this.width - 1)+1);
		location_col = Math.floor((Math.random()*this.height - 1)+1);
		var target_id = this.getStageId(location_row, location_col);
		var target_object = document.getElementById(target_id);
		// var target_row = $(".row" + location_row.toString());
		// var target_col = target_row.find("td")[location_col];
		if (!(target_object.className == "Blank") || this.check_surrounded(target_object, game_mode))
		{
			continue;
		}
		target_object.src = monsters;
		target_object.className = "Monsters";
		this.addActor(target_object);
		m = m+1;
	}


}
// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId=function(x,y){
	var target_row = $("tr#"+x.toString()+".row");
	var target_col = target_row.find("td")[y];
	var target_id  = target_col.getElementsByTagName("img")[0].id;
	return target_id; 
}

Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
}

Stage.prototype.removeActor=function(actor){
	// Lookup javascript array manipulation (indexOf and splice).
	var position = this.actors.indexOf(actor);
	this.actors.splice(position,1);
}

// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage=function(x, y, src){
	var image = src;
	var target_id = this.getStageId(x,y);
	var target_object = document.getElementById(target_id);
	target_object.src = image;
}

// This function is a helper function to know which coordinates (x,y) of this object.
Stage.prototype.getParent=function(object){
	var object_col_parent = object.parentElement;
	var object_col = parseInt(object_col_parent.id);
	var object_row_parent = object_col_parent.parentElement;
	var object_row = parseInt(object_row_parent.id);
	return [object_row, object_col];

}
// Take one step in the animation of the game. 
/* The input parameter define the mode of the game:
 * If the player have chosen "easy" mode, then the monsters won't step into play's position.
 * If the player have chosen "hard" mode, then the monsters may step into play's position.
 */

Stage.prototype.step=function(mode){
	for(var i=0;i<this.actors.length;i++){
		// each actor takes a single step in the game
		var object = this.actors[i];
		var object_class = object.className;
		if (object_class == "Player"){
			player_alive = 1;
		}
		var object_coord = this.getParent(object);
		var object_x = object_coord[0];
		var object_y = object_coord[1];
		if(object_class == "Monsters"){
				var target_row = object_x + Math.floor((Math.random() * 3) - 1);
				var target_col = object_y + Math.floor((Math.random() * 3) - 1);
				var target_id = this.getStageId(target_row,target_col);
				var target_object = document.getElementById(target_id);
				var target_class = target_object.className;
				switch(mode){
					case 0:
						if(target_class == "Blank" && (!this.check_surrounded(target_object, mode))){
							target_object.src = this.monsterImageSrc;
							target_object.className = "Monsters";
							this.addActor(target_object);
							object.src = this.blankImageSrc;
							object.className = "Blank";
							this.removeActor(object);
						}
						break;
					case 1:
						if((target_class == "Blank" || target_class == "Player") && (!this.check_surrounded(target_object, mode))){
							target_object.src = this.monsterImageSrc;
							target_object.className = "Monsters";
							this.addActor(target_object);
							object.src = this.blankImageSrc;
							object.className = "Blank";
							this.removeActor(object);
						}
						break;
				}
		}
	}
}

// Function that kill the monster when the monster is surrounded. 
Stage.prototype.kill_monster=function(){
	for(var i=0; i<this.actors.length;i++){
		var monster = this.actors[i];
		var monster_class = monster.className;
		if (monster_class == "Monsters"){
			not_safe = this.check_surrounded(monster, game_mode);
			if (not_safe){
				this.removeActor(monster);
				monster.src = this.blankImageSrc;
				monster.className = "Blank";
				this.score++;
			}
		}
	}
	
}

// Function that check is the monster got traped, the reason why I didn't push this function inside kill_monster() is becaseu I can use it 
// in the initiliaze and each step as well aviod the monster made some stupid moves.
// In the easy mode, the monster would only check if the horizontal and vertical direction around itself
// In the hard mode, the monster would need to check all the position (include diagonal direction) around itself
Stage.prototype.check_surrounded=function(monster, mode){
	var surrounded = [];
	var monster_coord = this.getParent(monster);
	var monster_x = monster_coord[0];
	var monster_y = monster_coord[1];
	switch(mode){
		case 0: //easy mode
			for(var row=-1; row<=1;row++){
				//Only check the horizontal and vertical direction only.
				var surrounded_row = monster_x + row;
				switch(row){
					case -1:
						//Only check monster's column - 0
						var surrounded_col = monster_y;
						var surrounded_id = this.getStageId(surrounded_row, surrounded_col);
						var surrounded_object = document.getElementById(surrounded_id);
						surrounded.push(surrounded_object.className);
						break;
					case 0:
						for(var col=-1; col<=1; col=col+2){
							var surrounded_col = monster_y + col;
							var surrounded_id = this.getStageId(surrounded_row, surrounded_col);
							var surrounded_object = document.getElementById(surrounded_id);
							surrounded.push(surrounded_object.className);
						}
						break;
					case 1:
						//Only check monster's column - 0
						var surrounded_col = monster_y;
						var surrounded_id = this.getStageId(surrounded_row, surrounded_col);
						var surrounded_object = document.getElementById(surrounded_id);
						surrounded.push(surrounded_object.className);
						break;
				}
			}
			break;			

		case 1: //Hard mode
			for(var row=-1; row<=1;row++){
			var surrounder_row = monster_x + row;
				for(var col=-1;col<=1;col++){
					var surrounded_col = monster_y + col;
					var surrounded_id = this.getStageId(surrounder_row, surrounded_col);
					var surrounded_object = document.getElementById(surrounded_id);
					surrounded.push(surrounded_object.className);
				}
			}	
			break;	
	}
	
	//Assume it is not surrounded
	for (var i=0; i<surrounded.length;i++){
		if(surrounded[i] == "Blank" || surrounded[i] == "Player"){
			return false;
		}
	}
	return true;
}
// Function that get the player object in the actors.
Stage.prototype.get_player=function(){
	for(var i=0; i<this.actors.length;i++){
		var object = this.actors[i];
		var object_class = object.className;
		if(object_class == "Player"){
			return object;
		}
	}
}

// Function that get the boxes object in the actors.
Stage.prototype.get_boxes=function(){
	for(var i=0; i<this.actors.length;i++){
		var object = this.actors[i];
		var object_class = object.className;
		if(object_class == "Boxes"){
			return object;
		}
	}
}

// Function that move the player by the coordinator x, y.
Stage.prototype.player_move=function(x,y){
	var player = this.get_player();
	var player_coord = this.getParent(player);
	var player_x = player_coord[0];
	var player_y = player_coord[1];
	var target_row = player_x + x;
	var target_col = player_y + y;
	var target_id = this.getStageId(target_row, target_col);
	var target_object = document.getElementById(target_id);
	var target_class = target_object.className;
	switch(target_class){
		case "Blank":
			target_object.src = this.playerImageSrc;
			target_object.className = "Player";
			this.addActor(target_object);
			this.removeActor(player)
			player.src = this.blankImageSrc;
			player.className = "Blank";
			;
			break;
		case "Monsters":
			player.src = this.blankImageSrc;
			player.className = "Blank";
			this.removeActor(player);
			break;
		case "Boxes":
			this.boxes_move(x,y,target_object, target_row, target_col);
			break;
	}
}

// Function that move the boxes recursivly until the last box hit the wall of the monster.
Stage.prototype.boxes_move=function(bx,by,target_object, target_row, target_col){
	var box = target_object;
	var new_box_row = target_row + bx;
	var new_box_col = target_col + by;
	var new_target_id = this.getStageId(new_box_row, new_box_col);
	var new_target_object = document.getElementById(new_target_id);
	var new_target_class = new_target_object.className;
	switch(new_target_class){
		case "Blank":
			new_target_object.src = this.boxImageSrc;
			new_target_object.className = "Boxes";
			this.addActor(new_target_object);
			box.src = this.blankImageSrc;
			box.className = "Blank";
			this.removeActor(box);
			this.player_move(bx,by);
			break;
		case "Boxes":
			this.boxes_move(bx,by, new_target_object, new_box_row, new_box_col);
			break;
	}
}

Stage.prototype.win=function(){
	var num_monster = 0;
	for(var i = 0; i<this.actors.length; i++){
		var object = this.actors[i];
		var object_class = object.className;
		if(object_class == "Monsters"){
			num_monster++;
		}
	}
	if (num_monster == 0){
		return true;
	}
	return false;
}
// return the first actor at coordinates (x,y) return null if there is no such actor
// there should be only one actor at (x,y)!
/* Didn't use this function.
Stage.prototype.getActor=function(x, y){
	return null;

}*/
// End Class Stage
