var lastTime = performance.now()
var context;
var prim;
var sprite;
document.addEventListener("DOMContentLoaded", function(){
	var mazeSize = 10;
	var canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	var tileSize = canvas.width/mazeSize;

	prim = new PrimsMaze(context,mazeSize);
	prim.createMaze();
	var maze = prim.getGrid();
	prim.drawMaze();
	var solver = new Solver(maze,{x:0,y:0},{x:mazeSize-1,y:mazeSize-1},mazeSize);
	solver.solve();
	 console.log(solver.getMoveList());
	 console.log(solver.correctPath);
	sprite = new Sprite(prim.tileSize,prim.tileSize,mazeSize,context);
	sprite.createSprite(0,0);
	window.addEventListener( "keydown", doKeyDown, true);
	 window.requestAnimationFrame(gameLoop);

});

function doKeyDown(e){
	if(e.key == "ArrowDown"){
		sprite.y+=1;
	}
	if(e.key == "ArrowUp"){
		sprite.y-=1;
	}
	if(e.key == "ArrowRight"){
		sprite.x+=1;
	}
	if(e.key == "ArrowLeft"){
		sprite.x-=1;
	}
}

function gameLoop(currentTime){
	var elapsedTime = currentTime - lastTime;
	update(elapsedTime);
	render();

	lastTime = currentTime
	window.requestAnimationFrame(gameLoop);
}

function update(time){

}

function render(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	prim.drawMaze();
	sprite.collision(prim.removedWalls);
}
