import * as Phaser from "phaser-ce";
import { game } from "../pages/home/home";

export class Bomb{

    sprite: Phaser.Sprite;
    speed: number;
    hasBomb: boolean

    constructor(x,y,s){
        //Create sprite
        this.sprite = game.add.sprite(x,y,s);        
        this.sprite.animations.add('walk');
        this.sprite.animations.play('walk', 30, true);
        this.sprite.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.angle = 270;

        this.speed = 100;
        this.hasBomb = true;
    }

    Update(){
        this.sprite.body.velocity.y = this.speed * 2;
        if (this.sprite.body.y >= 640){
            this.sprite.kill();
            this.hasBomb = false;
        }
    }
}