function Solver(maze,startPoint,endPoint,size){
	this.maze = maze;
	this.startPoint = startPoint;
	this.endPoint = endPoint;
	this.size = size;
	this.wasHere = [];
	this.correctPath = [];
	this.moveList = []

	this.solve = function(){
		this.initialize();
		this.move(this.startPoint.x,this.startPoint.y)
	}

	this.move = function(x,y){
		if(x == this.endPoint.x && y == this.endPoint.y){
			this.correctPath[x][y] = true;
			this.moveList.push({x:x,y:y});
			return true;
		}
		if(this.wasHere[x][y] == true){
			return false;
		}
		this.wasHere[x][y] = true;
		var openTop = false;
		var openBottom = false;
		var openLeft = false;
		var openRight = false;
		for (var k = 0; k < maze[x][y].openWalls.length; k++) {
			if((x-1) == this.maze[x][y].openWalls[k].x){
				openTop = true;
			}
			if((x+1) == this.maze[x][y].openWalls[k].x){
				openBottom = true;
			}
			if((y-1) == this.maze[x][y].openWalls[k].y){
				openLeft = true;
			}
			if((y+1) == this.maze[x][y].openWalls[k].y){
				openRight = true;
			}
		}
		if(openBottom){
			if(x+1 < this.size &&this.move(x+1,y)){
				this.correctPath[x][y] = true;
				this.moveList.push({x:x,y:y});
				return true;
			} 
		}
		if(openRight){
			if(y+1 < this.size && this.move(x,y+1)){
				this.correctPath[x][y] = true;
				this.moveList.push({x:x,y:y});
				return true;
			} 
		}
		if(openLeft){
			if(y-1 >= 0 && this.move(x,y-1)){
				this.correctPath[x][y] = true;
				this.moveList.push({x:x,y:y});
				return true;
			} 
		}
		if(openTop){
			if(x-1 >= 0 && this.move(x-1,y)){
				this.correctPath[x][y] = true;
				this.moveList.push({x:x,y:y});
				return true;
			} 
		}
	}
	this.initialize = function(){
		for (var i = 0; i < this.size; i++) {
			this.wasHere.push([]);
			this.correctPath.push([]);
			for (var j = 0; j < this.size; j++) {
				this.wasHere[i].push(false);
				this.correctPath[i].push(false);
			}
		}
	}
	this.getMoveList = function(){
		return this.moveList.reverse()
	}
}