$(document).ready(function(){

	//Canvas stuff
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    //Arrays to fill with the different objects
    var enemies = [[]];
    var warriors = [];
    var spawners = [];
    var temp3;
    /*game.state 0 = Spawn Warriors
                1 = Upgrade Warriors
                2 = Move Warriors
                3 = Start Round!
    */

    var game = {
        isMove: false,
        warMoves:25,
        warUpgrade:1,
        maxWarriors: 2,
        maxSpawners: 1,
        maxEnemies: 20,
        warDmg: 1,
        enemyHP: 2,
        enemySP: 5,
        state: 0
    }


    //Function to create a random 1 or -1
	function plusNeg() {
    return Math.random() < 0.5 ? -1 : 1;
	}

    //Finds distance from mouse to point
    function lineDistance( mouse, point2x, point2y )
    {
        var xs = 0;
        var ys = 0;

        xs = point2x - mouse[0];
        xs = xs * xs;

        ys = point2y - mouse[1];
        ys = ys * ys;
        return Math.sqrt( xs + ys );
    }

    //Redraws the board
    function refresh() {
        ctx.clearRect(0,0,400,400);

        for(var q = 0; q < warriors.length; q++){
            warriors[q].draw();
        }
        for(var r = 0; r < spawners.length; r++){
            spawners[r].draw();
        }


        for(var j = 0; j < spawners.length; j++){
            for(var s = 0; s < enemies.length; s++){
                enemies[j][s].draw();
            }
        }
    }


    //Store the Mouse position in mousePos[x,y]
    var mousePos;
    canvas.addEventListener('mousemove', function(event) {
        mousePos = [event.pageX - 10, event.pageY - 10];
        $("#mousePos").html("x: " + mousePos[0] + ", y: " + mousePos[1]);
      }, false);


    /////////Write the game functions here////////////////
    $("#myCanvas").click(function(){


    //Spawning Warriors///////////////////
    if(game.state === 0){
        if(warriors.length < game.maxWarriors){
            warriors.push(new warrior(mousePos[0],mousePos[1],game.warDmg))
            refresh();
            if(warriors.length === game.maxWarriors){
                $("#gameState").html("Upgrade Warriors");
                game.state++;
                $("#inst").html("Click " + game.warUpgrade+ " warrior(s) to increase their damage");
            }
        }
    }

    //Upgrade Warriors//////////////////
    else if(game.state === 1){
        for(var z = 0; z < warriors.length; z++){
            var temp = lineDistance(mousePos, warriors[z].xPos, warriors[z].yPos);
            if(temp < 8){
                warriors[z].dmg++;
                game.warUpgrade = game.warUpgrade - 1;
                $("#gameState").html("Upgrade Warriors (" + game.warUpgrade + ")");
                if(game.warUpgrade <= 0){
                    game.state++;
                    $("#gameState").html("Move Warriors: "+ game.warMoves);
                    $("#inst").html("Click a warrior to move.")
                }
            }
        }
    }


    //Move Warriors//////////////////////////
    else if(game.state === 2){
        if(game.isMove === false){
            for(w = 0; w < warriors.length; w++){
                var temp2 = lineDistance(mousePos, warriors[w].xPos, warriors[w].yPos);
                if(temp2 <= 8){
                    $("#inst").html("Pick New Spot for Warrior");
                    game.isMove = true;
                    temp3 = w;
                }
            }
        }
        else{
            if(lineDistance(mousePos, warriors[temp3].xPos, warriors[temp3].yPos) <= game.warMoves){
            warriors[temp3].xPos = mousePos[0];
            warriors[temp3].yPos = mousePos[1];
            refresh();
            game.state = 3;
            $("#inst").html("Click on Start Round to begin");
            }
        }
    }
    });

    //Start spawning enemies//////////////////////
    $("#startRound").click(function(){
        if(game.state === 3){
            spawners.push(new spawner(200, 20));
            for(var p = 0; p < spawners.length; p++){
                enemies.push([]);
                for(var k = 0; k < game.maxEnemies; k++){
                    enemies[p].push(new enemy(game.enemyHP, game.enemySP, spawners[p].xPos, spawners[p].yPos));
                }
            }
            refresh();

            window.requestAnimationFrame(fighto);
        }
    });


    //Animate the Action


    function fighto() {

      ///Action stuff goes here
    for(var j = 0; j < spawners.length; j++){
      for(var s = 0; s < enemies.length; s++){
        enemies[j][s].move();
    }
}
      refresh();
      window.requestAnimationFrame(fighto);

    }


    //Spawner Object///////////////
	function spawner(xPos, yPos) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.spawn = function(hp, speed){
            enemy.create(hp, speed, this.xPos, this,yPos);
		}
		this.draw = function(){
            ctx.beginPath();
            ctx.arc(this.xPos,this.yPos,5,0,2*Math.PI);
            ctx.fillStyle = "yellow";
            ctx.fill();
            ctx.stroke();
		}

	}


    //Enemy Object//////////
	function enemy(hp, speed, xPos, yPos) {
		this.hp = hp;
		this.speed = speed;
		this.xPos = xPos;
		this.yPos = yPos;
		this.draw = function(){
            ctx.beginPath();
            ctx.arc(this.xPos,this.yPos,5,0,2*Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.stroke();
		}
	    this.takeDmg = function(dmg){
            this.hp = this.hp - dmg;
		}
		this.move = function(){
            var xRan = Math.floor(Math.random()*3 + 1)*plusNeg();
            var yRan = Math.floor(Math.random()*3 + 1);
            this.xPos += xRan;
            this.yPos += yRan;
		}

	}

	//Warrior Object//////////////
	function warrior(xPos, yPos, dmg)	{
		this.xPos = xPos;
		this.yPos = yPos;
		this.dmg = dmg;
		this.shoot = function(){
            enemy.takeDmg(this.dmg);
		}
		this.upgrade = function(){
            this.dmg++;
		}
		this.draw = function(){
            ctx.beginPath();
            ctx.arc(this.xPos,this.yPos,5,0,2*Math.PI);
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.stroke();
		}
	}


/* Turning off because not neccisary for learning at the moment.

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
// Should just make requestAnimation work fine on any browswer
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
*/


});
