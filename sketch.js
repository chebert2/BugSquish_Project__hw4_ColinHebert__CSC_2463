let startTime = 0;
let gameState = 'wait';

let int_bugs_killed_in_game = 0;

let old_x = 0;
let old_y = 0;

let sx;
let spriteSheet_01;
let character = [];

let count = 47;

function preload(){

    spriteSheet_01 = loadImage("spriteSheet_width_384__height_83.png");


}

function setup() {

  createCanvas(1300, 900);
  imageMode(CENTER);

  for(i = 0; i < count; i++){

      character[i] = new Character(spriteSheet_01, random(42, 1150), random(42, 867), random(2.3, 10));

   }
  
}

function timer(){
    return int(millis() - startTime) / 1000;
}


function mousePressed() {

  let dmin = -1;
  let character_id = -1;

  for(i = 0; i < count; i++){
    let d = character[i].grabCheck();
    if(d != -1){
        if(dmin == -1 || d < dmin){
          dmin = d;
          character_id = i;
           
        }
    }
  }
  if (character_id != 1){
    character[character_id].grab();
  }

}

function mouseDragged() {
    //for(i = 0; i < count; i++){
    //  character[i].drag();
   // }
}

function mouseReleased() {
     //for(i = 0; i < count; i++){
     //  character[i].drop();
     //}
}

function draw() {
  background(255, 255, 255);
  
    if(gameState == 'wait'){

     textSize(30);
     text("Press any key to start.", 150, 300);
     if(mouseIsPressed) {
       startTime = millis();
       gameState = 'playing';
       for(i = 0; i < count; i++){

          // 0 means up and down  and other than that means left or right.
         let one_or_zero = int(random(1,4));
  
         character[i].move = 1;
  
         if(one_or_zero == 1){
           character[i].go(1);
         } else if(one_or_zero == 2) {
           character[i].go(-1);
         } else if(one_or_zero == 3) {
           character[i].go(2);
         } else if(one_or_zero == 4){
           character[i].go(-2);
         }
     }
  }
}
  else if(gameState == 'playing'){

     let time = timer();

     textSize(18);
     text("time: " + (30 - time), 10, 30);
     
     textSize(17);
     text("Number Bugs Killed : " + int_bugs_killed_in_game, 945, 29);

     
     if(time >= 30){
       gameState = 'end';
     }
  } else if(gameState == 'end'){

    let time = timer();

    textSize(18);
    text("time: " + (30 - time), 10, 30);
    
    textSize(17);
    text("Number Bugs Killed : " + int_bugs_killed_in_game, 945, 29);

    textSize(38);
    text("Game is OVER.", 150, 300);
    textSize(34);
    text("Press ANY KEY to RESTART.", 150, 400);
    if(mouseIsPressed){
      startTime = millis();
      
      gameState = 'playing';
        
      int_bugs_killed_in_game = 0;

      character = [];

      for(i = 0; i < count; i++){

        character[i] = new Character(spriteSheet_01, random(42, 1150), random(42, 867), random(2.3, 10));


       // 0 means up and down  and other than that means left or right.
        let one_or_zero = int(random(1,4));
  
        character[i].move = 1;
  
        if(one_or_zero == 1){
          character[i].go(1);
        } else if(one_or_zero == 2) {
          character[i].go(-1);
        } else if(one_or_zero == 3) {
          character[i].go(2);
        } else if(one_or_zero == 4){
          character[i].go(-2);
        }
     

      }
    }

  } 
   
  for(i = 0; i < count; i++){
     character[i].draw();
  }


}

class Character {
  constructor(spriteSheet, x, y, speed){
    this.spriteSheet = spriteSheet;
    this.sx = 0;
    this.boolRotated = false;
    this.x = x;
    this.y = y;
    this.facing = 1;
    this.move = 0;
    
    this.rotateParamFLAG = 0;
    this.speed = speed;
    
    this.offsetX = 0;
    this.offsetY = 0;

    this.grabbed = false;

    this.spriteFrame = 0;

    this.next_x_special = 0;
    this.next_y_special = 0;

  }

  animate(){
    let sx, sy;
    if(this.move == 0){
      
      if(this.grabbed){
         // animation for grabbing
         this.sx = 5;
         sy = 0;
      } else {
        // animation for standing still
        sx = 0;
        sy = 0;
      }

    } else {
      // animation for walking.
      sx = this.spriteFrame % 5;
      sy = 0;

    }

    return [sx, sy];

  }


  draw() {


    old_x = this.x;
    old_y = this.y;
    //this.next_x_special = 0;
    //this.next_y_special = 0;

    push();
    translate(this.x, this.y);

    // this is for rotating the bugs to facing leftward or rightward

    // 2 == left to right, -2 == right to left
    if(this.facing == 2 || this.facing == -2){
      // rightward
      if(this.facing == 2){
        this.rotateParamFLAG = this.facing - 1
      }
      //leftward 
       else {
        this.rotateParamFLAG = this.facing + 1
      }
      //  scaling parameter to reflect the bug's head orientation
      scale(this.rotateParamFLAG, 1);
      // omit maybe
      rotate(radians(90));

    } 
    
    if(this.facing == -1){
      // omit maybe
      rotate(radians(180));
    }
    
    let [sx, sy] = this.animate();
    
    image(this.spriteSheet, 0, 0, 89, 115, 64 * (this.sx), 0, 64, 83);

    
    if(this.facing == 1 || this.facing == -1) {
      this.y -= this.speed * this.move;
    } // right and left are this.facing == 2  , and this.facing == -2
     else {
      this.x += this.speed * this.move;
    }

    if (frameCount % 8 == 0) {
       this.sx = (this.sx + 1) % 5;
    }

    // increase speed through game
    if(this.speed >= 19.2){
      this.speed = 19.6;
    } else if (frameCount % 257 == 0) {
      this.speed += this.speed * (0.182);
   }
    
    
    this.spriteFrame += 1;


     pop();


     push();

     if(this.move == 1 || this.move == -1){

       if(this.facing == 1) {
        this.next_y_special = old_y + 5 * 1;
      } else if(this.facing == -1){
        this.next_y_special = old_y + 5 * -1;
      } else if(this.facing == 2){
        this.next_x_special = old_x + 5 * 1;
      } else if(this.facing == -2){
        this.next_x_special = old_x + 5 * -1;
      }

      if (this.next_y_special < 13) {
        //console.log(" y < 13:", this.next_y_special);
        this.move = -1;
        this.facing = -1;
     } else if (this.next_y_special > 874){
      //console.log(" y > 787:", this.next_y_special);
       this.move = 1;
       this.facing = 1;
     } else if (this.next_x_special < 13){
      //console.log(" x < 13:", this.next_x_special);
       this.move = 1;
       this.facing = 2;

     } else if (this.next_x_special > 1278){
      //console.log(" x > 787:", this.next_x_special);
       this.move = -1;
       this.facing = -2
     }
    }

    pop();

  }

  go(goNumericVAL){
    if(goNumericVAL == 1){
      this.move = 1;
      this.facing = 1;
      this.sx = 0;
    } else if(goNumericVAL == -1){
      this.move = -1;
      this.facing = -1;
      this.sx = 0;
    } else if(goNumericVAL == -2){
      this.move = -1;
      this.facing = -2;
      this.sx = 0;
    } else if(goNumericVAL == 2){
      this.move = 1;
      this.facing = 2;
      this.sx = 0;
    }
  }

  stop(){
    this.move = 0;
  }

  grabCheck(){
    let d = -1;
    if(mouseX > this.x - 69 && mouseX < this.x + 69 &&
      mouseY > this.y - 68 && mouseY < this.y + 68){

        d = dist(mouseX, mouseY, this.x, this.y);
      }
      return d;
  }

  grab() {
        this.stop();
        this.grabbed = true;
        //this.offsetX = this.x - mouseX;
        //this.offsetY = this.y - mouseY;

        int_bugs_killed_in_game += 1;
       
  }



  
}