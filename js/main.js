var lastTime;
var context;
var prim;
var sprite;
var ShowFullPath = false;
var maze;
var mazeSize;
var downKeys = [];
var timer = 0;
var isStarted = false;
var isFinished = false;
var moveList;
var highScores = [];
document.addEventListener("DOMContentLoaded", function(){
	var size = getGameSize();
	startGame(size);

	var newGameBtn = document.getElementById('new-game-btn');
	newGameBtn.addEventListener("click",function(){
		isStarted = false;
		sprite.score = 0;
		timer = 0;
		document.getElementById("timer").innerHTML = "Timer: " + Math.round(timer);
		document.getElementById("score").innerHTML = "Score: " + sprite.score;
		var size = getGameSize();
		window.removeEventListener( "keydown", doKeyDown, true);
		window.removeEventListener( "keyup", doKeyUp, true);
		startGame(size);
	});

	var changeGameBtn = document.getElementById('change-size-btn');
	changeGameBtn.addEventListener("click",function(){
		isStarted = false;
		sprite.score = 0;
		timer = 0;
		document.getElementById("timer").innerHTML = "Timer: " + Math.round(timer);
		document.getElementById("score").innerHTML = "Score: " + sprite.score;
		var size = getGameSize();
		window.removeEventListener( "keydown", doKeyDown, true);
		window.removeEventListener( "keyup", doKeyUp, true);
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
	isFinished = false;
	timer = 0;
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
	moveList = solver.getMoveList();
	sprite = new Sprite(prim.tileSize,prim.tileSize,mazeSize,context,moveList);
	sprite.createSprite(0,0);
	window.addEventListener( "keydown", doKeyDown, true);
	window.addEventListener( "keyup", doKeyUp, true);
	setTimeout(function(){
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		prim.drawMaze(ShowFullPath);
		sprite.draw();
		context.globalAlpha = 0.5;
		context.fillStyle = "#000";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.globalAlpha = 1;
		context.fillStyle = "#fff";
		context.font = '40px sans-serif';
		text = "Press Space To Start";
		textWidth = context.measureText(text).width;
		context.fillText(text,(canvas.width/2) - (textWidth / 2), canvas.height/2);
	}, 100);
}

function doKeyDown(e){
	var grid = prim.getGrid();
	var openWalls = grid[this.sprite.y][this.sprite.x].openWalls
	if(downKeys.includes(e.key) == false && (e.key == "ArrowDown" || e.key == "s" || e.key == "k")){
		sprite.move(0,1,openWalls,prim.showHint);
		e.preventDefault();
	}
	if(downKeys.includes(e.key) == false && (e.key == "ArrowUp" || e.key == "w" || e.key == "i")){
		sprite.move(0,-1,openWalls,prim.showHint);
		e.preventDefault();
	}
	if(downKeys.includes(e.key) == false && (e.key == "ArrowRight" || e.key == "d" || e.key == "l")){
		sprite.move(1,0,openWalls,prim.showHint);
		e.preventDefault();
	}
	if(downKeys.includes(e.key) == false && (e.key == "ArrowLeft" || e.key == "a" || e.key == "j")){
		sprite.move(-1,0,openWalls,prim.showHint);
		e.preventDefault();
	}

	if(downKeys.includes(e.key) == false && e.key == "p"){
		if(prim.showPath == false){
			prim.showPath = true;
			sprite.score -= 50;
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
	if(e.code == "Space"){
		if(isStarted == false && isFinished == false){
			context.clearRect(0, 0, canvas.width, canvas.height);
			isStarted = true;
			lastTime = performance.now()
			window.requestAnimationFrame(gameLoop);
		}
	}
	if(downKeys.indexOf(e.key) == -1){
		downKeys.push(e.key);
	}
}

function doKeyUp(e){
	var index = downKeys.indexOf(e.key);
	downKeys.splice(index,1);
	if(e.code == "Space"){
		e.preventDefault();
	}
}

function gameLoop(currentTime){
	var elapsedTime = currentTime - lastTime;
	update(elapsedTime);
	render();

	lastTime = currentTime
	if(isStarted == true){
		window.requestAnimationFrame(gameLoop);
	}
}

function update(time){
	timer += time/1000; 
}

function render(){
	document.getElementById("timer").innerHTML = "Timer: " + Math.round(timer);
	document.getElementById("score").innerHTML = "Score: " + sprite.score;
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
	sprite.draw();
	if(checkWin()){
		winState();
	}
}

function checkWin(){
	if(sprite.x == mazeSize-1 && sprite.y == mazeSize-1){
		return true
	}
}

function winState(){
	isStarted = false;
	isFinished = true;
	context.globalAlpha = 0.5;
	context.fillStyle = "#000";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.globalAlpha = 1;
	context.fillStyle = "#fff";
	context.font = '40px sans-serif';
	text = "Congratulations, You Solved It!!";
	textWidth = context.measureText(text).width;
	context.fillText(text,(canvas.width/2) - (textWidth / 2), canvas.height/2);
	var currentScore = {score:sprite.score,time:Math.round(timer),size:mazeSize};	
	highScores.push(currentScore);
	
	var node = document.getElementById('high-scores');
	highScores.sort((a, b) => (a.score < b.score) ? 1 : -1)
	node.innerHTML = "High Scores";
	for (var i = 0; i < highScores.length; i++) {
		node.innerHTML += "<br>";
		node.innerHTML += "Score: " + highScores[i].score + " Time: " + highScores[i].time + " Maze Size:" + highScores[i].size + "x" + highScores[i].size;
	}
}