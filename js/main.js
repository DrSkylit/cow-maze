var lastTime;
var context;
var prim;
var sprite;
var ShowFullPath = false;
var maze;
var mazeSize;
var downKeys = [];
var timer = 0;
document.addEventListener("DOMContentLoaded", function(){
	var size = getGameSize();
	startGame(size);

	var newGameBtn = document.getElementById('new-game-btn');
	newGameBtn.addEventListener("click",function(){
		startGame(mazeSize);
	});

	var changeGameBtn = document.getElementById('change-size-btn');
	changeGameBtn.addEventListener("click",function(){
		var size = getGameSize();
		startGame(size);
	});

});

function getGameSize(){
	radioCtn = document.getElementById("radio-ctn");
	for (var i = 0; i < radioCtn.children.length; i++) {
		if(radioCtn.children[i].checked){
			var size = radioCtn.children[i].value;
		}
	}
	return size;
}

function startGame(size){
	lastTime = performance.now()
	mazeSize = size;
	var canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	var tileSize = canvas.width/mazeSize;
	prim = new PrimsMaze(context,mazeSize);
	prim.createMaze();
	maze = prim.getGrid();
	prim.drawMaze();
	var solver = new Solver(maze,{x:0,y:0},{x:mazeSize-1,y:mazeSize-1},mazeSize);
	solver.solve();
	prim.setMoveList(solver.getMoveList());
	sprite = new Sprite(prim.tileSize,prim.tileSize,mazeSize,context);
	sprite.createSprite(0,0);
	window.addEventListener( "keydown", doKeyDown, true);
	window.addEventListener( "keyup", doKeyUp, true);
	window.requestAnimationFrame(gameLoop);
}

function doKeyDown(e){
	if(downKeys.includes(e.key) == false && (e.key == "ArrowDown" || e.key == "s" || e.key == "k")){
		sprite.y+=1;
	}
	if(downKeys.includes(e.key) == false && (e.key == "ArrowUp" || e.key == "w" || e.key == "i")){
		sprite.y-=1;
	}
	if(downKeys.includes(e.key) == false && (e.key == "ArrowRight" || e.key == "d" || e.key == "l")){
		sprite.x+=1;
	}
	if(downKeys.includes(e.key) == false && (e.key == "ArrowLeft" || e.key == "a" || e.key == "j")){
		sprite.x-=1;
	}

	if(downKeys.includes(e.key) == false && e.key == "p"){
		if(prim.showPath == false){
			prim.showPath = true;
			prim.showHint = false
		}else{
			prim.showPath = false;
		}
	}

	if(downKeys.includes(e.key) == false &&e.key == "b"){
		if(prim.showCrumbs == false){
			prim.showCrumbs = true;
			prim.setBreadCrumbs(sprite.moves);
		}else{
			prim.showCrumbs = false;
		}
	}

	if(downKeys.includes(e.key) == false && e.key == "h"){
		if(prim.showHint == false){
			prim.showHint = true;
		}else{
			prim.showHint = false;
		}
	}
	if(downKeys.indexOf(e.key) == -1){
		downKeys.push(e.key);
	}
}

function doKeyUp(e){
	var index = downKeys.indexOf(e.key);
	downKeys.splice(index,1);
}

function gameLoop(currentTime){
	var elapsedTime = currentTime - lastTime;
	update(elapsedTime);
	render();

	lastTime = currentTime
	window.requestAnimationFrame(gameLoop);
}

function update(time){
	timer += time/1000; 
}

function render(){
	document.getElementById("timer").innerHTML = "Timer:" + Math.round(timer)
	if(prim.showHint){
		var solver = new Solver(maze,{x:sprite.y,y:sprite.x},{x:mazeSize-1,y:mazeSize-1},mazeSize);
		solver.solve();
		prim.setMoveList(solver.getMoveList());
	}
	if(prim.showPath){
		var solver = new Solver(maze,{x:sprite.y,y:sprite.x},{x:mazeSize-1,y:mazeSize-1},mazeSize);
		solver.solve();
		prim.setMoveList(solver.getMoveList());
	}
	context.clearRect(0, 0, canvas.width, canvas.height);
	prim.drawMaze(ShowFullPath);
	sprite.collision(prim.getGrid());
	sprite.draw();
	checkWin();
}

function checkWin(){
	if(sprite.x == mazeSize-1 && sprite.y == mazeSize-1){
		console.log("you win");
	}
}