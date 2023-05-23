import * as Matter from 'matter-js';
import { App } from '../system/App';



export class Diamond {
      
    constructor(x, y) {
        this.createSprite(x, y);
        App.app.ticker.add(this.update.bind(this));

    }


    createSprite(x, y) {
        const images = ['money', 'diamond', 'money-bag']; // Array of available images
        const probabilities = [0.5, 0.4, 0.1]; // Probabilities corresponding to each image (should add up to 1)
        
        let randomImage;
        const randomValue = Math.random();
        let cumulativeProbability = 0;
        for (let i = 0; i < images.length; i++) {
          cumulativeProbability += probabilities[i];
          if (randomValue <= cumulativeProbability) {
            randomImage = images[i];
            break;
          }
        }
    
        this.sprite = App.sprite(randomImage);
        this.sprite.x = x;
        this.sprite.y = y;
      }

    update() {
        if (this.sprite) {
            Matter.Body.setPosition(this.body, {x: this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, y: this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y});
        }
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y, this.sprite.width, this.sprite.height, {friction: 0, isStatic: true, render: { fillStyle: '#060a19' }});
        this.body.gameDiamond = this;
        this.body.isSensor = true;
        Matter.World.add(App.physics.world, this.body);
    }


}