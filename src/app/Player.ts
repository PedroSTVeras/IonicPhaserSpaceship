import * as Phaser from "phaser-ce";
import { game, player } from "../pages/home/home";

export class Player{

    sprite: Phaser.Sprite;
    health: number;
    bulletTime: number;
    bullet: Phaser.Sprite;
    bullets: any;

    //Buttons
    cursors: any;
    fireButton: any;
    w: any;
    a: any;
    s: any;
    d: any;
    
    mobile: boolean;

    constructor(){
        //Create sprite
        this.sprite = game.add.sprite(180, 600, 'Player');
        this.sprite.angle = 180;
        this.sprite.animations.add('walk');
        this.sprite.animations.play('walk', 30, true);
        this.sprite.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        //Set health
        this.health = 3;

        //Bullets
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet');
        this.bullets.setAll('anchor.x', 1);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bulletTime = 0;

        this.mobile = true;        

        if (!this.mobile){
            //Buttons
            this.cursors = game.input.keyboard.createCursorKeys();
            this.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
            this.s = game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.d = game.input.keyboard.addKey(Phaser.Keyboard.D);
            this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        }

    }

    Update(){
        this.sprite.body.velocity.setTo(0, 0);
        if (player.health >0){   
            if (this.mobile){
                //Mobile controls
                if (game.input.pointer1.isDown){
                    game.physics.arcade.moveToObject(this.sprite, game.input.pointer1, 175);
                    this.fireBullet(this.sprite.x, this.sprite.y, 2);
                }
            }
            else{
                //Move
                if (this.cursors.left.isDown || this.a.isDown) {
                    this.sprite.body.velocity.x = -200;
                }
                else if (this.cursors.right.isDown || this.d.isDown) {
                    this.sprite.body.velocity.x = 200;
                }
                if (this.cursors.up.isDown || this.w.isDown) {
                    this.sprite.body.velocity.y = -200;
                }
                else if (this.cursors.down.isDown || this.s.isDown) {
                    this.sprite.body.velocity.y = 200;
                }
                //Firing
                if (this.fireButton.isDown) {
                    this.fireBullet(this.sprite.x, this.sprite.y, 2);
                } 
            }       
        }
    }

    fireBullet(x, y, n) {
        if (game.time.now > this.bulletTime) {
            for (let index = 0; index < n; index++) {
                this.bullet = this.bullets.getFirstExists(false);            
                if (this.bullet) {
                    //this.bullet.angle = -270;
                    this.bullet.reset(x + -6 + 18*index,y-16);
                    this.bullet.body.velocity.y = -400;
                    this.bulletTime = game.time.now + 200;
                }
            }
        }
    }

    resetBullet(bullet) {
        bullet.kill();      
    }
}