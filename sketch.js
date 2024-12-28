let player1, player2;
let bgImg;
let ball;

class Player {
  constructor(x, y, spritesInfo, isFlipped) {
    this.x = x;
    this.y = y;
    this.spritesInfo = spritesInfo;
    this.isFlipped = isFlipped;
    this.health = 100;
    this.currentAction = 'idle';
    this.frameCount = 0;
    this.animationSpeed = 15;
    this.isChangingAction = false;
    this.initialX = x;
    this.moveSpeed = 5;
    
    // 計算最大寬度和所有動作的偏移量
    this.maxWidth = Math.max(
      spritesInfo.idle.width,
      spritesInfo.attack.width,
      spritesInfo.defend.width
    );
    
    // 計算每個動作的x偏移量，使其置中對齊
    for (let action in spritesInfo) {
      spritesInfo[action].xOffset = (this.maxWidth - spritesInfo[action].width) / 2;
    }
    
    this.height = spritesInfo.idle.height;
  }

  display() {
    let spriteInfo = this.spritesInfo[this.currentAction];
    
    // 計算當前幀
    if (this.frameCount % this.animationSpeed === 0) {
      spriteInfo.currentFrame = (spriteInfo.currentFrame + 1) % spriteInfo.frames;
      // 如果動作播放完一輪，回到idle狀態
      if (spriteInfo.currentFrame === 0 && this.isChangingAction) {
        this.currentAction = 'idle';
        this.isChangingAction = false;
      }
    }
    this.frameCount++;

    // 計算來源圖片的位置
    let srcX = spriteInfo.currentFrame * spriteInfo.width;
    
    if (this.isFlipped) {
      push();
      // 設定翻轉中心點
      translate(this.x + this.maxWidth, this.y);
      scale(-1, 1);
      // 繪製角色
      image(spriteInfo.img, 
            0, 0,                                     // 目標位置
            spriteInfo.width, spriteInfo.height,      // 目標大小
            srcX, 0,                                  // 來源位置
            spriteInfo.width, spriteInfo.height);     // 來源大小
      pop();
    } else {
      // 直接繪製角色
      image(spriteInfo.img, 
            this.x, this.y,                          // 目標位置
            spriteInfo.width, spriteInfo.height,     // 目標大小
            srcX, 0,                                 // 來源位置
            spriteInfo.width, spriteInfo.height);    // 來源大小
    }
    
    // 顯示生命值和寬度資訊
    fill(255, 0, 0);
    rect(this.x, this.y - 20, this.health, 10);
    
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(`Width: ${spriteInfo.width} Action: ${this.currentAction} Frame: ${spriteInfo.currentFrame}`, 
         this.x + this.maxWidth/2, this.y - 30);
  }

  changeAction(action) {
    // 只有在動作真的改變時才重置
    if (this.currentAction !== action) {
      this.currentAction = action;
      this.spritesInfo[action].currentFrame = 0;
      this.frameCount = 0;
      if (action !== 'idle') {
        this.isChangingAction = true;
      }
    }
  }

  hit() {
    this.health -= 5;
    if (this.health < 0) this.health = 0;
  }

  moveForward() {
    if (this.isFlipped) {
      this.x -= this.moveSpeed;
    } else {
      this.x += this.moveSpeed;
    }
  }

  resetPosition() {
    this.x = this.initialX;
  }
}

class Ball {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.direction = direction; // 1 向右, -1 向左
    this.size = 20;
  }

  move() {
    this.x += this.speed * this.direction;
  }

  display() {
    fill(255);
    ellipse(this.x, this.y, this.size);
  }

  hits(player) {
    let playerX = player.x;
    let playerWidth = player.maxWidth; // 使用最大寬度進行碰撞檢測
    
    return this.x > playerX && 
           this.x < playerX + playerWidth &&
           this.y > player.y &&
           this.y < player.y + player.height;
  }
}

function preload() {
  // 載入背景圖片
  bgImg = loadImage('background.jpg');
  // 預載入玩家1的圖片
  player1Sprites = {
    idle: {
      img: loadImage('player1_cook.png'),
      width: 43 ,
      height: 46,
      frames: 8,
      currentFrame: 0
    },
    attack: {
      img: loadImage('player1_socks.png'),
      width: 38,
      height: 39,
      frames: 8,
      currentFrame: 0
    },
    defend: {
      img: loadImage('player1_golf.png'),
      width: 43,
      height: 43,
      frames: 8,
      currentFrame: 0
    }
  };
  
  // 預載入玩家2的圖片
  player2Sprites = {
    idle: {
      img: loadImage('player2_hi.png'),
      width: 28,
      height: 46,
      frames: 6,
      currentFrame: 0
    },
    attack: {
      img: loadImage('player2_walk.png'),
      width: 25,
      height: 46,
      frames: 5,
      currentFrame: 0
    },
    defend: {
      img: loadImage('player2_dance.png'),
      width: 29,
      height: 46,
      frames: 4,
      currentFrame: 0
    }
  };
}
 

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let yPos = height * 2/3;
  player1 = new Player(100, yPos, player1Sprites, false);
  player2 = new Player(width-300, yPos, player2Sprites, true);
  
  ball = null;
}

function draw() {
  // 繪製背景
  image(bgImg, 0, 0, width, height);
  
  // 顯示玩家
  player1.display();
  player2.display();
  
  // 在畫面左上角顯示操作說明
  fill(255);
  textSize(16);
  textAlign(LEFT);
  
  // 玩家1操作說明
  text("玩家1控制：", 10, 30);
  text("Z: 煮菜", 10, 50);
  text("A: 回位", 10, 70);
  text("C: 高爾夫", 10, 90);
  text("V: 發射", 10, 110);
  text("D: 前進", 10, 130);
  text("X: 穿襪子", 10, 150);
  
  // 玩家2操作說明
  text("玩家2控制：", 200, 30);
  text("K: 嗨", 200, 50);
  text("↓: 跳舞", 200, 70);
  text("L: 走路", 200, 90);
  text("P: 發射", 200, 110);
  text("O: 前進", 200, 130);
  text("I: 回位", 200, 150);
  
  // 顯示寬度資訊
  text(`Player 1 寬度: ${player1.spritesInfo[player1.currentAction].width}`, 10, 180);
  text(`Player 2 寬度: ${player2.spritesInfo[player2.currentAction].width}`, 200, 180);
  
  // 如果有球，則移動和顯示球
  if (ball) {
    ball.move();
    ball.display();
    
    // 檢查碰撞
    if (ball.hits(player1)) {
      player1.hit();
      ball = null;
    } else if (ball.hits(player2)) {
      player2.hit();
      ball = null;
    }
    
    // 如果球超出畫面則刪除
    if (ball && (ball.x < 0 || ball.x > width)) {
      ball = null;
    }
  }

  // 玩家1控制
  if (keyIsDown(90)) {  // Z
    player1.changeAction('idle');
  }
  if (keyIsDown(88)) {  // X
    player1.changeAction('attack');
  }
  if (keyIsDown(67)) {  // C
    player1.changeAction('defend');
  }
  if (keyIsDown(68)) {  // D
    player1.moveForward();
  }
  
  // 玩家2控制
  if (keyIsDown(75)) {  // K
    player2.changeAction('idle');
  }
  if (keyIsDown(76)) {  // L
    player2.changeAction('attack');
  }
  if (keyIsDown(186)) {  // ;
    player2.changeAction('defend');
  }
  if (keyIsDown(79)) {  // O
    player2.moveForward();
  }
}

function keyPressed() {
  // 玩家1控制
  if (keyCode === 86) {  // V
    ball = new Ball(player1.x + player1.maxWidth, player1.y + player1.height/2, 1);
  }
  if (keyCode === 65) {  // A
    player1.resetPosition();
  }
  
  // 玩家2控制
  if (keyCode === 80) {  // P
    ball = new Ball(player2.x, player2.y + player2.height/2, -1);
  }
  if (keyCode === 73) {  // I
    player2.resetPosition();
  }
  
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 視窗大小改變時也要更新位置
  let yPos = height * 2/3;
  if (player1) player1.y = yPos;
  if (player2) player2.y = yPos;
}