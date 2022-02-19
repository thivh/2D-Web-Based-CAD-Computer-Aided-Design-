import {findDistance} from './utility.js'

var gl, program;
var mouse = { x:0, y:0, down:false };
var color = [0.0, 0.0, 1.0, 1];
var vertices = [-0.4, -0.4, 0, 0.4, 0.4, 0];
var canvas = document.getElementById("glCanvas");

window.onload = function init() {
    var triangle = new Float32Array(
        vertices);

    gl = canvas.getContext( "experimental-webgl" );
    if (!gl) { alert("WebGL isn’t available"); }


    gl.viewport(0, 0, canvas.width, canvas.height); 
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader"); 
    gl.useProgram(program);

    var colorLocation = gl.getUniformLocation(program, "u_color");
    gl.uniform4fv(colorLocation, color);

    var vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData( gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition"); 
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(vPosition);

    window.addEventListener("keydown", checkKeyPressed); 
    
    requestAnimationFrame( render );
}

function render(time_ms) {
    setupMouse();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    
    var colorLocation = gl.getUniformLocation(program, "u_color");
    gl.uniform4fv(colorLocation, color);

    gl.drawArrays(gl.LINES, 0, 2);

    requestAnimationFrame( render );
}


function checkKeyPressed(e) {
    if (e.keyCode == "84") {
        console.log(mouse)
        if (findDistance(vertices[0],vertices[1],mouse.x,mouse.y)<findDistance(vertices[3],vertices[4],mouse.x,mouse.y)) {
            vertices[0] = mouse.x;
            vertices[1] = mouse.y
        } else {
            vertices[3] = mouse.x;
            vertices[4] = mouse.y
        }
    }
}

function changeCoordinates(X1,Y1,X2,Y2) {
    vertices = [X1, Y1, 0, X2, Y2, 0]
}

function initShaders(gl, vertexShaderId, fragmentShaderId) {
		var vertShdr;
		var fragShdr;

		var vertElem = document.getElementById(vertexShaderId);
		if (!vertElem) {
				alert("Unable to load vertex shader " + vertexShaderId);
				return -1;
		} else {
				vertShdr = gl.createShader(gl.VERTEX_SHADER);
				gl.shaderSource(vertShdr, vertElem.text);
				gl.compileShader(vertShdr);
				if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
						var msg = "Vertex shader failed to compile.  The error log is:" + "<pre>" + gl.getShaderInfoLog(vertShdr) + "</pre>";
						alert(msg);
						console.log(msg);
						return -1;
				}
		}

		var fragElem = document.getElementById(fragmentShaderId);
		if (!fragElem) {
				alert("Unable to load vertex shader " + fragmentShaderId);
				return -1;
		} else {
				fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
				gl.shaderSource(fragShdr, fragElem.text);
				gl.compileShader(fragShdr);
				if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
						var msg = "Fragment shader failed to compile.  The error log is:" + "<pre>" + gl.getShaderInfoLog(fragShdr) + "</pre>";
						alert(msg);
						console.log(msg);
						return -1;
				}
		}

		var program = gl.createProgram();
		gl.attachShader(program, vertShdr);
		gl.attachShader(program, fragShdr);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				var msg = "Shader program failed to link.  The error log is:" + "<pre>" + gl.getProgramInfoLog(program) + "</pre>";
				alert(msg);
				console.log(msg);
				return -1;
		}

		return program;
}

function setupMouse() {

    function handleMouseEvent(e) {
        // mouse.x = (e.clientX - rectLeft) * cssScaleX;
        // mouse.y = (e.clientY - rectTop) * cssScaleY;
        mouse.x = (e.clientX/320)-1;
        mouse.y = -(e.clientY/240)+1;
    }

    window.addEventListener('mousedown', function (e) {
        mouse.down = true;
        handleMouseEvent(e);
    });

    window.addEventListener('mouseup', function (e) {
        mouse.down = false;
        handleMouseEvent(e);
    });

    window.addEventListener('mouseout', function (e) {
        mouse.down = false;
        handleMouseEvent(e);
    });

    window.addEventListener('mousemove',  handleMouseEvent );
};