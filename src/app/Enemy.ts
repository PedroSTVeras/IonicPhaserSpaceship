import * as Phaser from "phaser-ce";
import { game } from "../pages/home/home";

export class Enemy{

    sprite: Phaser.Sprite;
    health: number;
    dir: number;
    speed: number;
    alive: boolean;

    constructor(x,y,s){
        //Create sprite
        this.sprite = game.add.sprite(x,y,s);        
        this.sprite.animations.add('walk');
        this.sprite.animations.play('walk', 30, true);
        this.sprite.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        //this.sprite.angle = 180;//270;

        this.alive = true;
        this.health = 3;
        this.dir = game.rnd.integerInRange(0,1);
        this.speed = 100;

        if (this.dir == 0){
            this.dir = -1;
        }
    }

    Update(){
        if (this.sprite.body.y >= 640){
            this.sprite.kill();
            this.alive = false;
        }
    }

    Stop(){
        this.sprite.body.velocity.setTo(0, 0);
    }
}