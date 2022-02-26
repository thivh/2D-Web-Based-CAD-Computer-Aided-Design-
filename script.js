function changeColor(e) {
    var canvas = document.getElementById('my_Canvas');
    var x    = e.clientX;
    var y    = e.clientY;
    var rect = e.target.getBoundingClientRect();

    x = (2*(x - rect.left) - canvas.width) / canvas.width;
    y = (canvas.height - 2*(y - rect.top)) / canvas.height;

    for(let i = 0;i < arrVert.length;i++) {
       for(let j = 0;j< arrVert[i].length;j=j+2) {
          if(getDistance(x,y,arrVert[i][j],arrVert[i][j+1]) < 0.05) {
             for(let k=0;k<arrCol[i].length;k=k+3) {
                arrCol[i][k] = hexToRgb(document.getElementById("color").value)[0];
                arrCol[i][k+1] = hexToRgb(document.getElementById("color").value)[1];
                arrCol[i][k+2] = hexToRgb(document.getElementById("color").value)[2];
             }
             
             break;
          }
       }
    }

 }

 function getDistance(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
 }


 function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
       0: parseInt(result[1], 16) / 255,
       1: parseInt(result[2], 16) / 255,
       2: parseInt(result[3], 16) / 255
    } : null;

 }

 function makeProgram() {

    var shaderProgram = gl.createProgram();
    var vertCode = document.getElementById("vertex-shader-polygon").text;
    var fragCode = document.getElementById("fragment-shader-polygon").text;

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
           var msg = "Shader program failed to link.  The error log is:" + "<pre>" + gl.getProgramInfoLog(shaderProgram) + "</pre>";
           alert(msg);
           console.log(msg);
           return -1;
      }
    return shaderProgram;
 }

 function render() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0,0,canvas.width,canvas.height);

    for (let i = 0; i < arrVert.length; i++) {
       var vertices = arrVert[i];
       var color = arrCol[i];
       var nPoint = arrVert[i].length / 2;
    
       
       gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
       gl.bindBuffer(gl.ARRAY_BUFFER, null);

       
       gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
       gl.bindBuffer(gl.ARRAY_BUFFER, null);

       gl.useProgram(shaderProgram);

       
       gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
       var coord = gl.getAttribLocation(shaderProgram, "coordinates");
       gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
       gl.enableVertexAttribArray(coord);

       gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
       var color = gl.getAttribLocation(shaderProgram, "color");
       gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
       gl.enableVertexAttribArray(color);
       
       gl.drawArrays(gl.TRIANGLE_FAN, 0, nPoint);
    }
    
    window.requestAnimationFrame(render);
 }

 function inputToPoint(shapes) {
    shapes = shapes.split(" ").join().split("(").join("").split(")").join("").split(",");
    return shapes;
 }

 function makeShape() {
    var points = document.getElementById("points").value;
    var color = document.getElementById("color").value;
    var inputPoint = inputToPoint(points);
    var colVertex = [];
    var dummy = hexToRgb(color);

    arrVert.push(inputPoint);
    for(let i=0;i<inputPoint.length;i++) {
       colVertex.push(dummy[0]);
       colVertex.push(dummy[1]);
       colVertex.push(dummy[2]);
    }
    arrCol.push(colVertex);

    
 }

 var arrVert = [];
 var arrCol = [];
 var canvas = document.getElementById('my_Canvas');
 var gl = canvas.getContext('experimental-webgl');
 var shaderProgram = makeProgram();

 window.onload = function init() {
     gl.clearColor(1.0, 1.0, 1.0, 1.0);
     gl.enable(gl.DEPTH_TEST);
     gl.clear(gl.COLOR_BUFFER_BIT);
     gl.viewport(0,0,canvas.width,canvas.height);
     var vertex_buffer = gl.createBuffer();
     var color_buffer = gl.createBuffer();
     render();
    
    
     document.getElementById("my_Canvas").onmousedown = function (e) {
        changeColor(e);
     }
     document.getElementById("submitBtn").onclick = function () {
        makeShape();
     };

 }

