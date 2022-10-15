/**@type {HTMLCanvasElement} */
import {Player} from "./player.js";
import {InputHandler} from "./input.js";
import {Background} from "./background.js";
import {FlyingEnermy,climbingEnermy,GroundEnermy} from "./enemies.js";
import {UI} from "./Ui.js";
window.addEventListener("load",function(e){
    const canvas=document.getElementById("canvas1");
    const ctx=canvas.getContext("2d");
    canvas.width=500;
    canvas.height=500;

    //implimenting the game class to put all our game logic
    class Game{
        constructor(width,height){
            this.width=width;
            this.height=height;
            this.groundMargin=50;
            this.player=new Player(this);
            this.input=new InputHandler(this);
            this.speed=0;
            this.maxSpeed=4;
            this.collission=[];
            this.background=new Background(this);
            this.enemies=[];
            this.enermyTimer=0;
            this.enermyInterval=1000;
            this.debug=false;
            this.score=0;
            this.fontColor='red';
            this.UI=new UI(this);
            this.player.currentState=this.player.states[0];
            this.player.currentState.enter();
            this.particles=[];
            this.MaxParticles=50;
            this.time=0;
            this.maxTime=50000;
            this.gameOver= false;
            this.fontSize=25;
            this.fontFamily='Helvetica';
            this.lives=5;
           
            
           

        }
        update(deltaTime){
            //console.log(deltaTime);
            this.time+=deltaTime;
            if(this.time>this.maxTime) this.gameOver= true;
            this.background.update();
            this.player.update(this.input.keys,deltaTime);
            //handling the enemies
            if(this.enermyTimer>this.enermyInterval){
                this.addEnermy();
                this.enermyTimer=0;
            }else{
                this.enermyTimer+=deltaTime;
                
            }
            this.enemies.forEach(enemy=>{
                enemy.update(deltaTime);
                if(enemy.makedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy),1);
               
               
               
            })
            //the block of code to handle the particles
            this.particles.forEach((particle,index)=>{
                particle.update();
                if(particle.makedForDeletion) this.particles.splice(index,1);
            })
            if(this.particles.length>this.MaxParticles){
                this.particles=this.particles.slice(0,this.MaxParticles);
            }
            this.collission.forEach((collide,index)=>{
                collide.update(deltaTime);
                if(collide.makedForDeletion) this.collision.splice(index,1);
                
                
            })
          
           


        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            })
            
            //drawing the particles
            this.particles.forEach((particle)=>{
                particle.draw(context);
            })
            this.collission.forEach((collide)=>{
                collide.draw(context);
            })
            this.UI.draw(context);
           
            


        }
        addEnermy(){
            if(this.speed>0 && Math.random()<0.5) this.enemies.push(new GroundEnermy(this));
            else if(this.speed>0 && Math.random()<0.5) this.enemies.push(new climbingEnermy(this))
                 this.enemies.push(new FlyingEnermy(this));
                 //console.log(deltaTime);
                
        }
        //handle collision sprites
       
    }
    let lastTime=0;
    const game=new Game(canvas.width,canvas.height);
 
   

    //animation loop to trigger the game animation
   
    function animate(timeStamp){
        const deltaTime=timeStamp-lastTime;
        //console.log(deltaTime);
        lastTime=timeStamp;
        //console.log(lastTime);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        //console.log(game.gameOver)
        if(!game.gameOver){
            //game.sound.play();
            requestAnimationFrame(animate);
        }else if(game.gameOver && game.score>20){
           //console.log(game.fontSize)
            ctx.textAlign='center';
            ctx.font=game.fontSize*2+'px '+game.fontFamily;
            ctx.fillText("you win !!! conglats ",game.width*0.5,game.height*0.5) ;
        }else{
            ctx.textAlign='center';
            ctx.font=game.fontSize*2+'px '+game.fontFamily;
            ctx.fillText("you loose !!! Time over ",game.width*0.5,game.height*0.5) ;

        }

    }
    animate(0);
    
})