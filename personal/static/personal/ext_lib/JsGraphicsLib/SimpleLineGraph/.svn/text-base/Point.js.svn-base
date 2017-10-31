SimpleLineGraph.Point = Class.create();
SimpleLineGraph.Point.pointCompare = function(a, b) {
	// sort by x always
	return (a.x - b.x);
},

SimpleLineGraph.Point.prototype = {
	initialize: function(x, y) {
		this.x = x; this.y = y; this.z = 0;
		this.size = 3;
		this.color = "#000000";
	},
	setCoords: function(x, y) {
		this.x = x; this.y = y;
	},
	getCoords: function() {
		return [this.x, this.y];
	},
	rotate: function(anglex) {
		ErrorManager.logDebug("Rotating point: " + this);
		angley = 0;
		anglez = 0;
	
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
		this.x = rx;
		this.y = ry;
		this.z = rz;
		ErrorManager.logDebug("Rotated about the orgin by "+anglex+" degrees, Point now at: "+this);
	},
	draw: function(painter, offX, offY, scalex, scaley) {
		painter.jsPainter.setStroke(this.size);
		painter.jsPainter.setColor(this.color);
		painter.drawLineSeg(this.x + offX, this.y + offY, this.x + offX, this.y + offY);
	},
	toString: function() {
		return "[SimpleLineGraph.Point] ("+this.x+", "+this.y+")";
	}
}