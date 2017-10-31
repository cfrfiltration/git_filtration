/**
 * The Cube Object
 *
 * This object represents a 3d cube
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 */
JavaScript3d.Cube = Class.create();

JavaScript3d.Cube.prototype = {
	initialize: function(scale, x, y, z, ax, ay, az) {
		this.center = new JavaScript3d.Point(x, y, z);
		this.scale = scale;
		this.aor = new JavaScript3d.Point(0, 0, 0);
		this.rotate(ax, ay, az);
		this.wireStroke = 3;
		this.wireColor = "#CC0000";
	},
	toString: function() {
		return "[Cube Object]\nCenter: "+this.center+"\nScale: "+this.scale+"\nRotation x: "+aor.x+"\nRotation y: "+aor.y+"\nRotation z: "+aor.z;
	},
	move: function(x, y, z) { this.center = new JavaScript3d.Point(x, y, z); },
	rotate: function(ax, ay, az) {
		// keep angles under 360 degrees
		this.aor.x = (this.aor.x > 2 * Math.PI) ? this.aor.x + ax-(2 * Math.PI) : this.aor.x + ax;
		this.aor.y = (this.aor.y > 2 * Math.PI) ? this.aor.y + ay-(2 * Math.PI) : this.aor.y + ay;
		this.aor.z = (this.aor.z > 2 * Math.PI) ? this.aor.z + az-(2 * Math.PI) : this.aor.z + az;
	},
	draw: function() {
		alert("Not implemented, use drawWire()");
	},
	drawWire: function(painter) {
		// loop through each point and draw connections
		var points = this.__getPoints();
		painter.jsPainter.setColor(this.wireColor);
		painter.jsPainter.setStroke(this.wireStroke);

		// Front face
		painter.drawLineSeg(points[0].x, points[0].y, points[0].z, points[1].x, points[1].y, points[1].z);
		painter.drawLineSeg(points[1].x, points[1].y, points[1].z, points[2].x, points[2].y, points[2].z);
		painter.drawLineSeg(points[2].x, points[2].y, points[2].z, points[3].x, points[3].y, points[3].z);
		painter.drawLineSeg(points[3].x, points[3].y, points[3].z, points[0].x, points[0].y, points[0].z);
		
		// back face
		painter.drawLineSeg(points[4].x, points[4].y, points[4].z, points[5].x, points[5].y, points[5].z);
		painter.drawLineSeg(points[5].x, points[5].y, points[5].z, points[6].x, points[6].y, points[6].z);
		painter.drawLineSeg(points[6].x, points[6].y, points[6].z, points[7].x, points[7].y, points[7].z);
		painter.drawLineSeg(points[7].x, points[7].y, points[7].z, points[4].x, points[4].y, points[4].z);
		
		// connect front to back
		painter.drawLineSeg(points[0].x, points[0].y, points[0].z, points[7].x, points[7].y, points[7].z);
		painter.drawLineSeg(points[1].x, points[1].y, points[1].z, points[6].x, points[6].y, points[6].z);
		painter.drawLineSeg(points[2].x, points[2].y, points[2].z, points[5].x, points[5].y, points[5].z);
		painter.drawLineSeg(points[3].x, points[3].y, points[3].z, points[4].x, points[4].y, points[4].z);

	},
	__getPoints: function() {
		// generates the points around (0, 0, 0) for rotation
		var hs = this.scale / 2;
		var points = new Array(8);
		                                   //  Front/Back top/bottom left/right
		points[0] = new JavaScript3d.Point(-hs, hs, hs);  //f t l
		points[1] = new JavaScript3d.Point(-hs, -hs, hs);  //f b l
		points[2] = new JavaScript3d.Point(hs, -hs, hs);  //f b r
		points[3] = new JavaScript3d.Point(hs, hs, hs);  //f t r

		points[4] = new JavaScript3d.Point(hs, hs, -hs);  //b t r
		points[5] = new JavaScript3d.Point(hs, -hs, -hs);  //b b r
		points[6] = new JavaScript3d.Point(-hs, -hs, -hs);  //b b l
		points[7] = new JavaScript3d.Point(-hs, hs, -hs);  //b t l

		// do rotations
		for(var i = points.length-1; i >= 0; i--) {
			points[i].rotate(new JavaScript3d.Point(0,0,0), this.aor.x, this.aor.y, this.aor.z);
		}
		// do move
		for(var j = points.length-1; j >= 0; j--) {
			points[j].setCoords(points[j].x + this.center.x, points[j].y + this.center.y, points[j].z + this.center.z);
		}
		
		return points;
	},
	
}
