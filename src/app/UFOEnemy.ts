import * as Phaser from "phaser-ce";
import { game } from "../pages/home/home";
import { player } from "../pages/home/home";
import { Enemy } from "./Enemy";

export class UFOEnemy extends Enemy{

    sprite: Phaser.Sprite;
    health: number;
    dir: number;
    speed: number;

    Update(){
        super.Update();
        game.physics.arcade.moveToObject(this.sprite, player.sprite, this.speed);
    }
}