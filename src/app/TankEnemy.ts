import * as Phaser from "phaser-ce";
import { Enemy } from "./Enemy";

export class TankEnemy extends Enemy{

    sprite: Phaser.Sprite;
    health: number;
    dir: number;
    speed: number;
    
    Update(){
        super.Update();
        this.sprite.body.velocity.y = this.speed * 2;
   
    }
}