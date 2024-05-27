// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
  uniform sampler2D u_Sampler7;
  uniform sampler2D u_Sampler8;
  uniform sampler2D u_Sampler9;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform vec3 u_lightColor;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  void main() {

    if (u_whichTexture == -12) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);     //use normal
    }

    else if (u_whichTexture == -11) {
      gl_FragColor = texture2D(u_Sampler9, v_UV);     //use texture9
    }

    else if (u_whichTexture == -10) {
      gl_FragColor = texture2D(u_Sampler8, v_UV);     //use texture8
    }

    else if (u_whichTexture == -9) {
      gl_FragColor = texture2D(u_Sampler7, v_UV);     //use texture7
    }

    else if (u_whichTexture == -8) {
      gl_FragColor = texture2D(u_Sampler6, v_UV);     //use texture6
    }

    else if (u_whichTexture == -7) {
      gl_FragColor = texture2D(u_Sampler5, v_UV);     //use texture5
    }

    else if (u_whichTexture == -6) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);     //use texture4 
    }

    else if (u_whichTexture == -5) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);     //use texture3 
    }

    else if (u_whichTexture == -4) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);     //use texture2 
    }

    else if (u_whichTexture == -3) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);     //use texture1 
    }

    else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;                     //use color 
    }
    
    else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);              //use UV debug color
    }

    else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);     //use texture0
    }
    
    else {
      gl_FragColor = vec4(1,.2,.2,1);                 //error, put Redish
    }

    vec3 lightVector = u_lightPos-vec3(v_VertPos);
    float r = length(lightVector);

    //if (r<1.0) {
    //  gl_FragColor = vec4(1,0,0,1);
    //} else if (r<2.0) {
    //  gl_FragColor = vec4(0,1,0,1);
    //}

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    //reflection
    vec3 R = reflect(-L, N);

    //eye
    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    //specular
    float specular = pow(max(dot(E,R), 0.0),10.0);

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7 * u_lightColor; //modified to add color
    vec3 ambient = vec3(gl_FragColor) * 0.3 * u_lightColor; //modified to add color

    if (u_lightOn) {
      gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
    }

  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;
let u_Sampler7;
let u_Sampler8;
let u_Sampler9;
let u_whichTexture;
let u_lightPos;
let u_lightOn;
let u_cameraPos;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true })
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of the u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  // Get the storage location of the u_Sampler
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  // Get the storage location of the u_Sampler
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }

  // Get the storage location of the u_Sampler
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return;
  }

  // Get the storage location of the u_Sampler
  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return;
  }

  // Get the storage location of the u_Sampler
  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to get the storage location of u_Sampler5');
    return;
  }

  // Get the storage location of the u_Sampler
  u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
  if (!u_Sampler6) {
    console.log('Failed to get the storage location of u_Sampler6');
    return;
  }

  // Get the storage location of the u_Sampler
  u_Sampler7 = gl.getUniformLocation(gl.program, 'u_Sampler7');
  if (!u_Sampler7) {
    console.log('Failed to get the storage location of u_Sampler7');
    return;
  }

  // Get the storage location of the u_Sampler
  u_Sampler8 = gl.getUniformLocation(gl.program, 'u_Sampler8');
  if (!u_Sampler8) {
    console.log('Failed to get the storage location of u_Sampler8');
    return;
  }

  // Get the storage location of the u_Sampler
  u_Sampler9 = gl.getUniformLocation(gl.program, 'u_Sampler9');
  if (!u_Sampler9) {
    console.log('Failed to get the storage location of u_Sampler9');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  //set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_globalAngle=0;
let g_FHAngle=0;
let g_NAngle=0;
let g_headanim=false;
let g_normalOn=false;
let g_lightPos=[0,6,-4];
let g_lightOn=true;
let g_lightColor = [1.0, 1.0, 1.0]; //light is white by default

//Set up actions for the HTML UI elements
function addActionsForHtmlUI() {

  //Button Events (Shape Type)
  document.getElementById('normalOn').onclick = function() { g_normalOn = true; };
  document.getElementById('normalOff').onclick = function() { g_normalOn = false; };

  document.getElementById('lightOn').onclick = function() { g_lightOn = true; };
  document.getElementById('lightOff').onclick = function() { g_lightOn = false; };
  //document.getElementById('green').onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; };
  //document.getElementById('red').onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; };
  //document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };

  //document.getElementById('pointButton').onclick = function() { g_selectedType=POINT };
  //document.getElementById('triButton').onclick = function() { g_selectedType=TRIANGLE };
  //document.getElementById('circleButton').onclick = function() { g_selectedType=CIRCLE };

  document.getElementById('headanimoff').onclick = function() { g_headanim = false; };
  document.getElementById('headanimon').onclick = function() { g_headanim = true; };

  // Color Slider Events
  //document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  //document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('FHSlide').addEventListener('mousemove', function() { g_FHAngle = this.value; renderAllShapes(); });
  document.getElementById('NSlide').addEventListener('mousemove', function() { g_NAngle = this.value; renderAllShapes(); });

  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) { g_lightPos[0] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) { g_lightPos[1] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) { g_lightPos[2] = this.value/100; renderAllShapes();}});

  document.getElementById('lightSlideR').addEventListener('input', function() {
    g_lightColor[0] = parseFloat(this.value);
    renderAllShapes();
  });

  document.getElementById('lightSlideG').addEventListener('input', function() {
    g_lightColor[1] = parseFloat(this.value);
    renderAllShapes();
  });

  document.getElementById('lightSlideB').addEventListener('input', function() {
    g_lightColor[2] = parseFloat(this.value);
    renderAllShapes();
  });

  // Size Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });

  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev)}};

}


function initTextures() {    

  var image = new Image(); // Create an image object 
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  var imagee = new Image(); // Create an image object 
  if (!imagee) {
    console.log('Failed to create the imagee object');
    return false;
  }

  var aone = new Image(); // Create an image object 
  if (!aone) {
    console.log('Failed to create the aone object');
    return false;
  }

  var atwo = new Image(); // Create an image object 
  if (!atwo) {
    console.log('Failed to create the atwo object');
    return false;
  }

  var athree = new Image(); // Create an image object 
  if (!athree) {
    console.log('Failed to create the athree object');
    return false;
  }

  var afour = new Image(); // Create an image object 
  if (!afour) {
    console.log('Failed to create the afour object');
    return false;
  }

  var afive = new Image(); // Create an image object 
  if (!afive) {
    console.log('Failed to create the afive object');
    return false;
  }

  var asix = new Image(); // Create an image object 
  if (!asix) {
    console.log('Failed to create the asix object');
    return false;
  }

  var aseven = new Image(); // Create an image object 
  if (!aseven) {
    console.log('Failed to create the aseven object');
    return false;
  }

  var aeight = new Image(); // Create an image object 
  if (!aeight) {
    console.log('Failed to create the aeight object');
    return false;
  }

  // Register the event handler to be called on loading an image
  image.onload = function(){ sendImagetoTEXTURE0(image); };
  //image.onload = function(){ loadTexture(0, u_Sampler0, image); };

  // Register the event handler to be called on loading an image
  imagee.onload = function(){ sendImagetoTEXTURE1(imagee); };

  // Register the event handler to be called on loading an image
  aone.onload = function(){ sendImagetoTEXTURE2(aone); };

  // Register the event handler to be called on loading an image
  atwo.onload = function(){ sendImagetoTEXTURE3(atwo); };

  // Register the event handler to be called on loading an image
  athree.onload = function(){ sendImagetoTEXTURE4(athree); };

  // Register the event handler to be called on loading an image
  afour.onload = function(){ sendImagetoTEXTURE5(afour); };

  // Register the event handler to be called on loading an image
  afive.onload = function(){ sendImagetoTEXTURE6(afive); };

  // Register the event handler to be called on loading an image
  asix.onload = function(){ sendImagetoTEXTURE7(asix); };

  // Register the event handler to be called on loading an image
  aseven.onload = function(){ sendImagetoTEXTURE8(aseven); };

  // Register the event handler to be called on loading an image
  aeight.onload = function(){ sendImagetoTEXTURE9(aeight); };

  // Tell the browser to load an image
  image.src = 'wall.jpg';
  imagee.src = 'carpet.jpg'; //insert new image
  aone.src = 'sonder.jpg';
  atwo.src = 'mac.jpg';
  athree.src = 'tyler.jpg';
  afour.src = 'kali.jpg';
  afive.src = 'impala.jpg';
  asix.src = 'beachhouse.jpg';
  aseven.src = 'kendrick.jpg';
  aeight.src = 'lana.jpg';
  console.log('images loaded');

  return true;

}


function sendImagetoTEXTURE0(image) {   

  console.log('in t0');
  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture0 object');
    return false;
  } 

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

   // Enable the texture unit 0
   gl.activeTexture(gl.TEXTURE0);

   // Bind the texture object to the target
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
   gl.uniform1i(u_Sampler0, 0);
  
   console.log('finished loadTexture0');
   //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
}

function sendImagetoTEXTURE1(image) {   

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture1 object');
    return false;
  } 

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

   // Enable the texture unit 1
   gl.activeTexture(gl.TEXTURE1);

   // Bind the texture object to the target
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
   gl.uniform1i(u_Sampler1, 1);
  
   console.log('finished loadTexture1');
   //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
}

function sendImagetoTEXTURE2(image) {   

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture2 object');
    return false;
  } 

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

   // Enable the texture unit 1
   gl.activeTexture(gl.TEXTURE2);

   // Bind the texture object to the target
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
   gl.uniform1i(u_Sampler2, 2);
  
   console.log('finished loadTexture2');
   //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
}

function sendImagetoTEXTURE3(image) {   

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture3 object');
    return false;
  } 

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

   // Enable the texture unit 1
   gl.activeTexture(gl.TEXTURE3);

   // Bind the texture object to the target
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
   gl.uniform1i(u_Sampler3, 3);
  
   console.log('finished loadTexture3');
   //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
}

function sendImagetoTEXTURE4(image) {   

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture4 object');
    return false;
  } 

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

   // Enable the texture unit 1
   gl.activeTexture(gl.TEXTURE4);

   // Bind the texture object to the target
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
   gl.uniform1i(u_Sampler4, 4);
  
   console.log('finished loadTexture4');
   //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
}

function sendImagetoTEXTURE5(image) {   

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture5 object');
    return false;
  } 

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

   // Enable the texture unit 1
   gl.activeTexture(gl.TEXTURE5);

   // Bind the texture object to the target
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
   gl.uniform1i(u_Sampler5, 5);
  
   console.log('finished loadTexture5');
   //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
}

function sendImagetoTEXTURE6(image) {   

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture6 object');
    return false;
  } 

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

   // Enable the texture unit 1
   gl.activeTexture(gl.TEXTURE6);

   // Bind the texture object to the target
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
   gl.uniform1i(u_Sampler6, 6);
  
   console.log('finished loadTexture6');
   //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
}

function sendImagetoTEXTURE7(image) {   

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture7 object');
    return false;
  } 

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

   // Enable the texture unit 1
   gl.activeTexture(gl.TEXTURE7);

   // Bind the texture object to the target
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
   gl.uniform1i(u_Sampler7, 7);
  
   console.log('finished loadTexture7');
   //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
}

function sendImagetoTEXTURE8(image) {   

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture8 object');
    return false;
  } 

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

   // Enable the texture unit 1
   gl.activeTexture(gl.TEXTURE8);

   // Bind the texture object to the target
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
   gl.uniform1i(u_Sampler8, 8);
  
   console.log('finished loadTexture8');
   //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
}

function sendImagetoTEXTURE9(image) {   

  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture9 object');
    return false;
  } 

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

   // Enable the texture unit 1
   gl.activeTexture(gl.TEXTURE9);

   // Bind the texture object to the target
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
   gl.uniform1i(u_Sampler9, 9);
  
   console.log('finished loadTexture9');
   //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
}

function main() {
  
  //Set up canvas and gl variables
  setupWebGL();

  //Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  //Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  document.onkeydown = keydown;

  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };
  //canvas.onmousemove = click;
  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  //renderAllShapes();
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000;
var g_seconds = performance.now()/1000 - g_startTime;

function tick() {

  g_seconds = performance.now()/1000 - g_startTime;
  //console.log(g_seconds);

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  g_lightPos[0] = 8*cos(g_seconds*0.5);
}


var g_shapesList = [];

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];

function click(ev) {

  // Extract the event click and return it in WebGL coordinates
  let [x, y] = convertCoordinatesEventToGL(ev);

  //Create and store the new point
  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  //g_points.push([x, y]);

  //Store the color to g_colors array
  //g_colors.push(g_selectedColor.slice());

  //Store the size to g_colors array
  //g_sizes.push(g_selectedSize);

  // Store the coordinates to g_points array
  /*
  if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }
  */

  //Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}


// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {

  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y]);
}

function keydown(ev) {
  if (ev.keyCode == 68) {     //right arrow (should be D)
    g_eye[0] += 0.2;
  } else 
  if (ev.keyCode == 65) {     //left arrow (should be A)
    g_eye[0] -= 0.2;
  } else 
  if (ev.keyCode == 87) {     //W
    g_eye[2] -= 0.2;
  } else 
  if (ev.keyCode == 83) {     //S
    g_eye[2] += 0.2;
  } else 
  if (ev.keyCode == 69) {     //E (rotate right)
    g_at[0] += 2;
  } else 
  if (ev.keyCode == 81) {     //Q (rotate left)
    g_at[0] -= 2;
  }

  renderAllShapes();
  //console.log(ev.keyCode);
}

var g_eye=[0,3,8];
var g_at=[0,0,-100];
var g_up=[0,0.1,0];

//Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

  // Check the time at the start of this function
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]); // (eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  gl.uniform3f(u_cameraPos, g_eye[0], g_eye[1], g_eye[2]);

  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  gl.uniform1i(u_lightOn, g_lightOn);

  var light = new Cube();
  light.color = [2,2,0,1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.matrix.translate(-.5,-.5,-.5);
  light.render();

  /*
  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {

    g_shapesList[i].render();

  }
  */

  //draw a test triangle
  //drawTriangle3D( [-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0] );

  //draw the floor
  //change to different texture eventually
  var ground = new Cube();
  ground.color = [1,0,0,1];
  ground.textureNum = -3;
  ground.matrix.translate(0,-0.75,0);
  ground.matrix.scale(20,0,20);
  ground.matrix.translate(-0.5,0,-0.5);
  ground.render();

  //draw the sky
  var sky = new Cube();
  sky.color = [0.8,0.8,0.8,1];
  if (g_normalOn) sky.textureNum = -12;
  //sky.textureNum = 0;
  //sky.matrix.translate(0,-0.75,0);
  sky.matrix.scale(-20,-20,-20);
  sky.matrix.translate(-0.5,-0.5,-0.5);
  sky.render();

  var sonder = new Cube();
  sonder.color = [1,0,0,1];
  sonder.textureNum = -4;
  sonder.matrix.translate(6,1,-3);
  sonder.matrix.scale(2,2,2);
  sonder.render();

  var mac = new Cube();
  mac.color = [1,0,0,1];
  mac.textureNum = -5;
  mac.matrix.translate(-3,2,-6);
  mac.matrix.scale(1.5,1.5,1.5);
  mac.render();

  var tyler = new Cube();
  tyler.color = [1,0,0,1];
  tyler.textureNum = -6;
  tyler.matrix.translate(4,1,-9);
  tyler.matrix.scale(2.5,2.5,2.5);
  tyler.render();

  var kali = new Cube();
  kali.color = [1,0,0,1];
  kali.textureNum = -7;
  kali.matrix.translate(-6,1,0);
  kali.matrix.scale(2.5,2.5,2.5);
  kali.render();

  var impala = new Cube();
  impala.color = [1,0,0,1];
  impala.textureNum = -8;
  impala.matrix.translate(-9,2,-3);
  impala.matrix.scale(2,2,2);
  impala.render();

  var beach = new Cube();
  beach.color = [1,0,0,1];
  beach.textureNum = -9;
  beach.matrix.translate(1,1.3,10);
  beach.matrix.scale(3,3,3);
  beach.render();

  var kendrick = new Cube();
  kendrick.color = [1,0,0,1];
  kendrick.textureNum = -10;
  kendrick.matrix.translate(7,1.5,5);
  kendrick.matrix.scale(3,3,3);
  kendrick.render();

  var lana = new Cube();
  lana.color = [1,0,0,1];
  lana.textureNum = -11;
  lana.matrix.translate(-5,1,9);
  lana.matrix.scale(2,2,2);
  lana.render();



  var re = new Cube();
  re.color = [0,0,0,1.0];
  //re.textureNum = -2;
  if (g_normalOn) re.textureNum = -12;
  re.matrix.translate(-0.1, -0.1, 0.7);
  re.matrix.rotate(0, 4, 4, -1);
  re.matrix.scale(0.3, 0.3, 0.3);
  re.render();

  var le = new Cube();
  le.color = [0,0,0,1.0];
  //le.textureNum = -2;
  if (g_normalOn) le.textureNum = -12;
  le.matrix.translate(-0.1, -0.1, -0.4);
  le.matrix.rotate(0, 4, 4, -1);
  le.matrix.scale(0.3, 0.3, 0.3);
  le.render();

  var rs = new Cube();
  rs.color = [0,0,0,1.0];
  //rs.textureNum = -2;
  if (g_normalOn) rs.textureNum = -12;
  rs.matrix.translate(0, 0.2, 0.8);
  rs.matrix.rotate(0, 4, 4, -1);
  rs.matrix.scale(0.1, 0.3, 0.1);
  rs.render();

  var ls = new Cube();
  ls.color = [0,0,0,1.0];
  //ls.textureNum = -2;
  if (g_normalOn) ls.textureNum = -12;
  ls.matrix.translate(0, 0.2, -0.3);
  ls.matrix.rotate(0, 4, 4, -1);
  ls.matrix.scale(0.1, 0.3, 0.1);
  ls.render();

  var top = new Cube();
  top.color = [0,0,0,1.0];
  //top.textureNum = -2;
  if (g_normalOn) top.textureNum = -12;
  top.matrix.translate(0, 0.4, -0.3);
  top.matrix.rotate(0, 4, 4, -1);
  top.matrix.scale(0.1, 0.1, 1.2);
  top.render();

  //draw the body cube
  var body = new Cube();
  body.color = [0.45,0.84,1,1.0];
  //body.textureNum = -2;
  if (g_normalOn) body.textureNum = -12;
  body.matrix.translate(0, -0.3, 0.05);
  body.matrix.rotate(0, 4, 4, -1);
  body.matrix.scale(0.7, 0.5, 0.5);
  body.render();

  var backh = new Cube();
  backh.color = [0.22,0.78,1,1.0];
  //backh.textureNum = -2;
  if (g_normalOn) backh.textureNum = -12;
  backh.matrix.translate(-0.2, -0.4, -0.1);
  backh.matrix.rotate(0, 4, 4, -1);
  backh.matrix.scale(0.5, 0.7, 0.8);
  backh.render();


  //first rotate
  var fronth = new Cube();
  fronth.color = [0.65,0.9,1,1.0];
  //fronth.textureNum = -2;
  if (g_normalOn) fronth.textureNum = -12;
  fronth.matrix.translate(-0.4, -0.35, 0.05);
  fronth.matrix.rotate(0, 4, 4, -1);
  
  if (g_headanim) {
    fronth.matrix.rotate(20*Math.sin(g_seconds), 4, 4, -1);
  } else {
    fronth.matrix.rotate(g_FHAngle, 4, 4, -1);
  }
  
  var fhm = new Matrix4(fronth.matrix);
  fronth.matrix.scale(0.3, 0.5, 0.5);
  fronth.render();


  var nose = new Cube();
  nose.color = [0,0.45,0.63,1.0];
  //nose.textureNum = -2;
  if (g_normalOn) nose.textureNum = -12;
  nose.matrix = fhm;
  nose.matrix.translate(-0.3, 0, 0.13);
  nose.matrix.rotate(g_NAngle, 7, 4, -1.5);
  //nose.matrix.rotate(0, 7, 4, -1.5);
  nose.matrix.scale(0.4, 0.25, 0.25);
  nose.render();


  var tail = new Cube();
  tail.color = [0,0.67,0.94,1.0];
  //tail.textureNum = -2;
  if (g_normalOn) tail.textureNum = -12;
  tail.matrix.translate(0.6, 0, 0.22);
  tail.matrix.rotate(0, 4, 5, 2.5);

  if (g_headanim) {
    tail.matrix.rotate(40*Math.sin(g_seconds), 4, 5, 2.5);
  }

  tail.matrix.scale(0.7, 0.15, 0.15);
  tail.render();


  var fl = new Cube();
  fl.color = [0,0.67,0.94,1.0];
  //fl.textureNum = -2;
  if (g_normalOn) fl.textureNum = -12;
  fl.matrix.translate(0, -0.6, 0.1);
  fl.matrix.rotate(0, 4, 4, -1);

  if (g_headanim) {
    fl.matrix.rotate(20*Math.sin(g_seconds), 4, 4, -1);
  }

  fl.matrix.scale(0.15, 0.4, 0.15);
  fl.render();

  var fr = new Cube();
  fr.color = [0,0.67,0.94,1.0];
  //fr.textureNum = -2;
  if (g_normalOn) fr.textureNum = -12;
  fr.matrix.translate(0, -0.6, 0.4);
  fr.matrix.rotate(0, 4, 4, -1);

  if (g_headanim) {
    fr.matrix.rotate(20*Math.sin(g_seconds), 4, 4, -1);
  }

  fr.matrix.scale(0.15, 0.4, 0.15);
  fr.render();

  var bl = new Cube();
  bl.color = [0,0.67,0.94,1.0];
  //bl.textureNum = -2;
  if (g_normalOn) bl.textureNum = -12;
  bl.matrix.translate(0.4, -0.6, 0.1);
  bl.matrix.rotate(0, 4, 4, -1);

  if (g_headanim) {
    bl.matrix.rotate(20*Math.sin(g_seconds), 4, 4, -1);
  }

  bl.matrix.scale(0.15, 0.4, 0.15);
  bl.render();

  var br = new Cube();
  br.color = [0,0.67,0.94,1.0];
  //br.textureNum = -2;
  if (g_normalOn) br.textureNum = -12;
  br.matrix.translate(0.4, -0.6, 0.38);
  br.matrix.rotate(0, 4, 4, -1);

  if (g_headanim) {
    br.matrix.rotate(20*Math.sin(g_seconds), 4, 4, -1);
  }

  br.matrix.scale(0.15, 0.4, 0.15);
  br.render();

  var s1 = new Sphere();
  if (g_normalOn) s1.textureNum = -12;
  s1.matrix.translate(-2, 0, -2);
  s1.render();



  /*
  var leftArm = new Cube();
  leftArm.color = [1.0,1.0,0.0,1.0];
  leftArm.matrix.setTranslate(0.7, 0.0, 0.0);
  leftArm.matrix.rotate(45, 0, 0, 1);
  leftArm.matrix.scale(0.25, 0.7, 0.5);
  leftArm.render();
  

  var box = new Cube();
  box.color = [1.0,0.0,1.0,1.0];
  box.matrix.translate(0.0, 0.0, -0.5, 0.0);
  box.matrix.rotate(-30, 1, 1, 0);
  box.matrix.scale(0.5, 0.5, 0.5);
  box.render();
  */
  


  //Check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML( " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

//Set the text of an HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}








