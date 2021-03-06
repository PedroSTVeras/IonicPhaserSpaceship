import * as Phaser from "phaser-ce";
import { game } from "../pages/home/home";
import{ Enemy } from "./Enemy";
import{ SpinEnemy } from "./SpinEnemy";
import { UFOEnemy } from "./UFOEnemy";
import { TankEnemy } from "./TankEnemy";

export class Wave{

    enemies: Enemy[];
    over: boolean;

    constructor(spin,ufo,tank){
        this.over = false;

        this.enemies = [];
        
        for (let index = 0; index < spin; index++) {
            this.enemies[index] = new SpinEnemy(game.rnd.integerInRange(10,350),game.rnd.integerInRange(-20,-120), 'Spin');  
        }
        for (let index = spin; index < spin + ufo; index++) {
            this.enemies[index] = new UFOEnemy(game.rnd.integerInRange(10,350),game.rnd.integerInRange(-20,-120), 'UFO');  
        }
        for (let index = spin + ufo; index < spin + ufo + tank; index++) {
            this.enemies[index] = new TankEnemy(game.rnd.integerInRange(10,350),game.rnd.integerInRange(-20,-120), 'Tank');  
        }
        
    }

    Update(){
        this.over = true;
        for (let index = 0; index < this.enemies.length; index++) {
            this.enemies[index].Update();

            if(this.enemies[index].alive){
                this.over = false;
            }        
        }

    }

    Stop(){
        for (let index = 0; index < this.enemies.length; index++) {
            this.enemies[index].Stop();            
        }
    }

    KillAll(){
        for (let index = 0; index < this.enemies.length; index++) {
            this.enemies[index].sprite.kill();             
        }
    }
}