$(document).ready(function() {
  //Arrays to fill with the different objects
  var enemies = [
    []
  ];
  var warriors = [];
  var spawners = [];
  var temp3;
  spawners.push(new spawner(200, 20));
  //Canvas stuff & setting up the screen
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 400, 400);
  ctx.beginPath();
  ctx.rect(0, 0, 400, 150);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.beginPath();
  ctx.rect(0, 150, 400, 400);
  ctx.fillStyle = 'aqua';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(200, 20, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.stroke();
  /* game.state 0 = Spawn Warriors
								1 = Upgrade Warriors
								2 = Move Warriors
								3 = Start Round!
		*/
  var game = {
    isMove: false,
    //Higher warAtkSpd is worse
    warAtkSpd: 2,
    warAtkDis: 35,
    warMoves: 35,
    warUpgrade: 1,
    maxWarriors: 2,
    maxSpawners: 1,
    maxEnemies: 6,
    warDmg: 1,
    enemyHP: 2,
    enemySP: 5,
    state: 0,
    action: false,
    killCount: 0,
    DoA: true,
    roundNum: 1,
    playerLives: 10
  };
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
    ctx.beginPath();
    ctx.rect(0, 0, 400, 150);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, 150, 400, 400);
    ctx.fillStyle = 'aqua';
    ctx.fill();
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
    var rect = canvas.getBoundingClientRect();
    mousePos = [event.pageX - rect.left, event.pageY - rect.top];
    $("#mousePos").html("x: " + mousePos[0] + ", y: " + mousePos[1]);
  }, false);




  /////////Write the game functions here////////////////
  $("#myCanvas").click(function() {
    //Spawning Warriors///////////////////
    if (game.state === 0) {
      // for(var i; i < warriors.length; i++){
      // if(mousePos[0] === warriors[i].xPos &&
      //   mousePos[1] === warriors[i].yPos){
      //   //Choose a different spot!
      //   ctx.fillStyle = "blue";
      //   ctx.font = "bold 16px Arial";
      //   ctx.fillText("Choose a different spot", 100, 100);
      //
      // }
      //
      // else{
      if (warriors.length < game.maxWarriors && mousePos[1] > 150) {
        warriors.push(new warrior(mousePos[0], mousePos[1], game.warDmg,
          0));
        refresh();
      }
      if (warriors.length === game.maxWarriors) {
        if (game.roundNum % 2 != 0) {
          $("#gameState").html("Upgrade Warriors");
          game.state++;
          $("#inst").html("Click " + game.warUpgrade +
            " warrior to increase their damage");
        } else {
          game.state += 2;
          $("#gameState").html("Move Warriors: " + game.warMoves);
          $("#inst").html("Click a warrior to move.");
        }

      }
      // }
      // }
    }
    //Upgrade Warriors//////////////////
    else if (game.state === 1) {
      for (var z = 0; z < warriors.length; z++) {
        var temp = lineDistance(mousePos, warriors[z].xPos, warriors[z]
          .yPos);
        if (temp < 8 && warriors[z].dmg === 1) {
          warriors[z].dmg++;
          game.warUpgrade = game.warUpgrade - 1;
          $("#gameState").html("Upgrade Warriors (" + game.warUpgrade +
            ")");
          if (game.warUpgrade <= 0) {
            game.state++;
            $("#gameState").html("Move Warriors: " + game.warMoves);
            $("#inst").html("Click a warrior to move.");
          }
        }
      }
      refresh();
    }
    //Move Warriors//////////////////////////
    else if (game.state === 2) {
      if (game.isMove === false) {
        for (w = 0; w < warriors.length; w++) {
          var temp2 = lineDistance(mousePos, warriors[w].xPos, warriors[
            w].yPos);
          if (temp2 <= 5) {
            $("#inst").html("Pick New Spot for Warrior");
            game.isMove = true;
            temp3 = w;
          }
        }
      } else {
        if (lineDistance(mousePos, warriors[temp3].xPos, warriors[temp3]
            .yPos) <= game.warMoves && mousePos[1] >= 150) {
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
      for (var p = 0; p < spawners.length; p++) {
        enemies.push([]);
        for (var k = 0; k < game.maxEnemies; k++) {
          // console.log("maxEnemies " + game.maxEnemies);
          // console.log("#enemies pushed " + k);
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
          if (fightDistance(warriors[q].xPos, warriors[q].yPos, enemies[j]
              [s].xPos, enemies[j][s].yPos) < game.warAtkDis) {
            warriors[q].shoot(enemies[j][s]);
            // console.log("pewpew" + q + " " + s);
          }
        }
      }
    }
    for (var i = 0; i < warriors.length; i++) {
      if (warriors[i].atkAv > 0) {
        warriors[i].atkAv = warriors[i].atkAv - 1;
        console.log("Lower atk: " + warriors[i].atkAv);
      }
      // console.log("poke");
    }
    for (var j = 0; j < spawners.length; j++) {
      for (var s = 0; s < enemies[j].length; s++) {
        if (enemies[j][s].hp <= 0) {
          game.killCount++;
          // console.log("killcount: " + game.killCount +
          // ", maxEnemies: "+ game.maxEnemies);
          enemies[j].splice(s, 1);
        }
      }
    }
    for (var j = 0; j < spawners.length; j++) {
      for (var s = 0; s < enemies[j].length; s++) {
        if (enemies[j][s].yPos >= canvas.height) {
          game.killCount++;
          enemies[j].splice(s, 1);
          game.playerLives--;
          $("#lives").html("Live left: " + game.playerLives);
          if (game.playerLives <= 0) {}
        }
      }
    }
    refresh();
    //this should happen if there are no enemies left
    if (game.killCount < game.maxEnemies * game.maxSpawners && game.playerLives >
      0) {
      window.requestAnimationFrame(fighto);
    } else {
      if (game.playerLives > 0) {
        window.cancelAnimationFrame(fighto);
        // console.log("got to cancel area");
        newRound();
      } else {
        ctx.fillStyle = "blue";
        ctx.font = "bold 16px Arial";
        ctx.fillText("Game Lost!", 100, 100);
      }
    }
  }
  //Start a new round//

  function newRound() {
    game.maxWarriors++;
    $("#gameState").html("Game State: Spawn Warriors");
    $("#inst").html("Click to Create a Warrior");
    game.state = 0;
    if (game.roundNum % 2 === 0) {
      game.warUpgrade++;
    }
    game.isMove = false;
    game.action = false;
    game.roundNum++;
    $("#roundNum").html("Round Number: " + game.roundNum);
    game.maxEnemies += 1;
    game.maxSpawners++;
    game.killCount = 0;
    for (var i = 0; i < spawners.length; i++) {
      if (i % 2 === 0) {
        spawners[i].xPos -= 10;
      } else {
        spawners[i].xPos += 10;
      }

      //checks for victory condition//
      if (spawners[i].xPos <= 0 || spawners[i].xPos >= 400) {
        ctx.fillStyle = "blue";
        ctx.font = "bold 16px Arial";
        ctx.fillText("You Win!", 100, 100);
      }

      refresh();
    }
    spawners.push(new spawner(200, 20));
    refresh();
  }
  //Spawner Object///////////////
  function spawner(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.spawn = function(hp, speed) {
      enemy.create(hp, speed, this.xPos, this, yPos);
    };
    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.xPos, this.yPos, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.stroke();
    };
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
    };
    this.takeDmg = function(dmg, wxPos, wyPos) {
      ctx.beginPath();
      ctx.moveTo(this.xPos, this.yPos);
      ctx.lineTo(wxPos, wyPos);
      ctx.stroke();
      this.hp = this.hp - dmg;
      if (this.hp <= 0) {
        this.DoA = false;
      }
      console.log(this.hp + ": " + DoA);
    };
    this.move = function() {
      var xRan = Math.floor(Math.random() * 3 + 1) * plusNeg();
      var yRan = Math.floor(Math.random() * 3 + 1);
      this.xPos += xRan;
      this.yPos += yRan;
      // console.log(1);
    };
  }
  //Warrior Object//////////////

  function warrior(xPos, yPos, dmg, atkAv) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.dmg = dmg;
    this.atkAv = atkAv;
    this.shoot = function(enemy) {
      if (this.atkAv === 0) {
        console.log("Shoot: " + this.atkAv);
        this.atkAv = game.warAtkSpd;
        enemy.takeDmg(this.dmg, this.xPos, this.yPos);
      }
    };
    this.upgrade = function() {
      this.dmg++;
    };
    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.xPos, this.yPos, 5, 0, 2 * Math.PI);

      if (this.dmg === 1) {
        ctx.fillStyle = "green";
      } else ctx.fillStyle = "darkblue";
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.xPos, this.yPos, game.warAtkDis, 0, 2 * Math.PI);
      ctx.stroke();
    };
  }

});
