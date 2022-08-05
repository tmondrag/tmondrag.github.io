// Geometry.js
// Prototypes for geometrical objects -------------

function Point(context,name,pointx,pointy,color) 
{
  this.name = name,
  this.x = pointx,
  this.y = pointy,
  this.color = color,
  this.context = context;
};
    
function Grid(context,name,gcolor,bcolor,stepx,stepy) 
{
  this.name = name;
  this.context = context;
  this.gridcolor = gcolor;
  this.backcolor = bcolor;
  this.stepx = stepx;
  this.stepy = stepy;
};

function Segment(context,name,color,startpoint,endpoint) 
{
  this.context = context;
  this.name = name;
  this.color = color;
  this.start = startpoint;
  this.end = endpoint;
};

function Ray(context,canvas,name,color,startpoint,otherpoint) 
{
  this.context = context;
  this.canvas = canvas;
  this.name = name;
  this.color = color;
  this.start = startpoint;
  this.other = otherpoint;
  this.vector = {x:(this.other.x - this.start.x),y:(this.other.y - this.start.y)};
};

function MidpointBisector(context,canvas,name,color,pointA,pointB,startpoint,otherpoint) 
{
  // pointA and pointB are the endpoints of the line to be bisected
  // startpoint and otherpoint are placeholders. startpoint will be the actual
  // midpoint on the line and otherpoint will be another point on the 
  // perpendicular bisector
  this.context = context;
  this.canvas = canvas;
  this.name = name;
  this.color = color;
  this.pointA = pointA;
  this.pointB = pointB;
  this.start = startpoint;
  this.other = otherpoint;
  var BA = {x:(pointB.x - pointA.x),y:(pointB.y - pointA.y)};
  this.start.x = pointA.x + 0.5*BA.x;
  this.start.y = pointA.y + 0.5*BA.y;
  this.vector = {x:BA.y,y:-BA.x};
  this.other.x = this.start.x+this.vector.x;
  this.other.y = this.start.y+this.vector.y;
}

function AngleBisector(context,canvas,name,color,pointA,pointB,pointC,pointD) 
{
  //pointB is the angle's vertex, pointA and pointB define the rest of the angle
  // pointD is a point on the angle bisector
  this.context = context;
  this.canvas = canvas;
  this.name = name;
  this.color = color;
  this.pointA = pointA;
  this.start = pointB;
  this.pointC = pointC;
  this.other = pointD;
  var BA = {x:(pointA.x - pointB.x),y:(pointA.y - pointB.y)},
      BC = {x:(pointC.x - pointB.x),y:(pointC.y - pointB.y)},
      magBA = Math.sqrt(BA.x*BA.x + BA.y*BA.y),
      magBC = Math.sqrt(BC.x*BC.x + BC.y*BC.y);
  
  BA = {x:BA.x/magBA, y:BA.y/magBA};
  BC = {x:BC.x/magBC, y:BC.y/magBC};
  
  this.vector = {x:BA.x+BC.x, y:BA.y+BC.y};
  this.other.x = this.start.x+this.vector.x;
  this.other.y = this.start.y+this.vector.y;
};

function NormalInterceptor(context,name,color,pointA,pointB,pointX,pointend) 
{
  // A line segment that intersects pointX and is perpendicular to the line 
  // through pointA and pointB. pointend is a placeholder where the lines will meet
  this.context = context;
  this.name = name;
  this.color = color;
  this.pointA = pointA;
  this.pointB = pointB;
  this.pointX = pointX;
  this.end = pointend;
  var BA = {x:(pointB.x - pointA.x),y:(pointB.y - pointA.y)},
      XA = {x:(pointX.x - pointA.x),y:(pointX.y - pointA.y)};
      
  // colinearity check
  if (BA.x/XA.x == BA.y/XA.y) 
  {
    console.log('point ('+pointX.x+','+pointX.y+') is colinear with point ('+pointA.x+','+pointA.y+') and point ('+pointB.x+','+pointB.y+')');
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
    else if (BA.y == 0) {multip = XA.y/BA.x;}
    this.end.x = pointX.x-multip*BA.y;
    this.end.y = pointX.y+multip*BA.x;
  }
};

function Intersection(context,name,color,pointA,pointB,pointC,pointD) 
{
  // finds the intersection of the lines that pass though the points A and B
  // and points C and D
  // very simular to a point with bonus features
  this.context = context;
  this.name = name;
  this.color = color;
  this.pointA = pointA;
  this.pointB = pointB;
  this.pointC = pointC;
  this.pointD = pointD;
  var BA = {x:(pointB.x - pointA.x),y:(pointB.y - pointA.y)},
      DC = {x:(pointD.x - pointC.x),y:(pointD.y - pointC.y)},
      CA = {x:(pointC.x - pointA.x),y:(pointC.y - pointA.y)},
      multip = (CA.x*DC.y-CA.y*DC.x)/(BA.x*DC.y-BA.y*DC.x);
  
  this.x = pointA.x + multip*BA.x;
  this.y = pointA.y + multip*BA.y;
}

// practical functions -----------

function distance(pointA,pointB) 
{
  var BA = {x:(pointA.x - pointB.x),y:(pointA.y - pointB.y)},
      magBA = Math.sqrt(BA.x*BA.x + BA.y*BA.y);
      
  return magBA;
}

function drawGrid(context, gridcolor, backcolor, stepx, stepy) 
{
   context.save();

   context.strokeStyle = gridcolor;
   context.fillStyle = backcolor;
   context.lineWidth = 0.5;
   context.fillRect(0, 0, context.canvas.width, context.canvas.height);

   for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) 
   {
     context.beginPath();
     context.moveTo(i, 0);
     context.lineTo(i, context.canvas.height);
     context.stroke();
   }

   for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) 
   {
     context.beginPath();
     context.moveTo(0, i);
     context.lineTo(context.canvas.width, i);
     context.stroke();
   }

   context.restore();
};

function drawPoint(context,pointx,pointy,name,color) 
{
  context.save();
  
  context.strokeStyle = color;
  context.fillStyle = color;  
  context.lineWidth = 0.0;
  context.font = '8 pt Sans-Serif';
  context.beginPath();
  context.arc(pointx,pointy,3,0,2*Math.PI,true);
  context.stroke();
  context.fill();
  context.fillText(name,pointx-10,pointy-5);
  
  context.restore();
};

function drawRay(context,canvas,color,startPoint,vector) 
{
  context.save();
  
  var multip;
  
  if (vector.x > 0) 
  {
    multip = (canvas.width - startPoint.x)/vector.x;
  }
  else if (vector.x < 0) 
  {
  	 multip = -startPoint.x/vector.x;
  }
  else if (vector.y < 0) 
  {
  	 multip = -startPoint.y/vector.y;
  }
  else if (vector.y > 0) 
  {
  	 multip = (canvas.height - startPoint.y)/vector.y;
  }
  else 
  {
  	 console.log('Warning!!! Zero vector; ray not drawn');
  	 multip = 0;
  }
  
  context.strokeStyle = color;  
  context.lineWidth = 1.0;
  
  context.beginPath();
  context.moveTo(startPoint.x,startPoint.y);
  context.lineTo(startPoint.x+multip*vector.x,startPoint.y+multip*vector.y);
  context.stroke();
  
  context.restore();
};

function drawLine(context,canvas,color,startPoint,vector) 
{
  context.save();
  
  var multip;
  
  if (vector.x == 0 && vector.y == 0)
  {
  	 console.log('Warning!!! Zero vector; line not drawn');
  	 multip = 0;
  }
  
  else if (startPoint.x < 0.5*canvas.width) 
  {    
    multip = (canvas.width - startPoint.x)/vector.x;
  }
  else 
  {
  	 multip = startPoint.x/vector.x;
  }
  
  context.strokeStyle = color;  
  context.lineWidth = 1.0;
  
  context.beginPath();
  context.moveTo(startPoint.x-multip*vector.x,startPoint.y-multip*vector.y);
  context.lineTo(startPoint.x+multip*vector.x,startPoint.y+multip*vector.y);
  context.stroke();
  
  context.restore();
};

function drawLineSeg(context,color,startPoint,endPoint) 
{
  context.save();
  
  context.strokeStyle = color;  
  context.lineWidth = 1.0;
  
  context.beginPath();
  context.moveTo(startPoint.x,startPoint.y);
  context.lineTo(endPoint.x,endPoint.y);
  context.stroke();
  
  context.restore();
};

function windowToCanvas(canvas, mouseEvent) // translate window coordinates to 2d canvas coordinates
{
   var x = mouseEvent.x || mouseEvent.clientX,
       y = mouseEvent.y || mouseEvent.clientY,
       bbox = canvas.getBoundingClientRect();

   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
};
