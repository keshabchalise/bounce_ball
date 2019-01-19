let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let count = 0;
let time = 30;
let timeshow = document.querySelector('h3');
let score = document.querySelector('p');
timeshow.textContent = "Time : "+time;
score.textContent = "Score : "+count;
var width = canvas.width = 800;
var height = canvas.height = 400;
var myReq;


function randomNum(min,max){
	return Math.floor(Math.random()*(max-min+1))+min;
}

//Shape constructor
function Shape(x,y,velX,velY,exists){
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = velY;
	this.exists = exists;
}


//define Ball
function Ball(x,y,velX,velY,exists,color,radius){
	Shape.call(this,x,y,velX,velY,exists);
	this.color = color;
	this.radius = radius;
}

Ball.prototype = Object.create(Shape.prototype);

Object.defineProperty(Ball.prototype, 'constructor', { 
    value: Ball, 
    enumerable: false,
    writable: true 
});

//Ball functions
Ball.prototype.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
	ctx.fill();
}

Ball.prototype.update = function(){

	if((this.x+this.radius)>= width){
		this.velX = -(this.velX);
	}
	if((this.x-this.radius)<= 0){
		this.velX = -(this.velX);
	}
	if((this.y+this.radius)>= height){
		this.velY = -(this.velY);
	}
	if((this.y-this.radius)<= 0){
		this.velY = -(this.velY);
	}

	this.x += this.velX;
	this.y += this.velY;

}

Ball.prototype.collisionDetect = function(){
	for(var j=0;j<balls.length;j++){
		if(!(this === balls[j])){
			var dx = this.x - balls[j].x;
			var dy = this.y - balls[j].y;
			var distance = Math.sqrt((dx*dx) + (dy*dy));
			if(distance < this.radius+balls[j].radius){
				this.velX = -(this.velX);
				this.velY = -(this.velY);
				balls[j].velX = -(balls[j].velX);
				balls[j].velY = -(balls[j].velY);
				this.x += this.velX;
				this.y += this.velY;
				balls[j].x += balls[j].velX;
				balls[j].y += balls[j].velY;
			}
		}
	}
}

//define EvilCircle
function EvilCircle(x,y,exists,color,radius){
	Shape.call(this,x,y,20,20,exists);
	this.color = color;
	this.radius = radius;
}

EvilCircle.prototype = Object.create(Shape.prototype);

Object.defineProperty(EvilCircle.prototype,'constructor',{
	value:EvilCircle,
	enumerable:false,
	writable:true 
});

//EvilCircle functions
EvilCircle.prototype.draw = function(){
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle = this.color;
	ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
	ctx.stroke();
}

EvilCircle.prototype.checkBounds = function(){
	if((this.x+this.radius)>= width){
		this.x -= this.radius;
	}
	if((this.x-this.radius)<= 0){
		this.x += this.radius;
	}
	if((this.y+this.radius)>= height){
		this.y -= this.radius;
	}
	if((this.y-this.radius)<= 0){
		this.y += this.radius;
	}

}

EvilCircle.prototype.setControls = function(){
	var that = this;
	window.onkeydown = function(e){
		//left
		if(e.keyCode === 37){
			that.x -= that.velX;
		}
		//right
		if(e.keyCode === 39){
			that.x += that.velX;
		}
		//up
		if(e.keyCode === 38){
			that.y -= that.velY;
		}
		//down
		if(e.keyCode === 40){
			that.y += that.velY;
		}

	}
}

EvilCircle.prototype.collisionDetect = function(){
	for(var k=0;k<balls.length;k++){
		if(balls[k].exists === true){
			var dx = this.x - balls[k].x;
			var dy = this.y - balls[k].y;
			var distance = Math.sqrt((dx*dx) + (dy*dy));
			if(distance <= this.radius + balls[k].radius){
				balls[k].exists = false;
				count++;
				score.textContent = "Score : "+count;
			}
		}
	}
}


	

var balls= [];

// EvilCircle
var evilRadius = 16;
var evilCircle = new EvilCircle(
	randomNum(0+evilRadius,width-evilRadius),
	randomNum(0+evilRadius,height-evilRadius),
	true,
	'black',
	evilRadius,
);
evilCircle.setControls();

function loop(){

	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,width,height);
	
	//Ball
	while(balls.length < 20){
		var radius = 15;
		var ball = new Ball(
			randomNum(radius,width-radius),
			randomNum(radius,height-radius),
			randomNum(-7,7),
			randomNum(-7,7),
			true,
			'cyan',
			radius,
			);
		balls.push(ball);
	}

	for(var i=0;i<balls.length;i++){
		if(balls[i].exists === true){
			balls[i].draw();
			balls[i].update();
			balls[i].collisionDetect();

		}
	}

	evilCircle.draw();
	evilCircle.checkBounds();
	evilCircle.collisionDetect();
	myReq = window.requestAnimationFrame(loop);
}

loop();
var myInterval = setInterval(timer,1000);
	function timer(){
	time--;
	timeshow.textContent = "Time : "+time;
	if(time ==0){
		window.clearInterval(myInterval);
		window.cancelAnimationFrame(myReq);
		alert('Game Over !!, Your Score is: '+count);
		var input = confirm('Do you want to restart the Game?');  //true or false
		if(input){
			balls = [];
			count = 0;
			score.textContent = "Score : "+count;
			time = 30;
			timeshow.textContent = "Time : "+time;
			loop();
			myInterval = setInterval(timer,1000);
			
		}
	}
	if(time > 0 && count === balls.length){
		window.clearInterval(myInterval);
		window.cancelAnimationFrame(myReq);
		alert('Congratulation, You Won the Game!!, Your Score is: '+count);
		var input = confirm('Do you want to restart the Game?');  //true or false
		if(input){
			balls = [];
			count = 0;
			score.textContent = "Score : "+count;
			time = 30;
			timeshow.textContent = "Time : "+time;;
			loop();
			myInterval = setInterval(timer,1000);
			
		}
	}
}




