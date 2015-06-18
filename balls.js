clicked = false;
ballId = -1;

function init() 
{
	static = new rect("#DEB887", 0, 0, 320, 240);
	dynamic = new rect("#DEB887", 320, 240, 320, 240);
	balls = [ 	new ball("#22E857", 100, 100, 25, 2, 2),
				new ball("#FF6347", 120, 30, 25, 1, 2),
				new ball("#23B453", 40, 200, 25, -1, -1),
                new ball("#800080", 280, 200, 30, -2, -1),
                new ball("#FFE4E1", 250, 100, 40, -2, -1),
                new ball("#1E90FF", 40, 40, 30, -1, 2)
			];
	ballsMoving = [];

	function draw() 
	{
		//turn on clearRect for clear all canvas
		context.clearRect(0,0, canvas.width, canvas.height)
		static.draw();
		dynamic.draw();
		for (var i=0; i<balls.length; i++)
			balls[i].draw(); 
		for (var i=0; i<ballsMoving.length; i++)
			ballsMoving[i].draw(); 
	}

	function update() 
	{
		for (var i=0; i<ballsMoving.length; i++)
			ballsMoving[i].update(dynamic);
	}

	function play() 
	{
		draw();
		update();
	}
	canvas = document.getElementById('pong');
	context = canvas.getContext('2d');
	canvas.width = static.width + dynamic.width;
	canvas.height = static.height + dynamic.height;	
    canvas.onmousedown = pick;
    canvas.onmouseup = drop;
	setInterval(play, 10);
}

function ball(color, x, y, radius, dX, dY)
{
	this.color=color; 
	this.x=x; 
	this.y=y; 
	this.radius=radius; 
	this.dX=dX;
	this.dY=dY;
	
	this.draw=function() 
	{
		context.fillStyle=this.color; 
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
		context.fill();
	}

	this.update=function(rect)
	{
		this.x+=this.dX;
		this.y+=this.dY;
		if (this.y - this.radius<=rect.minY) {
			this.y = rect.minY + this.radius; 
			this.dY = -this.dY;
		} 
		if (this.y + this.radius >= rect.maxY) {
			this.y = rect.maxY - this.radius;
			this.dY = -this.dY;
		} 
		if (this.x - this.radius <= rect.minX) {
			this.x = rect.minX + radius;
			this.dX=-this.dX;
		}
		if (this.x + this.radius >= rect.maxX) {
			this.x = rect.maxX - radius;
			this.dX=-this.dX;
		}
	}

	//error
	this.inBounds = function(rect)
	{
		if (this.y - this.radius > rect.minY &&
			this.x + this.radius < rect.maxX &&
			this.y + this.radius < rect.maxY &&
			this.x - this.radius > rect.minX)
			return true;
		else 
			return false;
	}

	//error
	this.hit = function(x,y)
	{
		if (y > this.y - this.radius &&
			x < this.x + this.radius &&
			y < this.y + this.radius&&
			x > this.x - this.radius)
			return true;
		else 
			return false;
	}
}

function rect(color, x, y, width, height)
{
	this.color=color; 
	this.x=x; 
	this.y=y; 
	this.width = width;
	this.height = height;
	this.minX = x;
	this.maxX = x + width;
	this.minY = y;
	this.maxY = y + height;
	this.draw=function() 
	{
		context.fillStyle=this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}

//error - ball, but array is balls!
function pick(e)
{
	for (var i = 0; i<balls.length; i++)
	{
		if (balls[i].hit(e.pageX, e.pageY))
		{
			clicked = true;
			ballId = i;
			//error, function is not declared
			//canvas.onmousemove = myMove;
			canvas.onmousemove = drag;
		}
	}
}

function drag(e)
{
	if (clicked && ballId !== -1)
	{
		balls[ballId].x = e.pageX;
		balls[ballId].y = e.pageY;
	}
}

function drop(e)
{
	var b = balls[ballId];
	if (b.inBounds(dynamic))
	{
		balls.splice(ballId, 1);
		ballsMoving.push(b);
		clicked = false;
	}
	canvas.onmousemove = null;
}
