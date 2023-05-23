import * as Matter from 'matter-js';

import * as PIXI from "pixi.js";
import { App } from '../system/App';


export class Hero {
    constructor() {
        this.createSprite();
        this.createBody();
        App.app.ticker.add(this.update, this);

        this.dy = App.config.hero.jumpSpeed;
        this.maxJumps = App.config.hero.maxJumps;
        this.jumpIndex = 0;
        this.score = 0;

    }

    collectDiamond(diamond) {
        let scoreIncrease = 0;
        if (diamond.sprite && diamond.sprite.texture === App.res('diamond')) {
            console.log("Hero caught a diamond!");
          // Increase score by 1 if the diamond picture is destroyed
          scoreIncrease = 2;
        } else if (diamond.sprite && diamond.sprite.texture === App.res('money')) {
            console.log("Hero caught money!");

          // Increase score by 2 if the money picture is destroyed
          scoreIncrease = 1;
        } else if (diamond.sprite && diamond.sprite.texture === App.res('money-bag')) {
            console.log("Hero caught a money bag!");

          // Increase score by 3 if the gem picture is destroyed
          scoreIncrease = 3;
        }
    
        this.score += scoreIncrease;
    
        Matter.World.remove(App.physics.world, diamond.body);
        if(diamond.sprite){
              diamond.sprite.destroy();
        diamond.sprite = null;
        }
      
        this.sprite.emit('score', this.score);
      }

    // collectDiamond(diamond) {
    //     ++this.score;
    //     Matter.World.remove(App.physics.world, diamond.body);
    //     diamond.sprite.destroy();
    //     diamond.sprite = null;
    //     this.sprite.emit("score");

    // }


    startJump() {
        if (this.platform || this.jumpIndex === 1) {
            ++this.jumpIndex;
            this.platform = null;
            Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy });
        }
     
      
    }


    stayOnPlatform(platform) {
        this.platform = platform;
        this.jumpIndex = 0;
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height / 2, this.sprite.width, this.sprite.height, {friction: 0});
        Matter.World.add(App.physics.world, this.body);
        this.body.gameHero = this;
    }


    update() {
        this.sprite.x = this.body.position.x - this.sprite.width / 2;
        this.sprite.y = this.body.position.y - this.sprite.height / 2;
        if (this.sprite.y > window.innerHeight) {
            this.sprite.emit("die");
        }
     
    }

    createSprite() {
        this.sprite = new PIXI.AnimatedSprite([
            App.res("walk1"),
            App.res("walk2")
        ]);

        this.sprite.x = App.config.hero.position.x;
        this.sprite.y = App.config.hero.position.y;
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
    }

    destroy() {
        App.app.ticker.remove(this.update, this);
        Matter.World.add(App.physics.world, this.body);
        this.sprite.destroy();
    }

}