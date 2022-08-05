// Global variables

var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    drawing_object_arr = [],
    nullpoint = new Point(context,'null',-10,-10,'red')
    draggingpoint = nullpoint;

// Object method modifications

Point.prototype.draw = function () 
{
  drawPoint(this.context,this.x,this.y,this.name,this.color);
};

Point.prototype.recalc = function () {}; 

Grid.prototype.draw = function ()
{
  drawGrid(this.context,this.gridcolor,this.backcolor,this.stepx,this.stepy);
}; 

Grid.prototype.recalc = function () {};   

Segment.prototype.recalc = function () 
{
  
}

Segment.prototype.draw = function () 
{
  drawLineSeg(this.context,this.color,this.start,this.end);
}

Ray.prototype.recalc = function () 
{
  this.vector = {x:(this.other.x - this.start.x),y:(this.other.y - this.start.y)};
}

Ray.prototype.draw = function () 
{
  drawRay(this.context,this.canvas,this.color,this.start,this.vector);
};

MidpointBisector.prototype.recalc = function () 
{
  
  var BA = {x:(this.pointB.x - this.pointA.x),y:(this.pointB.y - this.pointA.y)};
  this.start.x = this.pointA.x + 0.5*BA.x;
  this.start.y = this.pointA.y + 0.5*BA.y;
  this.vector = {x:BA.y,y:-BA.x};
  this.other.x = this.start.x+this.vector.x;
  this.other.y = this.start.y+this.vector.y;
}

MidpointBisector.prototype.draw = function () 
{
  drawLine(this.context,this.canvas,this.color,this.start,this.vector);
};

AngleBisector.prototype.recalc = function () 
{
  
  var BA = {x:(this.pointA.x - this.start.x),y:(this.pointA.y - this.start.y)},
      BC = {x:(this.pointC.x - this.start.x),y:(this.pointC.y - this.start.y)},
      magBA = Math.sqrt(BA.x*BA.x + BA.y*BA.y),
      magBC = Math.sqrt(BC.x*BC.x + BC.y*BC.y);
  
  BA = {x:BA.x/magBA, y:BA.y/magBA};
  BC = {x:BC.x/magBC, y:BC.y/magBC};
  
  this.vector = {x:BA.x+BC.x, y:BA.y+BC.y};
  this.other.x = this.start.x+this.vector.x;
  this.other.y = this.start.y+this.vector.y;
}

AngleBisector.prototype.draw = function () 
{
  drawRay(this.context,this.canvas,this.color,this.start,this.vector);
};

NormalInterceptor.prototype.recalc = function () 
{
  
  var BA = {x:(this.pointB.x - this.pointA.x),y:(this.pointB.y - this.pointA.y)},
      XA = {x:(this.pointX.x - this.pointA.x),y:(this.pointX.y - this.pointA.y)};
      
  // colinearity check
  if (BA.x/XA.x == BA.y/XA.y) 
  {
    console.log('point ('+this.pointX.x+','+this.pointX.y+') is colinear with point ('+this.pointA.x+','+this.pointA.y+') and point ('+this.pointB.x+','+this.pointB.y+')');
    // colinearity shouldn't break anything, but it can indicate something else is broken  
  }
  
  var multip = (XA.x/BA.x-XA.y/BA.y)*BA.x*BA.y/(BA.x*BA.x+BA.y*BA.y);
  
  if (BA.x == 0 && BA.y == 0) 
  {// just draw a line from X to A
    this.end.x = this.pointA.x;
    this.end.y = this.pointA.y;
  }
  else 
  {
    if (BA.x == 0) {multip = XA.x/BA.y;}
    else if (BA.y == 0) {multip = -XA.y/BA.x;}
    this.end.x = this.pointX.x-multip*BA.y;
    this.end.y = this.pointX.y+multip*BA.x;
  }
};

NormalInterceptor.prototype.draw = function () 
{
  drawLineSeg(this.context,this.color,this.pointX,this.end);
};

Intersection.prototype.recalc = function () 
{
  var BA = {x:(this.pointB.x - this.pointA.x),y:(this.pointB.y - this.pointA.y)},
      DC = {x:(this.pointD.x - this.pointC.x),y:(this.pointD.y - this.pointC.y)},
      CA = {x:(this.pointC.x - this.pointA.x),y:(this.pointC.y - this.pointA.y)},
      multip = (CA.x*DC.y-CA.y*DC.x)/(BA.x*DC.y-BA.y*DC.x);
  
  this.x = this.pointA.x + multip*BA.x;
  this.y = this.pointA.y + multip*BA.y;
}

Intersection.prototype.draw = function () 
{
  drawPoint(this.context,this.x,this.y,this.name,this.color);
}

// Functions.....................................................

function redrawScene(canvas,context,drawing_array) 
{
  context.save();
  context.clearRect(0, 0, canvas.width, canvas.height);
  for(var i=0;i<drawing_array.length;i++)
  {
  	 drawing_array[i].recalc();
  	 drawing_array[i].draw();
  }
  context.restore();
  document.getElementById('AB').innerHTML = distance(pointA,pointB);
  document.getElementById('ABstar').innerHTML = distance(pointA,pointBS);
  document.getElementById('AC').innerHTML = distance(pointA,pointC);
  document.getElementById('ACstar').innerHTML = distance(pointA,pointCS);
  document.getElementById('XB').innerHTML = distance(intersX,pointB);
  document.getElementById('XC').innerHTML = distance(intersX,pointC);
  document.getElementById('XBstar').innerHTML = distance(intersX,pointBS);
  document.getElementById('XCstar').innerHTML = distance(intersX,pointCS);
};

function redrawDummy() { redrawScene(canvas,context,drawing_object_arr); };

// Event handlers ..........................................
canvas.onmousedown = function (e) 
{
  var click = windowToCanvas(canvas,e);
  
  e.preventDefault();
  
  if (distance(click,pointA) <= 3) 
  {
    draggingpoint = pointA;  
  }
  else if (distance(click,pointB) <= 3) 
  {
    draggingpoint = pointB; 
  }
  else if (distance(click,pointC) <= 3) 
  {
    draggingpoint = pointC; 
  }
  else 
  {
    draggingpoint = nullpoint; 
  }
}

canvas.onmousemove = function (e) 
{
  var newposition = windowToCanvas(canvas,e);
  
  e.preventDefault();
  
  if (draggingpoint != nullpoint) 
  {
    draggingpoint.x = newposition.x;
    draggingpoint.y = newposition.y;  
    requestAnimationFrame(redrawDummy);
  }
}

canvas.onmouseup = function (e) 
{
  e.preventDefault();
  draggingpoint = nullpoint;
}

// initialization ...........................................

var grid = new Grid(context,'grid','#9999ff','#ffffff',20,20),
    pointA = new Point(context,'A',200,60,'red'),
    pointB = new Point(context,'B',300,100,'red'),
    pointC = new Point(context,'C',260,250,'red'),
    ray1 = new Ray(context,canvas,'A to B','#553399',pointA,pointB),
    ray2 = new Ray(context,canvas,'A to C','#553399',pointA,pointC),
    seg1 = new Segment(context,'B to C','red',pointB,pointC),
    mid0 = new Point(context,'midpoint',300,100,'blue'),
    mid1 = new Point(context,'',260,300,'green'),
    midline1 = new MidpointBisector(context,canvas,"",'green',pointC,pointB,mid0,mid1),
    abis0 = new Point(context,'',260,300,'green'),
    abis1 = new AngleBisector(context,canvas,"CAB",'black',pointC,pointA,pointB,abis0),
    intersX = new Intersection(context,"X",'#555555',mid0,mid1,pointA,abis0),
    pointBS = new Point(context,'B*',200,60,'#553399'),
    pointCS = new Point(context,'C*',200,60,'#553399'),
    nint1 = new NormalInterceptor(context,"normal From X to AB",'navy',pointA,pointB,intersX,pointBS),
    nint2 = new NormalInterceptor(context,"normal From X to AC",'navy',pointA,pointC,intersX,pointCS),
    seg2 = new Segment(context,'B to X','#553399',pointB,intersX),
    seg3 = new Segment(context,'C to X','#553399',pointC,intersX),
    seg4 = new Segment(context,'A to B','red',pointA,pointB),
    seg5 = new Segment(context,'A to C','red',pointA,pointC);

drawing_object_arr.push(grid);
drawing_object_arr.push(pointA);
drawing_object_arr.push(pointB);
drawing_object_arr.push(pointC);
drawing_object_arr.push(ray1);
drawing_object_arr.push(ray2);
drawing_object_arr.push(seg1);
drawing_object_arr.push(midline1);
drawing_object_arr.push(abis1);
drawing_object_arr.push(intersX);
drawing_object_arr.push(nint1);
drawing_object_arr.push(nint2);
drawing_object_arr.push(pointBS);
drawing_object_arr.push(pointCS);
drawing_object_arr.push(seg2);
drawing_object_arr.push(seg3);
drawing_object_arr.push(seg4);
drawing_object_arr.push(seg5);


redrawDummy();