export class UI{
    constructor(game){
        this.game=game;
        this.fontSize=30;
        this.fontFamily='Helvetica';
         //console.log(this.game.gameOver);
        this.livesImage=document.getElementById("lives");
        
    }
    draw(context){
        context.font=this.fontSize+ 'px ' +this.fontFamily;
        context.textAlign='left';
        context.fillStyle=this.game.fontColor;
        //the specific code to draw the score 
        context.fillText("Score"+  " "+ this.game.score,50,50);
        //timer
        context.font=this.fontSize*0.8+'px '+this.fontFamily;
        context.fillText('Time'+(this.game.time*0.001).toFixed(1),20,80);
        //the lives image
        for(let i=0;i<this.game.lives;i++){
            context.drawImage(this.livesImage,25*i+20,95,25,25);

        }
      

        //game over message
             

    }
}