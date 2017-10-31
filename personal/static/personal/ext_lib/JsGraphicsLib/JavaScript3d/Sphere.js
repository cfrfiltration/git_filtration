/**
 * The Sphere Object
 *
 * @author Martin Dale Lyness <maritn.lyness@gmail.com>
 * @version 0.1.0
 */

JavaScript3d.Sphere = Class.create();

JavaScript3d.Sphere.prototype = {
	initialize: function(centerPoint, radius) {
		this.center = centerPoint;
		this.radius = radius;
		this.aor = new JavaScript3d.Point(0, 0, 0); // angle of rotation in radians about each axis
		this.wireScalar = new Array(3); this.wirePoint = new Array(3);
		this.wireScalar[0] = new JavaScript3d.Point(0.0, 0.0, 1.0);
		this.wireScalar[1] = new JavaScript3d.Point(1.0, 0.0, 0.0);
		this.wireScalar[2] = new JavaScript3d.Point(0.0, 1.0, 0.0);
		this.wirePoint[0] = new JavaScript3d.Point(this.center.x - this.radius, this.center.y, this.center.z);
		this.wirePoint[1] = new JavaScript3d.Point(this.center.x, this.center.y + this.radius, this.center.z);
		this.wirePoint[2] = new JavaScript3d.Point(this.center.x + this.radius, this.center.y, this.center.z);

		this.wireSize = 3;
		this.color = "#000000";
	},
	move: function(x, y, z) { this.center = new JavaScript3d.Point(x, y, z); },
	rotate: function(x, y, z) {
		this.aor.x = (this.aor.x > 2 * Math.PI) ? this.aor.x + x-(2 * Math.PI) : this.aor.x + x;
		this.aor.y = (this.aor.y > 2 * Math.PI) ? this.aor.y + y-(2 * Math.PI) : this.aor.y + y;
		this.aor.z = (this.aor.z > 2 * Math.PI) ? this.aor.z + z-(2 * Math.PI) : this.aor.z + z;
		
		// update rotation scalars
		pie2 = 2 * Math.PI
		for(var i = this.wireScalar.length-1; i >= 0; i--) {
			this.wireScalar[i].setCoords(this.wireScalar[i].x + (this.aor.x / pie2),this.wireScalar[i].y + (this.aor.y / pie2), this.wireScalar[i].z + (this.aor.z / pie2));
			this.wirePoint[i].rotate(this.center, this.aor.x, this.aor.y, this.aor.z);
			ErrorManager.logDebug("Wire Scalar: "+this.wireScalar[i]+"\n Wire Point: "+this.wirePoint[i]);
		}
	},
	draw: function(painter) {
		alert("Not yet implemented!");
	},
	drawWire: function(painter) {
		painter.jsPainter.setStroke(this.wireSize);
		painter.jsPainter.setColor(this.color);
		this.__traceOrbit(this.wirePoint[0], this.wireScalar[0], painter);
		this.__traceOrbit(this.wirePoint[1], this.wireScalar[1], painter);
		this.__traceOrbit(this.wirePoint[2], this.wireScalar[2], painter);
	},
	__traceOrbit: function(point, scalar, painter) {
		oneDegree = Math.PI/360;
		for(var i = 0; i <= 720; i++) {
			painter.drawLineSeg(point.x, point.y, point.z, point.x, point.y, point.z);
		//	ErrorManager.logDebug("Sphere drawing point: ("+point.x+", "+point.y+", "+point.z+") with scalar: ("+scalar.x+", "+scalar.y+", "+scalar.z+"), one degree: "+oneDegree);
			point.rotate(this.center, i*scalar.x*oneDegree, i*scalar.y*oneDegree, i*scalar.z*oneDegree);
		}
		return true;
	},
}