document.addEventListener("DOMContentLoaded", function(){
	var mazeSize = 20;
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	var prim = new PrimsMaze(context,mazeSize);
	prim.createMaze();
	var maze = prim.getGrid();
	var solver = new Solver(maze,{x:0,y:0},{x:mazeSize-1,y:mazeSize-1},mazeSize);
	solver.solve();
	console.log(solver.getMoveList());
	console.log(solver.correctPath);
	var removeTop = false;
	var removeBottom = false;
	var removeLeft = false;
	var removeRight = false;

	var x = 0;
	var y = 0;
	var boxSize = canvas.width/mazeSize;
	context.beginPath();
	for (var i = 0; i < maze.length; i++) {
		for (var j = 0; j < maze[i].length; j++) {
			for (var k = 0; k < maze[i][j].openWalls.length; k++) {
				if((i-1) == maze[i][j].openWalls[k].x){
					removeTop = true;
				}
				if((i+1) == maze[i][j].openWalls[k].x){
					removeBottom = true 
				}
				if((j-1) == maze[i][j].openWalls[k].y){
					removeLeft = true;
				}
				if((j+1) == maze[i][j].openWalls[k].y){
					removeRight = true 
				}
			}
			context.moveTo(x,y);
			if(!removeTop){
				context.lineTo(x+boxSize,y);
			}
			context.moveTo(x+boxSize,y);

			if(!removeRight){
				context.lineTo(x+boxSize,y+boxSize);
			}
			context.moveTo(x+boxSize,y+boxSize);

			if(!removeBottom){
				context.lineTo(x,y+boxSize);
			}
			context.moveTo(x,y+boxSize);
			if(!removeLeft){
				context.lineTo(x,y);
			}
			x = x + boxSize;

			removeTop = false;
			removeBottom = false;
			removeLeft = false;
			removeRight = false;
		}
		y = y + boxSize;
		x = 0;
	}
	context.stroke();

});

