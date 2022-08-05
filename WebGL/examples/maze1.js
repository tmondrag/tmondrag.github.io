var gl;
var vertices;
var colorsArray;
var mazeheight = 10;
var mazewidth = 10;
var maze;

var straightweight = 0.25;
var cornerweight = 0.33;
var Lspeed = 0.125;
var Tspeed = 0.0125;

var near = 0.0005;
var far = 90;
var radius = 4.0;
var phi    = 0.0;
var  fovy = 75.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var mvMatrix, pMatrix;
var modelView, projection;
var eye = vec3(0.5,-2,0.5);
var at = vec3(0.5,-1.5,0.5);
const up = vec3(0,0,1);
var direction = normalize(subtract(at,eye));
var theta  = Math.atan2(direction[1],direction[0]);

const cBlu = vec4(0.0,0.0,1.0,1.0);
const cBlud = vec4(0.0,0.0,0.5,1.0);
const cBlul = vec4(0.7,0.7,1.0,1.0);
const cGre = vec4(0.0,1.0,0.0,1.0);
const cRed = vec4(1.0,0.0,0.0,1.0);
const cBla = vec4(0.0,0.0,0.0,1.0);
const cBr1 = vec4(0.75,0.75,0.5,1.0);
const cBro = vec4(0.24,0.16,0.0,1.0);
const cYel = vec4(1.0,1.0,0.3,1.0);


window.onload = function init()
{
    //event handler setup
    if (document.addEventListener) {
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
    }
    else if (document.attachEvent) {
        document.attachEvent("onkeydown", function() {
            keyDownHandler(window.event);
        });
        document.attachEvent("onkeyup", function() {
            keyUpHandler(window.event);
        });
    }
    else {
        // If you want to support TRULY antiquated browsers
        document.onkeydown = function(event) {
            keyDownHandler(event || window.event);
        };
        document.onkeyup   = function(event) {
            keyUpHandler(event || window.event);
        };
    }
    
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
 
    //var perspopt = document.getElementById("persp").selectedIndex;

    document.getElementById("nrows").onchange = function changemazeheight0()
    {
        mazeheight = document.getElementById("nrows").value;
        document.getElementById("nrowsr").value = mazeheight;
        mazeheight = parseInt(mazeheight);
        init();
    }

    document.getElementById("nrowsr").onchange = function changemazeheight1()
    {
        mazeheight = document.getElementById("nrowsr").value;
        mazeheight = parseInt(mazeheight);//because this.value is always passed as a string
        if(isNaN(mazeheight)){mazeheight=10;}
        document.getElementById("nrows").value = mazeheight;
        init();
    }

    document.getElementById("ncols").onchange = function changemazewidth0()
    {
        mazewidth = document.getElementById("ncols").value;
        document.getElementById("ncolsr").value = mazewidth;
        mazewidth = parseInt(mazewidth);
        init();
    }

    document.getElementById("ncolsr").onchange = function changemazewidth1()
    {
        mazewidth = document.getElementById("ncolsr").value;
        mazewidth = parseInt(mazewidth);
        if(isNaN(mazewidth)){mazewidth=10;}
        document.getElementById("ncols").value = mazewidth;
        init();
    }
    
    document.getElementById("cur2strrat0").onchange = function changecurviness0()
    {
        straightweight = document.getElementById("cur2strrat0").value;
        straightweight = parseFloat(straightweight);
        if(isNaN(straightweight)){straightweight=0.5;}
        cornerweight = 1 - straightweight;
        init();
    }
    
    document.getElementById("regen").onclick = function foo(){init();}
    direction = normalize(subtract(at,eye));
    document.getElementById("speed").onchange = function()
    {
        Lspeed = this.value;
        document.getElementById("speedr").innerHTML = Lspeed;
    }
    document.getElementById("rspeed").onchange = function()
    {
        Tspeed = this.value;
        document.getElementById("rspeedr").innerHTML = Tspeed;
    }
    
    document.getElementById("nrows").value = mazeheight;
    document.getElementById("nrowsr").value = mazeheight;
    document.getElementById("ncols").value = mazewidth;
    document.getElementById("ncolsr").value = mazewidth;
    document.getElementById("cur2strrat0").value=straightweight/(cornerweight+straightweight);
    document.getElementById("speed").value = Lspeed;
    document.getElementById("speedr").innerHTML = Lspeed;
    document.getElementById("rspeed").value = Tspeed;
    document.getElementById("rspeedr").innerHTML = Tspeed;

    maze = createMaze2D(mazeheight,mazewidth);
    //tablecontents = Matrix2Table(maze);
    //document.getElementById("maze").innerHTML=tablecontents;
    Matrix23DMaze(maze);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    aspect =  canvas.width/canvas.height;
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );    
    gl.enable(gl.DEPTH_TEST);
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Color
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

    render1();
}


function render0() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    mvMatrix = lookAt(eye, at , up);
    pMatrix = ortho(-8,8,-4,4,-40,4);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );


    for(i=0;i<vertices.length;i+=4)
    {
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
    }
}

function render1() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    mvMatrix = lookAt(eye, at , up);
    pMatrix = perspective(fovy, aspect, far, near);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );


    for(i=0;i<vertices.length;i+=4)
    {
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
    }
}

function createMaze2D(height, width)
{
    var backtrace = new Array();
    var newMaze = new Array();
    newMaze.length = height;
    for(var i = 0; i<height; i++)
    {
        newMaze[i] = new Array();
        newMaze[i].length = width;

        for(var j = 0; j<width; j++)
        {
            newMaze[i][j] = 0;
        }
    }
    var i = Math.floor((Math.random()*(height-2)+1)); 
    var j = Math.floor((Math.random()*(width-2)+1)); 
    backtrace.push([i,j]);//select random cell in interior and put it on path
    newMaze[i][j] = newMaze[i][j] | 16;//mark cell as visited
    var neighbors = new Array();
    var total = 0.0;
    var dart;
    while(backtrace.length > 0)
    {   
        i = backtrace[backtrace.length - 1][0];
        j = backtrace[backtrace.length - 1][1];
        neighbors.push(0.0);//east neighbor
        neighbors.push(0.0);//south neighbor
        neighbors.push(0.0);//west neghbor
        neighbors.push(0.0);//north neighbor
        if((j+1 < width)&&(newMaze[i][j+1] < 1))
        //if cell is not on east end and east neighbor is unvisited
        {
            if((newMaze[i][j] & 1) < 1)
            //if cell's west wall is up
            {
                total += cornerweight;
                neighbors[0] = total;
            }
            else
            {
                total += straightweight;
                neighbors[0] = total;
            }
        }
        if((i+1 < height)&&(newMaze[i+1][j] < 1))
        //if cell is not on south end and south neighbor is unvisited
        {
            if((newMaze[i][j] & 8) < 1)
            //if cell's north wall is up
            {
                total += cornerweight;
                neighbors[1] = total;
            }
            else
            {
                total += straightweight;
                neighbors[1] = total;
            }
        }
        if((j > 0)&&(newMaze[i][j-1] < 1))
        //if cell is not on west end and west neighbor is unvisited
        {
            if((newMaze[i][j] & 2) < 1)
            //if cell's east wall is up
            {
                total += cornerweight;
                neighbors[2]= total;
            }
            else
            {
                total += straightweight;
                neighbors[2]= total;
            }
        }
        if((i > 0)&&(newMaze[i-1][j] < 1))
        //if cell is not on north end and north neighbor is unvisited
        {
           if((newMaze[i][j] & 4) < 1)
            //if cell's south wall is up
            {
                total += cornerweight;
                neighbors[3] = total;
            }
            else
            {
                total += straightweight;
                neighbors[3] = total;
            }
        }
        dart = Math.random()*total;
        if(dart<neighbors[0])//select east neighbor
        {
            newMaze[i][j] = newMaze[i][j] | 2;//knock down east wall
            newMaze[i][j+1] = newMaze[i][j+1] | 1;//knock down neighbor's west wall
            newMaze[i][j+1] = newMaze[i][j+1] | 16;//mark neighbor as visited
            backtrace.push([i,j+1]);//put neighbor on path
        }
        else if(dart<neighbors[1])//select south neighbor
        {
            newMaze[i][j] = newMaze[i][j] | 4;//knock down south wall
            newMaze[i+1][j] = newMaze[i+1][j] | 8;//knock down neighbor's north wall
            newMaze[i+1][j] = newMaze[i+1][j] | 16;//mark neighbor as visited
            backtrace.push([i+1,j]);//put neighbor on path
        }
        else if(dart<neighbors[2])//select west neighbor
        {
            newMaze[i][j] = newMaze[i][j] | 1;//knock down west wall
            newMaze[i][j-1] = newMaze[i][j-1] | 2;//knock down neighbor's west wall
            newMaze[i][j-1] = newMaze[i][j-1] | 16;//mark neighbor as visited
            backtrace.push([i,j-1]);//put neighbor on path
        }
        else if(dart<neighbors[3])//select south neighbor
        {
            newMaze[i][j] = newMaze[i][j] | 8;//knock down north wall
            newMaze[i-1][j] = newMaze[i-1][j] | 4;//knock down neighbor's south wall
            newMaze[i-1][j] = newMaze[i-1][j] | 16;//mark neighbor as visited
            backtrace.push([i-1,j]);//put neighbor on path
        }
        else{backtrace.pop();}//dead end, go backwards in path
        while(neighbors.length > 0){neighbors.pop();}
        total=0.0;
    }  
    newMaze[0][0] = newMaze[0][0] | 8;//knock down north wall
    newMaze[height-1][0] = newMaze[height-1][0] | 4;//knock down south wall
    return newMaze;
}

function Matrix2Table( mat)
{
    var htmlstring = "<tbody>\n";
    
    var height = mat.length;
    var width = mat[0].length;
    
    for(var i=0; i<height; i++)
    {
        htmlstring += "\t<tr id='row "+i+"'>\n";
        for(var j=0; j<width; j++)
        {
            htmlstring += "\t\t<td id='column "+j+"'>"+mat[i][j]+"</td>\n";
        }
        htmlstring += "\t</tr>\n";
    }
    htmlstring += "</tbody>\n"
    return htmlstring;
}

function Matrix23DMaze(mat)
{
    var walls = new Array();
    var wallcolors = new Array
    var temp;
    
    var height = mat.length;
    var width = mat[0].length;
    var scale;

    for(var i=0;i<height;i++)
    {
        for(var j=0;j<width;j++)
        {
            if((mat[i][j] & 8) < 1)
            //if cell's north wall is up
            {
                walls.push([j,height-i,0,1]);
                wallcolors.push(cBlu);
                walls.push([j,height-i,1,1]);
                wallcolors.push(cGre);
                walls.push([j+1,height-i,1,1]);
                wallcolors.push(cGre);
                walls.push([j+1,height-i,0,1]);
                wallcolors.push(cBlu);
            }
            if((mat[i][j] & 1) < 1)
            //if cell's west wall is up
            {
                walls.push([j,height-i,0,1]);
                wallcolors.push(cBla);
                walls.push([j,height-i,1,1]);
                wallcolors.push(cRed);
                walls.push([j,height-(i+1),1,1]);
                wallcolors.push(cRed);
                walls.push([j,height-(i+1),0,1]);
                wallcolors.push(cBla);
            }
        }
    }
    
    //now for the southern and eastern boundary
    for(var i=0;i<width;i++)
    {
        if((mat[height-1][i] & 4) < 1)
        //if cell's south wall is up
        {
            walls.push([i,0,0,1]);
            wallcolors.push(cBlu);
            walls.push([i,0,1,1]);
            wallcolors.push(cGre);
            walls.push([i+1,0,1,1]);
            wallcolors.push(cGre);
            walls.push([i+1,0,0,1]);
            wallcolors.push(cBlu);
        }
    }
    for(var i=0;i<height;i++)
    {
        if((mat[i][width-1] & 2) < 1)
        //if cell's east wall is up
        {
            walls.push([width,i,0,1]);
            wallcolors.push(cBla);
            walls.push([width,i,1,1]);
            wallcolors.push(cRed);
            walls.push([width,i+1,1,1]);
            wallcolors.push(cRed);
            walls.push([width,i+1,0,1]);
            wallcolors.push(cBla);
        }
    }

    // Now a floor!
    walls.push([0,0,0,1]);
    wallcolors.push(cBla);
    walls.push([width,0,0,1]);
    wallcolors.push(cBro);
    walls.push([width,height,0,1]);
    wallcolors.push(cBr1);
    walls.push([0,height,0,1]);
    wallcolors.push(cYel);
    
    // now a roof
    walls.push([0,0,1,1]);
    wallcolors.push(cBla);
    walls.push([width,0,1,1]);
    wallcolors.push(cBlud);
    walls.push([width,height,1,1]);
    wallcolors.push(cBlul);
    walls.push([0,height,1,1]);
    wallcolors.push(cYel);

    vertices = walls;
    colorsArray = wallcolors;
}

function keyDownHandler(e) {
    var key = e.which || e.keyCode;
    direction = normalize(subtract(at,eye));
    var right = normalize(cross(direction,up));
    var mag = length(subtract(at,eye));
    theta  = Math.atan2(direction[1],direction[0]);

    var j = Math.floor(eye[0]);
    var i = Math.floor(mazeheight - eye[1]);
    var cell;
    if (i < mazeheight && i > -1 && j < mazewidth && j > -1)
    {
        cell= maze[i][j];
    }
    else if(i == mazeheight + 1 && j < mazewidth && j > 0)
    {
        cell=4+2+1;
    }
    else if(i == -1 && j < mazewidth && j > 0)
    {
        cell=8+2+1;
    }
    else if(j == -1 && i < mazeheight && i > -1)
    {
        cell=8+4+1;
    }
    else if(j == mazewidth + 1 && i < mazeheight && i > -1)
    {
        cell=8+4+1;
    }
    else
    {
        cell=8+4+2+1;
    }
    var d0,d1,d2;
    
    if(key == 87)
    {//'w'
        d0 = Lspeed*direction[0];
        d1 = Lspeed*direction[1];
        d2 = Lspeed*direction[2];
        if((cell & 2) < 1)
        //if cell's east wall is up
        {
            if(eye[0]+d0 > j+1 - near)
            {
                d0=0;
                d1=0;
            }
        }
        if((cell & 1) < 1)
        //cell's west wall is up
        {
            if(eye[0]+d0 < j + near)
            {
                d0=0;
                d1=0;
            }
        }
        if((cell & 8) < 1)
        //if cell's north wall is up
        {
            if(eye[1]+d1 > mazeheight - i - near)
            {
                d0=0;
                d1=0;
            }
        }
        if ((cell & 4) < 1)
        //cell's south wall is up
        {
            if(eye[1]+d1 < mazeheight - i - 1 + near)
            {
                d0=0;
                d1=0;
            }
        }
        eye[0] = eye[0] + d0;
        at[0] = at[0] + d0;
        eye[1] = eye[1] + d1;
        at[1] = at[1] + d1;
        eye[2] = eye[2] + d2;
        at[2] = at[2] + d2;
    }
    if(key == 83)
    {//'s'
        d0 = -Lspeed*direction[0];
        d1 = -Lspeed*direction[1];
        d2 = -Lspeed*direction[2];
        if((cell & 2) < 1)
        //if cell's east wall is up
        {
            if(eye[0]+d0 > j+1 - near)
            {
                d0=0;
                d1=0;
            }
        }
        if((cell & 1) < 1)
        //cell's west wall is up
        {
            if(eye[0]+d0 < j + near)
            {
                d0=0;
                d1=0;
            }
        }
        if((cell & 8) < 1)
        //if cell's north wall is up
        {
            if(eye[1]+d1 > mazeheight - i - near)
            {
                d0=0;
                d1=0;
            }
        }
        if ((cell & 4) < 1)
        //cell's south wall is up
        {
            if(eye[1]+d1 < mazeheight - i - 1 + near)
            {
                d0=0;
                d1=0;
            }
        }
        eye[0] = eye[0] + d0;
        at[0] = at[0] + d0;
        eye[1] = eye[1] + d1;
        at[1] = at[1] + d1;
        eye[2] = eye[2] + d2;
        at[2] = at[2] + d2;
    }
    if(key == 65)
    {//'a'
        d0 = -Lspeed*right[0];
        d1 = -Lspeed*right[1];
        d2 = -Lspeed*right[2];
        if((cell & 2) < 1)
        //if cell's east wall is up
        {
            if(eye[0]+d0 > j+1 - near)
            {
                d0=0;
                d1=0;
            }
        }
        if((cell & 1) < 1)
        //cell's west wall is up
        {
            if(eye[0]+d0 < j + near)
            {
                d0=0;
                d1=0;
            }
        }
        if((cell & 8) < 1)
        //if cell's north wall is up
        {
            if(eye[1]+d1 > mazeheight - i - near)
            {
                d0=0;
                d1=0;
            }
        }
        if ((cell & 4) < 1)
        //cell's south wall is up
        {
            if(eye[1]+d1 < mazeheight - i - 1 + near)
            {
                d0=0;
                d1=0;
            }
        }
        eye[0] = eye[0] + d0;
        at[0] = at[0] + d0;
        eye[1] = eye[1] + d1;
        at[1] = at[1] + d1;
        eye[2] = eye[2] + d2;
        at[2] = at[2] + d2;
    }
    if(key == 68)
    {//'d'
        d0 = Lspeed*right[0];
        d1 = Lspeed*right[1];
        d2 = Lspeed*right[2];
        if((cell & 2) < 1)
        //if cell's east wall is up
        {
            if(eye[0]+d0 > j+1 - near)
            {
                d0=0;
                d1=0;
            }
        }
        if((cell & 1) < 1)
        //cell's west wall is up
        {
            if(eye[0]+d0 < j + near)
            {
                d0=0;
                d1=0;
            }
        }
        if((cell & 8) < 1)
        //if cell's north wall is up
        {
            if(eye[1]+d1 > mazeheight - i - near)
            {
                d0=0;
                d1=0;
            }
        }
        if ((cell & 4) < 1)
        //cell's south wall is up
        {
            if(eye[1]+d1 < mazeheight - i - 1 + near)
            {
                d0=0;
                d1=0;
            }
        }
        eye[0] = eye[0] + d0;
        at[0] = at[0] + d0;
        eye[1] = eye[1] + d1;
        at[1] = at[1] + d1;
        eye[2] = eye[2] + d2;
        at[2] = at[2] + d2;
    }
    if(key == 37)
    {//'<-'
        theta = theta + Tspeed*Math.PI;
        at[0] = eye[0] + mag*Math.cos(theta);
        at[1] = eye[1] + mag*Math.sin(theta);
    }
    if(key == 39)
    {//'->'
        theta = theta - Tspeed*Math.PI;
        at[0] = eye[0] + mag*Math.cos(theta);
        at[1] = eye[1] + mag*Math.sin(theta);
    }
    if(key == 90)
    {//'Z'
        eye = vec3(0.5,-2,0.5);
        at = vec3(0.5,-1.5,0.5);
    }

    if(key == 67)
    {//'C'
        eye = vec3(0.5,mazeheight+2,0.5);
        at = vec3(0.5,mazeheight+1.5,0.5);
    }
    document.getElementById("key").innerHTML = "theta: "+theta*180/Math.PI+" i: "+Math.floor(mazeheight - eye[1])+" j: "+Math.floor(eye[0]);
    render1();
}

function keyUpHandler(e) {
    var key = e.which || e.keyCode;
    document.getElementById("key").innerHTML = "theta: "+theta*180/Math.PI+" i: "+Math.floor(mazeheight - eye[1])+" j: "+Math.floor(eye[0]);
}
