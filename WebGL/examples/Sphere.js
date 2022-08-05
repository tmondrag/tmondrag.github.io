
var gl;
var points = [];
var radius = 1.0;
var nlat = 13;
var nlong = 24;
var longitudes = [];
var latitudes = [];
var dispx = 0.0;
var dispy = 0.0;
var dispz = 0.0;
var displacementLoc;
var theta = 0.0;
var phi = -Math.PI/2;

white = vec4(1.0,1.0,1.0,1.0);
blue = vec4(0.0,0.0,1.0,1.0);
var colorLoc;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // enable depth testing and polygon offset
    // so lines will be in front of filled triangles
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);
    
    buildlatitudes(nlat);
    buildlongitudes(nlong);
    buildsphere();
    


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation(program, "fColor");
    displacementLoc = gl.getUniformLocation( program, "displacement" );
    thetaLoc = gl.getUniformLocation(program, "theta");
    phiLoc = gl.getUniformLocation(program, "phi");
    
    
    // Grab the input values when they change
    document.getElementById("radius").onchange = function changeradius()
    {
        radius = document.getElementById("radius").value;
        radius = parseFloat(radius);
        document.getElementById("radiusR").value = radius;
        init();
    }
    document.getElementById("nlat").onchange = function changelatdivs()
    {
        nlat = document.getElementById("nlat").value;
        nlat = parseInt(nlat);
        document.getElementById("nlatR").value = nlat;
        init();
    }
    document.getElementById("nlong").onchange = function changelongdivs()
    {
        nlong = document.getElementById("nlong").value;
        nlong = parseInt(nlong);
        document.getElementById("nlongR").value = nlong;
        init();
    }
    document.getElementById("dispx").onchange = function changexdisp()
    {
        dispx = document.getElementById("dispx").value;
        dispx = parseFloat(dispx);
        document.getElementById("dispxR").value = dispx;
        init();
    }
    document.getElementById("dispy").onchange = function changeydisp()
    {
        dispy = document.getElementById("dispy").value;
        dispy = parseFloat(dispy);
        document.getElementById("dispyR").value = dispy;
        init();
    }
    document.getElementById("dispz").onchange = function changezdisp()
    {
        dispz = document.getElementById("dispz").value;
        dispz = parseFloat(dispz);
        document.getElementById("dispzR").value = dispz;
        init();
    }
    document.getElementById("theta").onchange = function changetheta()
    {
        theta = document.getElementById("theta").value;
        document.getElementById("thetaR").value = theta;
        theta = parseFloat(theta);
        theta = radians(theta);
        init();
    }
    document.getElementById("phi").onchange = function changephi()
    {
        phi = document.getElementById("phi").value;
        document.getElementById("phiR").value = phi;
        phi = parseFloat(phi);
        phi = radians(phi);
        init();
    }

    requestAnimFrame(render);
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // build displacement matrix
    var displacement = mat4(
        vec4(1.0, 0.0, 0.0, dispx),
        vec4(0.0, 1.0, 0.0, dispy),
        vec4(0.0, 0.0, 1.0, dispz),
        vec4(0.0, 0.0, 0.0, 1.0))

    // build Azimuth
        
    gl.uniformMatrix4fv(displacementLoc, false, flatten(displacement));
    gl.uniform4fv(colorLoc, flatten(white));
    gl.uniform1f(thetaLoc,theta);
    gl.uniform1f(phiLoc,phi);
    for(i = 0; i < points.length; i+=4)
    {
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
    }

    gl.uniform4fv(colorLoc, flatten(blue));
    for(i = 0; i < points.length; i+=4)
    {
        gl.drawArrays( gl.LINE_LOOP, i, 4 );
    }
}

function buildlongitudes(nlong){
    step = 2*Math.PI/nlong;
    for (i = 0; i <= nlong; i++)
    {
        longitudes[i] = i*step;
    }
}

function buildlatitudes(nlat){
    step = Math.PI/(nlat+1);
    for (i = 0; i <= nlat+1; i++)
    {
        latitudes[i] = Math.PI/2 - i*step;
    }
}

function buildsphere()
{
    points = [];
    for (i = 0; i <= nlat; i++)
    {
        for (j = 0; j < nlong; j++)
        {
            x = radius*Math.cos(latitudes[i])*Math.cos(longitudes[j]);
            y = radius*Math.cos(latitudes[i])*Math.sin(longitudes[j]);
            z = radius*Math.sin(latitudes[i]);
            points.push(vec4(x,y,z,1))
            x = radius*Math.cos(latitudes[i+1])*Math.cos(longitudes[j]);
            y = radius*Math.cos(latitudes[i+1])*Math.sin(longitudes[j]);
            z = radius*Math.sin(latitudes[i+1]);
            points.push(vec4(x,y,z,1))
            x = radius*Math.cos(latitudes[i+1])*Math.cos(longitudes[j+1]);
            y = radius*Math.cos(latitudes[i+1])*Math.sin(longitudes[j+1]);
            z = radius*Math.sin(latitudes[i+1]);
            points.push(vec4(x,y,z,1))
            x = radius*Math.cos(latitudes[i])*Math.cos(longitudes[j+1]);
            y = radius*Math.cos(latitudes[i])*Math.sin(longitudes[j+1]);
            z = radius*Math.sin(latitudes[i]);
            points.push(vec4(x,y,z,1))
        }
    }
}

