
var canvas;
var gl;

var points = [];
var newpoints;

var NumTimesToSubdivide = 7;

var theta = 0; 

var twistfactor = 1.0;

var program;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    showTriangle();
    
    document.getElementById("theta").onchange = function redraw()
    {
        theta = document.getElementById("theta").value;
        twistfactor = document.getElementById("tfact").value;
        document.getElementById("tessr").value = NumTimesToSubdivide;
        document.getElementById("thetar").value = theta;
        document.getElementById("tfactr").value = twistfactor;
        newpoints = twistShape( points, theta, twistfactor);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(newpoints), gl.STATIC_DRAW );
        render();
    }
    document.getElementById("tfact").onchange = function redraw2()
    {
        theta = document.getElementById("theta").value;
        twistfactor = document.getElementById("tfact").value;
        document.getElementById("tessr").value = NumTimesToSubdivide;
        document.getElementById("thetar").value = theta;
        document.getElementById("tfactr").value = twistfactor;
        newpoints = twistShape( points, theta, twistfactor);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(newpoints), gl.STATIC_DRAW );
        render();
    }
    
    document.getElementById("tess").onchange = function redraw3()
    {
        NumTimesToSubdivide = document.getElementById("tess").value;
        theta = document.getElementById("theta").value;
        twistfactor = document.getElementById("tfact").value;
        document.getElementById("tessr").value = NumTimesToSubdivide;
        document.getElementById("thetar").value = theta;
        document.getElementById("tfactr").value = twistfactor;
        // The initial triangle
        
        vertices = [
        vec2( -0.5, -0.288675134594812882254574390250978727823800875635063438009301 ),
        vec2(  0,  0.577350269189625764509148780501957455647601751270126876018602 ),
        vec2(  0.5, -0.288675134594812882254574390250978727823800875635063438009301 )
        ];
        //empty points
        points = [];
        //scale the triangle so that it can rotate comfortably in canvas
        scaleShape(vertices);
        
        //subdivide triangle into smaller triangles
        divideTriangle( vertices[0], vertices[1], vertices[2],
                        NumTimesToSubdivide);
        
        // Vertices to render are in the global 'points' array
        //apply the twist
        points = twistShape( points, theta, twistfactor);
        
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
        render();
    }
}

function showTriangle()
{
    // The initial triangle
    
    var vertices = [
        vec2( -0.5, -0.288675134594812882254574390250978727823800875635063438009301 ),
        vec2(  0,  0.577350269189625764509148780501957455647601751270126876018602 ),
        vec2(  0.5, -0.288675134594812882254574390250978727823800875635063438009301 )
    ];
    
    //scale the triangle so that it can rotate comfortably in canvas
    scaleShape(vertices);
    
    //subdivide triangle into smaller triangles
    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);
    
    // Vertices to render are in the global 'points' array
    //apply the twist
    points = twistShape( points, theta, twistfactor);
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function scaleShape( shapeVertices )
{
    var maxDist = 0.0;
    for( var j=0; j < shapeVertices.length; j++)
    {
        var v = shapeVertices[j];
        var d = distanceFromCenter(v);
        if ( d > maxDist)
        {
            maxDist = d;
        }
    }
    for( var j=0; j < shapeVertices.length; j++)
    {
        var v = shapeVertices[j];
        v = scale(1/maxDist,v);
        shapeVertices[j] = v;
    }
    
}

function distance( a, b )
{
    var u = subtract( a, b );
    return length(u);
}

function distanceFromCenter(a)
{
    return length(a);
}

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion
    
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
    
        //bisect the sides
        
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles
        
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        divideTriangle( ac, bc, ab, count );
    }
}

function twistShape( shape, theta, twistfactor)
{
    var x; //new x coordinate
    var y; //new y coordinate
    var d; //current distance from center
    var resultShape = []; //= shape is not a copy, shape.slice(0) is a very shallow copy
    
    for(var i = 0; i < shape.length; i++)
    {
        resultShape.push(shape[i].slice(0)); //deeper copy
        d = length(shape[i]);
        d = (d-1.0)*twistfactor + 1.0;
        x = shape[i][0]*Math.cos(d*theta)-shape[i][1]*Math.sin(d*theta);
        y = shape[i][0]*Math.sin(d*theta)+shape[i][1]*Math.cos(d*theta);
        resultShape[i][0] = x;
        resultShape[i][1] = y;
    }
    return resultShape;
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}