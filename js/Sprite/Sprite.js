
function Sprite(width,height,mazeSize,context){
	this.width = width;
	this.height = height;
	this.context = context;
	this.x = 0;
	this.y = 0;
	this.mazeSize = mazeSize;
	this.padding = 10;
	this.moves = [];
	this.cowImg = new Image();
	this.createSprite = function(x,y){
		this.cowImg.src = 'images/cow.png';
		this.context.beginPath();
		this.x = x;
		this.y = y;
		this.oldX = x;
		this.oldY = y;
		this.context.drawImage(this.cowImg, x+this.padding/2, y+this.padding/2, this.width-this.padding, this.height-this.padding);
	}
	this.draw = function(){
		var push = true;
		var moveToX = this.width*this.x+this.padding/2;
		var moveToY = this.height*this.y+this.padding/2;
		this.context.drawImage(this.cowImg,moveToX,moveToY,this.height - this.padding,this.width - this.padding);
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
	this.collision = function(grid){
		if(this.x < 0){
			this.x+=1;
		}
		if(this.x > this.mazeSize-1){
			this.x-=1;
		}
		if(this.y < 0){
			this.y+=1
		}
		if(this.y > this.mazeSize-1){
			this.y-=1;
		}
		var move = false;
		var openWalls = grid[this.oldY][this.oldX].openWalls;
		for (var i = 0; i < openWalls.length; i++) {
			if(this.y == openWalls[i].x && this.x == openWalls[i].y){
				move = true;
				break;
			}
		}
		if(move == false){
			this.y = this.oldY
			this.x = this.oldX
		}
		this.oldX = this.x;
		this.oldY = this.y;
	}
}