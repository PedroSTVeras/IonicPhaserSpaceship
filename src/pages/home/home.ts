import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//import "pixi";
//import "p2";
import * as Phaser from "phaser-ce";

import{ Player } from "../../app/Player";
import { Wave } from "../../app/Wave";
import { Bomb } from '../../app/Bomb';

export let game: Phaser.Game;
export let player: Player;

let bomb: Bomb;

var score = 0;
var scoreString = '';
var scoreText;
var lives;
var live;
var gameOverText;
var r;
var explosions;
var button;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  title = 'vs';

  starfield: Phaser.TileSprite;
  wave: Wave;

  width: number;
  height: number;

  //Create Game
  constructor(){
    this.width = 360;//1920 * 0.7;
    this.height = 640;//1080 * 0.6;
    game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, 'phaser-example', 
    { preload: this.preload, create: this.create, update: this.update, render: this.render });
  }

  preload() {
    game.load.image('bullet', 'assets/sprites/bullet.png');
    game.load.spritesheet('explode', 'assets/ships2/explosion.png', 60, 60,10);
    game.load.image('Starfield', 'assets/sprites/starfield.png');
    game.load.spritesheet('Player', 'assets/ships2/ship2.png',41,41,6);
    game.load.spritesheet('Spin', 'assets/ships2/ship3.png',41,41,6);
    game.load.spritesheet('UFO', 'assets/ships2/ship1.png',41,41,6);//32,32,4);
    game.load.spritesheet('Tank', 'assets/ships2/ship4.png',41,41,6);
    game.load.spritesheet('button', 'assets/sprites/btn.png', 256, 80);
    game.load.spritesheet('bomb', 'assets/sprites/bomb.png',41,41,6);
  }

  create() {
    //this.socket = io();
    r = game.input.keyboard.addKey(Phaser.Keyboard.R);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Background
    this.starfield = game.add.tileSprite(0, 0, 600,900, 'Starfield');

    //New playe/wave
    player = new Player();
    this.wave = new Wave(game.rnd.integerInRange(2,4),game.rnd.integerInRange(2,4),game.rnd.integerInRange(2,4));
  
    //GameOver
    button = game.add.button(game.world.centerX - 130, game.world.centerY, 'button', actionOnClick, this, 2, 1, 0);
    button.visible = false;
    gameOverText = game.add.text(game.world.centerX, game.world.centerY + 42.5, "Restart");
    gameOverText.anchor.setTo(0.5, 0.5);
    gameOverText.visible = false;

    // Score
    scoreString = '';//'Score: ';
    scoreText = game.add.text(10, 5, scoreString + score, { font: '34px Arial', fill: '#ff1f' });
    
    // Lives
    lives = game.add.group();
    //game.add.text(10, 10, 'Lives: ', { font: '34px Arial', fill: '#ff1f' });
    for (var i = 0; i < 3; i++) {
      var ship = lives.create(280 + (30 * i), 25, 'Player');
      ship.anchor.setTo(0.5, 0.5);
      //ship.angle = 90;
      ship.alpha = 0.7;
    }

    //Explosion
    explosions = game.add.group();
    explosions.createMultiple(30, 'explode');
    explosions.forEach(setupExplosion, this);
    
    bomb = new Bomb(0, 700, "bomb");

  }

  update() {
  
    //Player update
    player.Update();

    //Create New Wave
    if (this.wave.over){
      var balance = score/1250;
      if (balance < 1) balance = 1;
      this.wave = new Wave (game.rnd.integerInRange(2 * balance, 4 * balance), game.rnd.integerInRange(2 * balance, 4 * balance),game.rnd.integerInRange(2 * balance, 4 * balance));
    }

    //Update Wave
    if (player.health > 0){
      this.wave.Update();
      this.starfield.tilePosition.y += 2;
    }
    //Game Over
    else{
      button.visible = true;
      gameOverText.visible = true;
      this.wave.Stop();
    }

    //Collision
    for (let index = 0; index < this.wave.enemies.length; index++) {

      if (game.physics.arcade.overlap(player.bullets, this.wave.enemies[index].sprite, bulletHitsEnemy, null, this)){
        this.wave.enemies[index].alive = false;
      }
      if(game.physics.arcade.overlap(player.sprite, this.wave.enemies[index].sprite, enemyHitsPlayer, null, this)){
        this.wave.enemies[index].alive = false;
      }

    }

    if (bomb != null){
      game.physics.arcade.overlap(player.sprite, bomb.sprite, touchBomb, null, this)
      bomb.Update();
    }

  }

  render() {   
    //game.debug.pointer(game.input.mousePointer);
    //game.debug.pointer(game.input.pointer1);
    game.scale.pageAlignHorizontally = true;
  } 
  
}

function actionOnClick () {
  //Player
  player.health = 3;
  player.sprite.position.x = 180;
  player.sprite.position.y = 600;
  //Wave
  this.wave.KillAll();
  this.wave = new Wave(game.rnd.integerInRange(2,4),game.rnd.integerInRange(2,4),game.rnd.integerInRange(2,4));
  //Score
  score = 0;
  scoreText.text = scoreString + score;
  //Text
  gameOverText.visible = false;
  button.visible = false;
  //Lives
  lives = game.add.group(); 
  for (var i = 0; i < 3; i++) {
    var ship = lives.create(280 + (30 * i), 25, 'Player');
    ship.anchor.setTo(0.5, 0.5);
    //ship.angle = 90;
    ship.alpha = 0.7;
  }
}

function setupExplosion (exp) {
  exp.anchor.x = 0.5;
  exp.anchor.y = 0.5;
  exp.animations.add('explode');
  
}

function bulletHitsEnemy(bullet, enemy) {
  
  console.log(bomb.hasBomb);
  if (game.rnd.integerInRange(1,10) == 1 && bomb.hasBomb == false){    
    console.log("Bomb spawned");
    bomb = new Bomb(enemy.body.x, enemy.body.y, "bomb");
    bomb.hasBomb = true;
  }

  bullet.kill();
  enemy.kill();

  score += 20;
  scoreText.text = scoreString + score;

  var explosion = explosions.getFirstExists(false);
  explosion.reset(enemy.body.x, enemy.body.y);
  explosion.play('explode', 30, false, true);

}

function enemyHitsPlayer(p_player,enemy) {
  enemy.kill();
  player.health -= 1;

  live = lives.getFirstAlive();

  if (live) {
    live.kill();
  }

  var explosion = explosions.getFirstExists(false);
  explosion.reset(p_player.body.x, p_player.body.y);
  explosion.play('explode', 30, false, true);
  
}

function touchBomb(p_player,b_bomb) {
  
  bomb.sprite.kill();
  bomb.hasBomb = false;
  
  for (let index = 0; index < this.wave.enemies.length; index++) {
    score += 20;
    scoreText.text = scoreString + score;
  
    var explosion = explosions.getFirstExists(false);
    //explosion.reset(this.wave.enemies[index].sprite.body.x, this.wave.enemies[index].sprite.body.y);
    explosion.play('explode', 30, false, true);         
    
    this.wave.enemies[index].sprite.kill(); 
   
  }
  var balance = score/1250;
  if (balance < 1) balance = 1;
  this.wave = new Wave (game.rnd.integerInRange(2 * balance, 4 * balance), game.rnd.integerInRange(2 * balance, 4 * balance),game.rnd.integerInRange(2 * balance, 4 * balance));
  
}
