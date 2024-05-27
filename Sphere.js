function sin(x) {
  return Math.sin(x);
}

function cos(x) {
  return Math.cos(x);
}

class Sphere {
  
  //Constructor
  constructor() {
    
    this.type='sphere';
    //this.position=[0.0,0.0,0.0];
    this.color=[1.0,1.0,1.0,1.0];
    //this.size=5.0;
    //this.segments=10;
    this.matrix = new Matrix4();
    this.textureNum=-2;
  }

  //Render this shape
  render() {
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;

    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var d = Math.PI/10;
    var dd = Math.PI/10;

    for (var t=0; t<Math.PI; t+=d) {
      for (var r=0; r<(2*Math.PI); r+=d) {
        var p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];

        var p2 = [sin(t+dd)*cos(r), sin(t+dd)*sin(r), cos(t+dd)];
        var p3 = [sin(t)*cos(r+dd), sin(t)*sin(r+dd), cos(t)];
        var p4 = [sin(t+dd)*cos(r+dd), sin(t+dd)*sin(r+dd), cos(t+dd)];

        var uv1 = [t/Math.PI, r/(2*Math.PI)];
        var uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
        var uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
        var uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];

        var v = [];
        var uv = [];
        v = v.concat(p1); uv = uv.concat(uv1);
        v = v.concat(p2); uv = uv.concat(uv2);
        v = v.concat(p4); uv = uv.concat(uv4);

        gl.uniform4f(u_FragColor, 1,1,1,1);
        drawTriangle3DUVNormal(v,uv,v);

        v = []; uv = [];
        v = v.concat(p1); uv = uv.concat(uv1);
        v = v.concat(p4); uv = uv.concat(uv4);
        v = v.concat(p3); uv = uv.concat(uv3);
        gl.uniform4f(u_FragColor, 1,0,0,1);
        drawTriangle3DUVNormal(v,uv,v);
      }
    }
    /*
    //front of cube
    drawTriangle3DUVNormal(
      [0,0,0, 1,1,0, 1,0,0],
      [0,0, 1,1, 1,0],
      [0,0,-1, 0,0,-1, 0,0,-1]);
    
    drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

    //Draw

    
    var d = this.size/200;

    let angleStep=360/this.segments;
    for (var angle=0; angle<360; angle=angle+angleStep) {
      let centerPt = [xy[0], xy[1]];
      let angle1 = angle;
      let angle2 = angle+angleStep;
      let vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
      let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
      let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
      let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

      drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );

    }
    

    //front of cube
    //drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0] );
    //drawTriangle3DUV( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1] );

    //back of cube
    gl.uniform4f(u_FragColor, 0.9*rgba[0], 0.9*rgba[1], 0.9*rgba[2], 0.9*rgba[3]);
    drawTriangle3DUVNormal([0,0,1, 1,1,1, 1,0,1], [1,0, 0,1, 0,0], [0,0,1, 0,0,1, 0,0,1] );
    drawTriangle3DUVNormal([0,0,1, 0,1,1, 1,1,1], [1,0, 1,1, 0,1], [0,0,1, 0,0,1, 0,0,1] );

    //top of cube
    gl.uniform4f(u_FragColor, 0.8*rgba[0], 0.8*rgba[1], 0.8*rgba[2], 0.8*rgba[3]);
    drawTriangle3DUVNormal( [0,1,0, 1,1,0, 1,1,1], [0,1, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0] );
    drawTriangle3DUVNormal( [0,1,0, 1,1,1, 0,1,1], [0,1, 1,0, 0,0], [0,1,0, 0,1,0, 0,1,0] );

    //bottom of cube
    gl.uniform4f(u_FragColor, 0.8*rgba[0], 0.8*rgba[1], 0.8*rgba[2], 0.8*rgba[3]);
    drawTriangle3DUVNormal( [0,0,0, 1,0,0, 1,0,1], [0,0, 1,0, 1,1], [0,-1,0, 0,-1,0, 0,-1,0] );
    drawTriangle3DUVNormal( [0,0,0, 1,0,1, 0,0,1], [0,0, 1,1, 0,1], [0,-1,0, 0,-1,0, 0,-1,0] );

    //right of cube
    gl.uniform4f(u_FragColor, 0.97*rgba[0], 0.97*rgba[1], 0.97*rgba[2], 0.97*rgba[3]);
    drawTriangle3DUVNormal([1,0,0, 1,0,1, 1,1,1], [1,0, 0,0, 0,1], [1,0,0, 1,0,0, 1,0,0] );
    drawTriangle3DUVNormal([1,0,0, 1,1,1, 1,1,0], [1,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0] );
    //drawTriangle3DUV([1,0,0, 1,0,1, 1,1,1], [0,1, 1,1, 1,0] );
    //drawTriangle3DUV([1,0,0, 1,1,1, 1,1,0], [0,1, 1,0, 0,0] );

    //left of cube
    gl.uniform4f(u_FragColor, 0.65*rgba[0], 0.65*rgba[1], 0.65*rgba[2], 0.65*rgba[3]);
    drawTriangle3DUVNormal([0,0,0, 0,0,1, 0,1,1], [0,0, 1,0, 1,1], [-1,0,0, -1,0,0, -1,0,0] );
    drawTriangle3DUVNormal([0,0,0, 0,1,1, 0,1,0], [0,0, 1,1, 0,1], [-1,0,0, -1,0,0, -1,0,0] );
    //drawTriangle3DUV([0,0,0, 0,0,1, 0,1,1], [1,1, 0,1, 0,0]);
    //drawTriangle3DUV([0,0,0, 0,1,1, 0,1,0], [1,1, 0,0, 1,0]);
    */
  }

}