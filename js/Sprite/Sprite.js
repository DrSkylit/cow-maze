
function Sprite(width,height,mazeSize,context,moveList){
	this.width = width;
	this.height = height;
	this.context = context;
	this.x = 0;
	this.y = 0;
	this.mazeSize = mazeSize;
	this.padding = 10;
	this.moves = [];
	this.cowImg = new Image();
	this.score = 0;
	this.moveList = moveList.reverse();
	this.createSprite = function(x,y){
		this.moveList.shift();
		this.cowImg.src = 'images/cow.png';
		this.context.beginPath();
		this.x = x;
		this.y = y;
		this.oldX = x;
		this.oldY = y;
		this.context.drawImage(this.cowImg, x+this.padding/2, y+this.padding/2, this.width-this.padding, this.height-this.padding);
	}
	this.move = function(x,y,openWalls,hint){
		this.x += x;
		this.y += y;
		var setScore = true;
		if(this.x < 0){
			x+=1;
			setScore = false;
		}
		if(this.x > this.mazeSize-1){
			x-=1;
			setScore = false;
		}
		if(this.y < 0){
			y+=1
			setScore = false;
		}
		if(this.y > this.mazeSize-1){
			y-=1;
			setScore = false;
		}

		var move = false;
		for (var i = 0; i < openWalls.length; i++) {
			if(this.y == openWalls[i].x && this.x == openWalls[i].y){
				move = true;
				setScore = true;
				break;
			}
		}
		if(move == false){
			setScore = false;
			this.y = this.oldY
			this.x = this.oldX
		}
		this.oldX = this.x;
		this.oldY = this.y;
		if(setScore == true){
			if(this.y == this.moveList[0].x && this.x == this.moveList[0].y){
				if(hint == true){
					this.score -=3;
				}else{
					this.score += 5;
				}
				this.moveList.shift();
			}else{
				this.score -= 2;
			}
		}

		// set all moves
		var push = true;
		for (var i = 0; i < this.moves.length; i++) {
			if(this.moves[i].x == this.x && this.moves[i].y == this.y){
				push = false;
				break;
			}
		}
		if(push){
			this.moves.push({x:this.x,y:this.y});
		}
	}
	this.draw = function(){
		var moveToX = this.width*this.x+this.padding/2;
		var moveToY = this.height*this.y+this.padding/2;
		this.context.drawImage(this.cowImg,moveToX,moveToY,this.height - this.padding,this.width - this.padding);
	}
}