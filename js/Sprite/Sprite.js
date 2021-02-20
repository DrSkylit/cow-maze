
function Sprite(width,height,mazeSize,context){
	this.width = width;
	this.height = height;
	this.context = context;
	this.x = 0;
	this.y = 0;
	this.mazeSize = mazeSize;
	this.padding = 20;
	this.createSprite = function(x,y){
		this.context.beginPath();
		this.x = x;
		this.y = y;
		this.context.rect(x+this.padding/2, y+this.padding/2, this.width-this.padding, this.height-this.padding);
		this.context.fill();
		this.context.stroke();
	}
	this.draw = function(){
		this.context.rect(this.width*this.x+this.padding/2,this.height*this.y+this.padding/2, this.width-this.padding, this.height-this.padding);
		this.context.fill();
		this.context.stroke();
	}
	this.collision = function(removedWalls){
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
		this.draw();
	}
}