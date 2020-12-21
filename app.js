// $('document').ready(()=>{
//    $('#gameCanvas').on('click',()=>{
//        cat.GroundPound=true;
//        cat.resize()
//     })

// })

//global variables
let canvas_width=3*1920;
let canvas_height=2*1080;
let ctx;
let ctx2;
let fps=100;
let moving_boxes=[];
let static_boxes=[];
let allboxes=[]
let cats=[];
let ground;
let ground_height;

let cat_base_height=60;
let cat_base_width=50;

let tomatoes=[];
let tomato_x;
let tomato_y;
let tomato_w;
let tomato_h;

//keyboard setup
//CHANGE HERE TO DEFINE ANY NEW KEYS
//ALSO CHAMGE THE KEY HANDLER AT THE END PART OF THE SCRIPT
const SPACEBAR=32;
const KEYCODE_LEFT=37;
const KEYCODE_RIGHT=39;
const KEYCODE_UP=38;
const W=87;
const S=83;
const A=65;
const D=68;



 function startGame() {
    gameArea.start();
    ctx=gameArea.context;
    //get the canvas element using the DOM
                                //CHANGE THE GROUND COLOR OR HEIGHT
    ground=new imageBuilder(0,canvas_height-100,canvas_width,30,'ground','green')
    ground_height=canvas_height-ground.y;
                                    //CHANGE TO REPOSTION THE MOVING BOXES OR ADD SOME NEW
    box = new imageBuilder(canvas_width/2,ground.y,200,20,'box','red')//moving up
    box2 = new imageBuilder(canvas_width*0.3,200,100,20,'box','blue')//moving down
    box3 = new imageBuilder(0,ground.y*0.3,200,20,'box','purple')//moving right
    box4 = new imageBuilder(canvas_width,ground.y*0.6,80,20,'box','navy')//moving left
    box5 = new imageBuilder(canvas_width*0.7,ground.y,80,20,'box','green')//moving up

    moving_boxes=[box,box2,box3,box4,box5];

    for(let i=0;i<9;i++){
        for(let j=0;j<5;j++){//CHANGE HERE TO REPOSTION THE STATIC BOXES APPEARING IN A RANDOM X,Y CO-ORDINATE
            static_boxes.push(new imageBuilder(400+getRndInteger(450,650)*i,getRndInteger(400,500)*j,140,20,'box','brown'))
        } 
    }
   
     allboxes=[...moving_boxes,...static_boxes]

    for(let i=0;i<7;i++){
        for(let j=0;j<7;j++){
            tomatoes.push(new imageBuilder(200+getRndInteger(200,300)*i,getRndInteger(200,300)*j,20,20,'tomato','./fiver_work/tomato.svg'))
        } 
    }

    cat = new imageBuilder(canvas_width/2,ground.y-cat_base_height,cat_base_width,cat_base_height,'cat','fiver_work/Cat_right.svg');
    cat2 = new imageBuilder(canvas_width/2-100,ground.y-cat_base_height,cat_base_width,cat_base_height,'cat','fiver_work/Cat_right.svg');

    cats=[cat,cat2];

    window.onkeydown=keyDownHandler;//keyboard setup
    window.onkeyup=keyUpHandler;
 }
 


var gameArea = {
    canvas:document.getElementById('gameCanvas'),
	can:document.getElementById('gameCanvasV'),
            
    start:function(){
            this.canvas.width = canvas_width;
            this.canvas.height = canvas_height;
            this.canvas.style.border="2px solid"
            this.context=this.canvas.getContext('2d');
			this.can.width = 1000;   //THE SIZE OF THE VIEWPORT OR THE CAMERA
            this.can.height = 500;
            this.can.style.border="2px solid"
            this.ctx=this.can.getContext('2d');
            this.frameNo=0;
            this.interval=setInterval(function(){
                  moveThings();
                 drawSomething();
				 
				var ctx = gameArea.ctx;
				ctx.font = "30px Arial";
				ctx.fillStyle = "green";
				ctx.fillText("Score : "+(cat.score),20,30);
				ctx.fillText("Score : "+(cat2.score),800,30);
				 //alert(cat.x);
				 var w = -cat.x+500-cat.width/2;//camera fix
				 var h = -cat.y+350-cat.height*.7;
				 
                 if(w > 0)w = 0;
                 if(h > 0)h = 0;
				 if(w < -gameArea.canvas.width+1000)w = -gameArea.canvas.width+1000;
				 gameArea.ctx.drawImage(gameArea.canvas,w,h);
				 
				 
              },1000/fps);
                
            },
          
    clear:function(){
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.clearRect(0, 0, this.can.width, this.can.height);
            },
        
    stop:function(){ 
                clearInterval(this.interval);
            }
}



function drawSomething(){
  
    gameArea.clear() 
  
            gameArea.frameNo+=1;
    //Drawing all the boxes
        
           allboxes.forEach(box=>{
                box.draw()
            })

            ground.draw()

            //CAT SIZE CONTROL WHEN EATS TOMATOES AND ALSO FACE DIRECTION CHANGE ON MOVEMENT
            cats.forEach(cat=>{
                cat.getsTomato(tomatoes)
                cat.facedirection()
            })
         
         
       
               //PUSHING TOMATOES EVERY FPS// CHANGE THE VALUE IN THE EVERYINTERVAL FUNCTION TO INCREASE OR DECREASE THE FREQUENCY OF TOMATOES ARRIVAL ON THE SCREEN
            if(gameArea.frameNo==1||everyinterval(170)){
                tomato_w=getRndInteger(20,40);
                tomato_h=tomato_w;
                tomato_x=getRndInteger(0,canvas_width);
                tomato_y=getRndInteger(0,ground.y-tomato_h);
                
                tomatoes.push(new imageBuilder(tomato_x,tomato_y,tomato_w,tomato_h,'tomato',"fiver_work/tomato.svg"))
            }
            tomatoes.forEach((tomato)=>{
             tomato.draw()
            })
  
        }
function moveThings(){
           //BOX MOVEMENTS
            box3.x+=2;
            box.y-=1;
            box2.y+=1.5;
            box4.x-=2;
            box5.y-=2;
            // CHECKING BOX COLLISION WITH BORDERS!
            if(box4.x+box4.width<=0){
                box4.x=canvas_width
            }
            if(box3.x+box3.width>=canvas_width){
                box3.x=0
            }
            if(box2.y>=ground.y){
                box2.y=0
            }
            if(box.y<=0){
                box.y=ground.y
            }
            if(box5.y<=0){
                box5.y=ground.y
            }

           
            //cat collision checks !! landing , hit border, movements, jump on boxes
            cats.forEach((cat,i)=>{
                cat.newpos();
                cat.hitBorder()
                cat.landOn(ground)
                allboxes.forEach(box=>{
                    cat.landOn(box)
                })
            }) 
          
            cat2.landOn(cat)
            cat.landOn(cat2)        
        }
        //constructor functions
        class imageBuilder{
            constructor(x,y,width,height,type,color){
                this.x=x;
                this.y=y;
                this.type=type;
                this.score=0;
                this.GroundPound=false;
                this.keyboardMoveLeft=false;
                this.keyboardMoveRight=false;
                this.previouslyFacingLeft=false;
                this.SPLAT=false;
                this.tomatoFall=0;
               
                this.width=width;
                this.height=height;
                this.angle=0;
                
                if(this.type=='cat'||this.type=='tomato'){
                    this.image = new Image();
                    this.image.src = color;  
                }else{
                    this.fillStyle = color;
                }
                this.speedY=0; 
                this.bounce=0.2; 
                this.gravity = .1;
                this.gravitySpeed = 0;  
            }
            draw(){
                if(this.type=='cat' ||this.type=='tomato'){
                    ctx=gameArea.context;
                    ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
                }else{
                    ctx.fillStyle = this.fillStyle;
                    ctx.fillRect(this.x,this.y,this.width,this.height);
                }    
            }
            crashWith(otherobj){
                var myleft = this.x;
                var myright = this.x + (this.width);
                var mytop = this.y;
                var mybottom = this.y + (this.height);
                var otherleft = otherobj.x;
                var otherright = otherobj.x + (otherobj.width);
                var othertop = otherobj.y;
                var otherbottom = otherobj.y + (otherobj.height);
                var crash = true;
                if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
                    crash = false;
                }
                return crash;
             }
            facedirection(){
                if(this.GroundPound){
                    this.groundPound();  
                }else if(this.keyboardMoveLeft){
                    this.moveleft()
                    this.previouslyFacingLeft=true;
                }
                else if(this.keyboardMoveRight){
                    this.moveright()
                    this.previouslyFacingLeft=false;
                }
                else if(this.SPLAT){
                    this.splat()      
                }
                else{
                    if(this.previouslyFacingLeft){
                          this.faceleft()
                    }else if(!this.previouslyFacingLeft){
                          this.faceright()
                    }
                    else{
                        this.facedefault()
                    }    
                }
             }
            catCrashWithOtherCat(other){
                if(this.crashWith(other)){
                  

                if(!this.keyboardMoveUp){ 
                    for(let i=0;i<getRndInteger(2,8);i++){
                        tomatoes.push(new imageBuilder(this.x+getRndInteger(-200,200),this.y+getRndInteger(-100,100),tomato_w,tomato_h,'tomato','./fiver_work/tomato.svg'))
                         } 
                    
                        this.y=other.y-this.height-20;
                        this.gravitySpeed = - 5.5;
                    
                  
                  
                  //keyboardMoveUp=true;
                  if(this.height>other.height){//WHEN THE CAT JUMPIN IS BIGGER IN SIZE
                    let score_diff=Math.ceil(Math.abs((this.score-other.score))*.2) //CHANGE THE FRACTION TO DETERMINE SCORE GAIN OR LOSS PER JUMP ON A CAT
                    let mass_diff=Math.ceil(Math.abs((this.height-other.height))*.1)//CHANGE THE FRACTION TO DETERMINE SIZE GAIN OR LOSS PER JUMP ON A CAT

                      if(this.GroundPound){//TO DEAL DOUBLE DAMAGE ON GROUNPOUND!!
                        mass_diff*=2;
                        score_diff*=2;
                        console.log('gp'+mass_diff)
                      }
                      console.log(mass_diff)
                      other.score-=score_diff*1.5;//CHANGE THE FRACTION TO DETERMINE SCORE GAIN OR LOSS PER JUMP ON A CAT

                      other.width-=mass_diff*1.1;//CHANGE THE FRACTION TO DETERMINE SIZE GAIN OR LOSS PER JUMP ON A CAT

                      other.height-=mass_diff*1.1;
                  }
                  else if(this.height<=other.height){// WHEN THE CAT JUMPING IS SMALLER OR EQUAL IN SIZE
                    let score_diff=Math.ceil((1000-Math.abs((this.score-other.score)))*.02)//SAME AS ABOVE
                    let mass_diff=Math.ceil((1000-Math.abs((this.height-other.height)))*.01)//SAME AS ABOVE

                    if(this.GroundPound){//TO DEAL DOUBLE DAMAGE ON GROUNPOUND!!
                        mass_diff*=2;
                        score_diff*=2;
                        console.log('gp'+mass_diff)
                      }
                      console.log(mass_diff)
                      other.score-=score_diff*1.5;//SAME AS ABOVE

                      other.width-=mass_diff*1.1;
                      other.height-=mass_diff*1.1;
                  }
                  if(other.height<cat_base_height){
                      other.SPLAT=true
                     } 
                  } 
             
                }
            }
            getsTomato(tomatoes){
                tomatoes.forEach((tomato,i)=>{
                    if(this.crashWith(tomato)){
                        tomatoes.splice(i,1);
                        i--;
                        this.score+=10; // CHANGE HERE TO CHANGE THE SCORE GAIN ON EACH TOMATOES EATEN
                        if(this.height<300){
                            this.resize()
                        }  
                    }
                })
            }
            newpos(){
               // console.log(this.gravitySpeed);
           ///// console.log(this.gravitySpeed);
                if(this.keyboardMoveLeft){  //INCREASE THE VALUE HERE TO INCREASE ACCLEARATION RIGHT AND LEFT!!
                    this.x-=4.5;
                }
                if(this.keyboardMoveRight){
                    this.x+=4.5;
                }
          
                this.gravitySpeed += this.gravity;
                this.y +=this.gravitySpeed; 
            }
            landOn(otherobj){
                if(otherobj.type=='box'){
                    let rockbottom=otherobj.y-this.height;     
                     if(this.x+this.width>otherobj.x&&this.x+20<otherobj.x+otherobj.width){
                        if(this.y>rockbottom&&this.y+this.height<otherobj.y+otherobj.height){
                         this.y=rockbottom;
                   
                         this.gravitySpeed = -(this.gravitySpeed * this.bounce);   
                         return this.keyboardMoveUp=true;        
                       }
                    }
                   // return this.keyboardMoveUp=true;

                }else if(otherobj.type=='ground'){
                    let rockbottom=ground.y-this.height;
                    if(this.y>rockbottom){
                        this.y=rockbottom;
            
                        this.gravitySpeed = -(this.gravitySpeed * this.bounce);//bounce  
                        return this.keyboardMoveUp=true;
                      }
                    //   return this.keyboardMoveUp=true;
                }else if(otherobj.type=='cat'){
                    this.catCrashWithOtherCat(otherobj)
                }
                
             
            }
            moveup(){
                    if(this.keyboardMoveUp){
                        this.gravitySpeed=-6.5;//CHANGE HERE TO INCREASE OR DECREASAE THE JUMP SPEED!!
                        this.gravity=+.10;     //PROVIDES GRAVITY TO BRING THE CAT BACKON GROUND , INCREASING THIS VALUE WILL MAKE THE CAT LAND FASTER ON GROUND
                        return this.keyboardMoveUp=false;
                }  
            }
            motion(){
                console.log('motion called');
                this.gravity=+.18;  //ALSO DETERMINES HOW LONG THE CAT STAYS ON THE AIR     
            }
            moveleft(){
                this.image.src='fiver_work/Cat_left_walk1.svg';
                this.draw()             
            }
            moveright(){
                this.image.src="fiver_work/Cat_right_walk1.svg";
                this.draw()
            }
            groundPound(){
                this.image.src= 'fiver_work/Cat_groundpound.svg';
                this.rotate90()
                this.angle+=8; //CHANGE HERE TO MAKE THE CAT ROTATE FASTER OR SLOWER
                this.draw()
                this.restore();
                if(this.angle%360==0){
                    this.GroundPound=false;
                } 
            }
            faceleft(){
                this.image.src="fiver_work/Cat_left.svg"
                this.draw()
            }
            faceright(){
                this.image.src="fiver_work/Cat_right.svg"
                this.draw()
            }
            facedefault(){
                this.image.src= 'fiver_work/Cat_right.svg';
                this.draw()
            }
            splat(){
                this.image.src= 'fiver_work/Cat_splat.svg';
                this.draw()
             
            }
          
          
            hitBorder(){
                let rightborder=canvas_width-this.width;
                
                if(this.y<0){
                    this.y=0;
                }
            
                if(this.x>rightborder){
                    this.x=rightborder;
                    console.log('hit right')
                }
                if(this.x<0){
                    this.x=0;
                }
            }
          
            scoredraw(x){///score draw at x position
                ctx = gameArea.context;
                ctx.font = "30px Arial";
                ctx.fillText("Score : "+(this.score),cat.x,cat.y-300);
				//ctx.fillText("Score : "+(this.score),x,50);
            } 
            resize(){
                console.log("tomato acquired!")
                this.width+=this.score*0.05; //CHANGE HERE TO MANIPULATE THE SIZE GAIN PER TOMATOES EATEN
                this.height+=this.score*0.05;
            }
            rotate90(){ 
                ctx.translate(this.x+(this.width/2),this.y+(this.height/2));
                ctx.rotate(this.angle*Math.PI/180)
                ctx.translate(-(this.x+this.width/2),-(this.y+this.height/2)); 
             }
             restore(){
                 ctx.setTransform(1, 0, 0, 1, 0, 0);
             }
            
      
            
            
            }
            function keyDownHandler(e){
                switch (e.keyCode){
                    case KEYCODE_UP:cat.moveup();break;
                    case KEYCODE_LEFT: cat.keyboardMoveLeft=true;break;
                    case KEYCODE_RIGHT: cat.keyboardMoveRight=true;break;
                    case SPACEBAR:cat.GroundPound=true;break;

                    case W:cat2.moveup();break;
                    case A:cat2.keyboardMoveLeft=true;break;
                    case D:cat2.keyboardMoveRight=true;break;
                    case S:cat2.GroundPound=true;break;

                }
            }
            
            function keyUpHandler(e){
               switch(e.keyCode){//capital c is must camel case
                    case KEYCODE_UP:cat.motion();break;
                    case KEYCODE_LEFT: cat.keyboardMoveLeft=false;break;
                    case KEYCODE_RIGHT: cat.keyboardMoveRight=false;break;
                    // case SPACEBAR:animate();break;
                    case W:cat2.motion();break;
                    case A:cat2.keyboardMoveLeft=false;break;
                    case D:cat2.keyboardMoveRight=false;break;
               }
            }
            function everyinterval(n) {
                return ((gameArea.frameNo / n) % 1 == 0) ?  true : false;
            }
            
            function getRndInteger(min, max) {
                return Math.floor(Math.random() * (max - min) ) + min;
              }