import * as Phaser from "phaser-ce";
//import { game } from "./app.component";
import { Enemy } from "./Enemy";

export class SpinEnemy extends Enemy{

    sprite: Phaser.Sprite;
    health: number;
    dir: number;
    speed: number;
    
    Update(){
        super.Update();
        this.sprite.body.velocity.x = this.speed * this.dir;
        this.sprite.body.velocity.y = this.speed;
        
        this.sprite.angle += 5;

        if (this.sprite.body.x <= 0){
            this.dir = 1;
        }
        else if(this.sprite.body.x >= 335){
            this.dir = -1;
        }        
    }
}