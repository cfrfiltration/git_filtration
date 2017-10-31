/**
 * The Point Object
 *
 * This object represents a point
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 */

JavaScript3d.Point = Class.create();

JavaScript3d.Point.prototype = {
	initialize: function(x, y, z) {
		this.x = x; this.y = y; this.z = z;
		this.size = 3;
		this.color = "#000000";
	},
	setCoords: function(x, y, z) {
		this.x = x; this.y = y; this.z = z;
	},
	getCoords: function() {
		return [this.x, this.y, this.z];
	},
	rotate: function(rAxisPoint, anglex, angley, anglez) {
		// rAxisPoint is the point to be rotated around, and point is the point being rotated
		// move to point around (0, 0, 0) for rotation
		this.x = this.x - rAxisPoint.x;
		this.y = this.y - rAxisPoint.y;
		this.z = this.z - rAxisPoint.z;
	
		// z rotation
		var rx = Math.cos(-anglez) * this.x - Math.sin(-anglez) * this.y;
		var ry = Math.sin(-anglez) * this.x + Math.cos(-anglez) * this.y;	
		var rz = this.z;
		// y rotation
		this.x = Math.cos(-angley) * rx - Math.sin(-angley) * rz;
		this.y = ry;
		this.z = Math.sin(-angley) * rx + Math.cos(-angley) * rz;
		// x rotation
		rx = this.x;
		ry = Math.sin(-anglex) * this.z + Math.cos(-anglex) * this.y;
		rz = Math.cos(-anglex) * this.z - Math.sin(-anglex) * this.y;
		
	

		// move back to proper position
		this.x = rx + rAxisPoint.x;
		this.y = ry + rAxisPoint.y;
		this.z = rz + rAxisPoint.z;
		ErrorManager.logDebug("Rotated about: "+rAxisPoint+" by angles: "+anglex+", "+angley+", "+anglez+" Point now at: "+this);
	},
	translateTo2d: function() {
		// takes 3d point and returns 2d this.
		var p1 = new Array(2);

		p1['x'] = (this.x * JavaScript3d.EyeDistance) / (this.z + JavaScript3d.EyeDistance);
		p1['y'] = (this.y * JavaScript3d.EyeDistance) / (this.z + JavaScript3d.EyeDistance);


		return new JavaScript3d.Point(Math.round(p1['x']), Math.round(p1['y']), 0);
	},
	draw: function(painter) {
		painter.jsPainter.setStroke(this.size);
		painter.jsPainter.setColor(this.color);
		painter.drawLineSeg(this.x, this.y, this.z, this.x, this.y, this.z);
	},
	drawWire: function(painter) {
		this.draw(painter);
	},
	toString: function() {
		return "("+this.x+", "+this.y+", "+this.z+")";
	}
}

