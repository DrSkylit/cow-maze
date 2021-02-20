// This is a class that use Prim’s Algorithm to generate a maze

function PrimsMaze(context,size){
	this.size = size;
	this.context = context;
	this.grid = [];
	this.frontier = [];
	this.maze;
	this.visitedCount = 0;
	this.tileSize = canvas.width/this.size;
	this.removedWalls = [];
	this.createMaze = function(){
		this.initializeGrid();
		this.context.beginPath();
		//pick random grid position
		var x = Math.floor(Math.random() * size); 
		var y = Math.floor(Math.random() * size);
		// change cell to visited
		this.grid[x][y].visited = true;
		this.visitedCount ++;
		// grab neighboring cells coords and add them frontier
		this.addNeighbors(x,y);
		// while we have frontier coords
		while(this.frontier.length > 0){
			// grab a random coord
			var randFrontier= Math.floor(Math.random() * this.frontier.length);
			// pop the coord off the frontier stack
			var coords = this.frontier.splice(randFrontier, 1)[0];
			// set it on the grid and choose a wall to remove
			this.grid[coords.x][coords.y].visited = true;
			this.visitedCount ++;
			this.openWall(coords.x,coords.y);
			// grab neighboring cells coords and add them frontier
			this.addNeighbors(coords.x,coords.y);
		}
	}

	this.initializeGrid = function(){
		for (var i = 0; i < size; i++) {
			this.grid.push([]);
			for (var j = 0; j < size; j++) {
				this.grid[i].push({
					visited:false,
					x:i,
					y:j,
					openWalls:[]
				});
			}
		}
	}

	this.addNeighbors = function(x,y){
		if(x+1 < size && this.grid[x+1][y].visited != true){
			if(!this.checkFrontier(x+1,y)){	
				this.frontier.push({
					x:x+1,
					y:y
				});
			}
		}
		if(x-1 >= 0 && this.grid[x-1][y].visited != true){
			if(!this.checkFrontier(x-1,y)){	
				this.frontier.push({
					x:x-1,
					y:y
				});
			}
		}
		if(y+1 < size && this.grid[x][y+1].visited != true){
			if(!this.checkFrontier(x,y+1)){
				this.frontier.push({
					x:x,
					y:y+1
				});
			}
		}
		if(y-1 >= 0 && this.grid[x][y-1].visited != true){
			if(!this.checkFrontier(x,y-1)){
				this.frontier.push({
					x:x,
					y:y-1
				});
			}
		}
	}

	this.openWall = function(frontierX,frontierY){
		var walls = []
		if(frontierX > 0 && this.grid[frontierX-1][frontierY].visited == true){
			walls.push({x:frontierX-1,y:frontierY});
		}
		if(frontierX < this.size-1 && this.grid[frontierX+1][frontierY].visited == true){
			walls.push({x:frontierX+1,y:frontierY});
		}
		if(frontierY > 0 && this.grid[frontierX][frontierY-1].visited == true){
			walls.push({x:frontierX,y:frontierY-1});
		}
		if(frontierY < this.size-1 && this.grid[frontierX][frontierY+1].visited == true){
			walls.push({x:frontierX,y:frontierY+1});
		}
		temp = Math.floor(Math.random() * walls.length);
		wallToRemove = walls[temp]
		this.grid[frontierX][frontierY].openWalls.push(wallToRemove);
		this.grid[wallToRemove.x][wallToRemove.y].openWalls.push({x:frontierX,y:frontierY});
		this.removedWalls.push(wallToRemove);
		this.removedWalls.push({x:frontierX,y:frontierY})
	}

	this.checkFrontier = function(x,y){
		for (var i = 0; i < this.frontier.length; i++) {
			if(this.frontier[i].x == x && this.frontier[i].y == y){
				return true;
			}
		}
		return false;
	}

	this.drawMaze = function(){
		var removeTop = false;
		var removeBottom = false;
		var removeLeft = false;
		var removeRight = false;

		var x = 0;
		var y = 0;
		context.beginPath();
		for (var i = 0; i < this.grid.length; i++) {
			for (var j = 0; j < this.grid[i].length; j++) {
				for (var k = 0; k < this.grid[i][j].openWalls.length; k++) {
					if((i-1) == this.grid[i][j].openWalls[k].x){
						removeTop = true;
					}
					if((i+1) == this.grid[i][j].openWalls[k].x){
						removeBottom = true 
					}
					if((j-1) == this.grid[i][j].openWalls[k].y){
						removeLeft = true;
					}
					if((j+1) == this.grid[i][j].openWalls[k].y){
						removeRight = true 
					}
				}
				context.moveTo(x,y);
				if(!removeTop){
					context.lineTo(x+this.tileSize,y);
				}
				context.moveTo(x+this.tileSize,y);

				if(!removeRight){
					context.lineTo(x+this.tileSize,y+this.tileSize);
				}
				context.moveTo(x+this.tileSize,y+this.tileSize);

				if(!removeBottom){
					context.lineTo(x,y+this.tileSize);
				}
				context.moveTo(x,y+this.tileSize);
				if(!removeLeft){
					context.lineTo(x,y);
				}
				x = x + this.tileSize;

				removeTop = false;
				removeBottom = false;
				removeLeft = false;
				removeRight = false;
			}
			y = y + this.tileSize;
			x = 0;
		}
		context.stroke();
		// sent start text
		context.font = '18px sans-serif';
  		context.strokeText('Start', 0, 20);
  		// sent end text
  		context.font = '18px sans-serif';
  		context.strokeText('End', this.tileSize*(this.size)-35,this.tileSize*(this.size)-10);
	}

	this.getGrid = function(){
		return this.grid;
	}
}
