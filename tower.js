$(document).ready(function() {
  //Canvas stuff
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  //Arrays to fill with the different objects
  var enemies = [[]];
  var warriors = [];
  var spawners = [];
  var temp3;
  /* game.state 0 = Spawn Warriors
								1 = Upgrade Warriors
								2 = Move Warriors
								3 = Start Round!
		*/
  var game = {
      isMove: false,
      //Higher warAtkSpd is worse
      warAtkSpd: 500,
      warAtkDis: 20,
      warMoves: 25,
      warUpgrade: 1,
      maxWarriors: 2,
      maxSpawners: 1,
      maxEnemies: 50,
      warDmg: 1,
      enemyHP: 2,
      enemySP: 5,
      state: 0,
      action: false,
      killCount: 0,
      DoA: true,
      roundNum: 1,
      playerLives: 10
    }
    //Function to create a random 1 or -1

  function plusNeg() {
      return Math.random() < 0.5 ? -1 : 1;
    }
    //Finds distance from mouse to point

  function lineDistance(mouse, point2x, point2y) {
    var xs = 0;
    var ys = 0;
    xs = point2x - mouse[0];
    xs = xs * xs;
    ys = point2y - mouse[1];
    ys = ys * ys;
    return Math.sqrt(xs + ys);
  }

  function fightDistance(wxPos, wyPos, exPos, eyPos) {
      var xs = 0;
      var ys = 0;
      xs = wxPos - exPos;
      xs = xs * xs;
      ys = wyPos - eyPos;
      ys = ys * ys;
      // console.log(Math.sqrt(xs + ys));
      return Math.sqrt(xs + ys);

    }
    //Redraws the board

  function refresh() {
      ctx.clearRect(0, 0, 400, 400);
      for (var q = 0; q < warriors.length; q++) {
        warriors[q].draw();
      }
      for (var r = 0; r < spawners.length; r++) {
        spawners[r].draw();
      }
      for (var j = 0; j < spawners.length; j++) {
        for (var s = 0; s < enemies[j].length; s++) {
          enemies[j][s].draw();
        }
      }
    }
    //Store the Mouse position in mousePos[x,y]
  var mousePos;
  canvas.addEventListener('mousemove', function(event) {
    mousePos = [event.pageX - 10, event.pageY - 10];
    // $("#mousePos").html("x: " + mousePos[0] + ", y: " + mousePos[1]);
}, false);
  /////////Write the game functions here////////////////
  $("#myCanvas").click(function() {
    //Spawning Warriors///////////////////
    if (game.state === 0) {
      if (warriors.length < game.maxWarriors) {
        warriors.push(new warrior(mousePos[0], mousePos[1], game.warDmg,
          0))
        refresh();
        if (warriors.length === game.maxWarriors) {
          $("#gameState").html("Upgrade Warriors");
          game.state++;
          $("#inst").html("Click " + game.warUpgrade +
            " warrior(s) to increase their damage");
        }
      }
    }
    //Upgrade Warriors//////////////////
    else if (game.state === 1) {
      for (var z = 0; z < warriors.length; z++) {
        var temp = lineDistance(mousePos, warriors[z].xPos, warriors[z]
          .yPos);
        if (temp < 8) {
          warriors[z].dmg++;
          game.warUpgrade = game.warUpgrade - 1;
          $("#gameState").html("Upgrade Warriors (" + game.warUpgrade +
            ")");
          if (game.warUpgrade <= 0) {
            game.state++;
            $("#gameState").html("Move Warriors: " + game.warMoves);
            $("#inst").html("Click a warrior to move.")
          }
        }
      }
    }
    //Move Warriors//////////////////////////
    else if (game.state === 2) {
      if (game.isMove === false) {
        for (w = 0; w < warriors.length; w++) {
          var temp2 = lineDistance(mousePos, warriors[w].xPos,
            warriors[w].yPos);
          if (temp2 <= 8) {
            $("#inst").html("Pick New Spot for Warrior");
            game.isMove = true;
            temp3 = w;
          }
        }
      } else {
        if (lineDistance(mousePos, warriors[temp3].xPos, warriors[temp3].yPos) <= game.warMoves) {
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
  $("#startRound").click(function() {
    if (game.state === 3 && game.action === false) {
      spawners.push(new spawner(200, 20));
      for (var p = 0; p < spawners.length; p++) {
        enemies.push([]);
        for (var k = 0; k < game.maxEnemies; k++) {
          console.log("maxEnemies " + game.maxEnemies);
          console.log("#enemies pushed " + k);
          enemies[p].push(new enemy(game.enemyHP, game.enemySP,
            spawners[p].xPos, spawners[p].yPos, true));
        }
      }
      refresh();
      game.action = true;
      window.requestAnimationFrame(fighto);
    }
  });
  //Animate the Action
  function fighto() {
      ///Action stuff goes here
      for (var j = 0; j < spawners.length; j++) {
        for (var s = 0; s < enemies[j].length; s++) {
          enemies[j][s].move();
        }
      }
      for (var j = 0; j < spawners.length; j++) {
        // console.log("j: " + j)
        for (var s = 0; s < enemies[j].length; s++) {
          // console.log("s: " + s)
          for (var q = 0; q < warriors.length; q++) {
            // console.log("q: " + q)
            if (fightDistance(warriors[q].xPos, warriors[q].yPos, enemies[j][s].xPos,
              enemies[j][s].yPos) < game.warAtkDis) {
              warriors[q].shoot(enemies[j][s]);
              console.log("pewpew" + q + " " + s);
            }
          }
        }
      }
      for (var i = 0; i < warriors.length; i++) {
        if (warriors[i].atkAv > 0) {
          warriors[i].atkAv = warriors[i].atkAv - 1;
          console.log("peek");
        }
        // console.log("poke");
      }
      for (var j = 0; j < spawners.length; j++) {
        for (var s = 0; s < enemies[j].length; s++) {
          if (enemies[j][s].hp <= 0) {
            game.killCount++;
            console.log("killcount: " + game.killCount +
            ", maxEnemies: "+ game.maxEnemies);
            enemies[j].splice(s,1);
          }
        }
      }

      for (var j = 0; j < spawners.length; j++) {
        for (var s = 0; s < enemies[j].length; s++) {
            if(enemies[j][s].yPos >= canvas.height){
              game.killCount++;
              enemies[j].splice(s,1);
              game.playerLives--;
              $("#lives").html("Live left: " + game.playerLives);
              if(game.playerLives <= 0){
              }
            }
        }
      }



      refresh();
      //this should happen if there are no enemies left
      if (game.killCount < game.maxEnemies * game.maxSpawners && game.playerLives > 0) {
        window.requestAnimationFrame(fighto);
      } else {
        if(game.playerLives > 0){
          window.cancelAnimationFrame(fighto);
          console.log("got to cancel area");
          newRound();
        }
        else{
          ctx.fillStyle = "blue";
          ctx.font = "bold 16px Arial";
          ctx.fillText("Game Over!", 100, 100);
        }

      }
    }
    //Start a new round//
    function newRound(){
      game.maxWarriors++;
      $("#gameState").html("Game State: Spawn Warriors");
      $("#inst").html("Click to Create Warriors");
      game.state = 0;
      game.warUpgrade++;
      game.isMove=false;
      game.action = false;
      game.roundNum++
      game.maxEnemies += 5;
      game.maxSpawners ++;
      game.killCount = 0;

      //moves the current spawner//

      // if(game.roundNum%2 === 0){
      //
      // }
      // else{
      //
      // }

    }

    //Spawner Object///////////////

  function spawner(xPos, yPos) {
      this.xPos = xPos;
      this.yPos = yPos;
      this.spawn = function(hp, speed) {
        enemy.create(hp, speed, this.xPos, this, yPos);
      }
      this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.stroke();
      }
    }
    //Enemy Object//////////

  function enemy(hp, speed, xPos, yPos, DoA) {
      this.DoA = DoA;
      this.hp = hp;
      this.speed = speed;
      this.xPos = xPos;
      this.yPos = yPos;
      this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
      }
      this.takeDmg = function(dmg, wxPos, wyPos) {
        ctx.beginPath();
        ctx.moveTo(this.xPos, this.yPos);
        ctx.lineTo(wxPos, wyPos)
        ctx.stroke();
        this.hp = this.hp - dmg;
        if(this.hp <= 0){
          this.DoA = false;
        }
        console.log(this.hp + ": " + DoA);
      }
      this.move = function() {
        var xRan = Math.floor(Math.random() * 3 + 1) * plusNeg();
        var yRan = Math.floor(Math.random() * 3 + 1);
        this.xPos += xRan;
        this.yPos += yRan;
        // console.log(1);
      }
    }
    //Warrior Object//////////////

  function warrior(xPos, yPos, dmg, atkAv) {
      this.xPos = xPos;
      this.yPos = yPos;
      this.dmg = dmg;
      this.atkAv = atkAv;
      this.shoot = function(enemy) {
        if (atkAv === 0) {
          enemy.takeDmg(this.dmg, this.xPos, this.yPos);
          this.atkAv = game.warAtkSpd;
        }
      }
      this.upgrade = function() {
        this.dmg++;
      }
      this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, game.warAtkDis, 0, 2 * Math.PI);
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
