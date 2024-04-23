// Global variables

var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    drawing_object_arr = [],
    nullpoint = new Point(context,'null',-10,-10,'red')
    draggingpoint = nullpoint;

// Objects not in geometry.js...................................

function Rectangle(context,name,pointa,width,height,color)
{
  this.context = context,
  this.name = name,
  this.pointa = pointa,
  this.width = width,
  this.height = height,
  this.color = color;
};
Rectangle.prototype.draw()
{
  context.save();
  context.fillStyle = self.color;
  var x = this.pointa.x;
  var y = this.pointa.y;
  context.fillRect(x,y,this.width,this.height)
  context.restore();
};

// Object method modifications..................................

Grid.prototype.draw = function ()
{
  drawGrid(this.context,this.gridcolor,this.backcolor,this.stepx,this.stepy);
};

Grid.prototype.recalc = function () {};

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
};

function redrawDummy() { redrawScene(canvas,context,drawing_object_arr); };

// initialization ...........................................

var grid = new Grid(context,'grid','#9999ff','#eeeeee',20,20),
    r100 = new Rect(context,'r100',);
drawing_object_arr.push(grid);
redrawDummy();
