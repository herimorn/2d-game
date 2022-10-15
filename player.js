import {Sitting,Running,Jumping,Falling,Rolling,Diving,Hit} from "./playerStates.js";
import {collisionAnimation} from "./collissionAnimation.js";
export class Player{
    constructor(game){
        this.game=game;
        this.width=100;
        this.height=91.3;
        this.x=0;
        this.vy=0;
        this.y=this.game.height-this.height-this.game.groundMargin;
        this.weight=1;
        this.image=document.getElementById("player");
        this.frameX=0;
        this.frameY=0;
        this.speed=0;
        this.maxSpeed=10;
        this.maxFrame;
       
        this.sound=new Audio();
        this.sound.src="assets/laser.wav";
        this.fps=20;
        this.frameInterval=1000/this.fps;
        this.frameTimer=10;
        this.states=[new Sitting(this.game),new Running(this.game),new Jumping(this.game),new Falling(this.game),new Rolling(this.game),new Diving(this.game),new Hit(this.game)];
       
        

    }
    update(input,deltaTime){
      this.checkCollision();
      
     
      this.currentState.handleInput(input);
      //horizontal movements
      this.x+=this.speed;
      if(input.includes('ArrowRight')) this.speed=this.maxSpeed;
      else if(input.includes('ArrowLeft')) this.speed=-this.maxSpeed;
      else this.speed=0; 
      if(this.x<0) this.x=0;
      if(this.x>this.game.width-this.width) this.x=this.game.width-this.width;
      //vertical movements
    this.y+=this.vy;
  if(!this.onGround()) this.vy+=this.weight;
      else this.vy=0;
      //handling the vertical boundary
      if(this.y>this.game.height-this.height-this.game.groundMargin)
      this.y=this.game.height-this.height-this.game.groundMargin;
      //handle the sprite animation in this area
      //debuging area
      if(this.frameTimer>this.frameInterval){
         this.frameTimer=0;
         //console.log(this.frameTimer)
        
         if(this.frameX < this.maxFrame) this.frameX++;
         else this.frameX=0;
      }else{
        this.frameTimer+=deltaTime;
        //console.log(this.frameTimer)
        
        //else block
      }
      


    }
    draw(context){
      if(this.game.debug)context.strokeRect(this.x,this.y,this.width,this.height);
      context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height);
    }
    onGround(){
      return this.y>=this.game.height-this.height-this.game.groundMargin;
    }
    setState(state,speed){
      this.currentState=this.states[state];
      this.game.speed=this.game.maxSpeed*speed;
      this.currentState.enter();
    }
    checkCollision(){
      this.game.enemies.forEach(enemy => {
        if(enemy.x<this.x+this.width &&
          enemy.x+enemy.width>this.x &&
          enemy.y<this.y+this.height&&
          enemy.y+enemy.height>this.y
          ){
           enemy.makedForDeletion=true;
           this.game.collission.push(new collisionAnimation(this.game,enemy.x+enemy.width*0.5,enemy.y+enemy.height*0.5))
           if(this.currentState===this.states[4] ||this.currentState===this.states[5]){
            this.game.score++;
           // this.sound.play();
           }else{
               this.sound.play();
               this.setState(6,0);
               this.game.lives--;
               if(this.game.lives<=0) this.game.gameOver=true;
           }
           
        }

      });
    }
}