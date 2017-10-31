/**
 * The Painter
 *
 * Works on top of the wz_jsGraphics.js script to draw 3D objects
 * to the screen
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 */

JavaScript3d.Painter = Class.create();

JavaScript3d.Painter.prototype = {
	initialize: function(canvasId) {
		this.jsPainter = new jsGraphics(canvasId);
		this.jsPainter.setStroke(5);
		this.jsPainter.setColor("#CC0000");
		// basic information
		this.linesDrawn = 0;
		this.linesNow = 0;
		this.paintCount = 0;
		this.clearCount = 0;
	},
	drawWireObjs: function(objArray) {
		for(var i = objArray.length-1; i >= 0; i--) {
			objArray[i].drawWire(this);
		}
	},
	drawLineSeg: function(x0, y0, z0, x1, y1, z1) {
		p1 = new JavaScript3d.Point(x0, y0, z0).translateTo2d();
		p2 = new JavaScript3d.Point(x1, y1, z1).translateTo2d();

		this.jsPainter.drawLine(p1.x, p1.y, p2.x, p2.y);
		this.linesDrawn++;
		this.linesNow++;
	},
	drawEllipse: function(x, y, w, h) {
		this.jsPainter.drawEllipse(x, y, w, h);
		this.linesDrawn++;
		this.linesNow++;
	},
	fillEllipse: function(x, y, w, h) {
		this.jsPainter.fillEllipse(x, y, w, h);
		this.linesDrawn++;
		this.linesNow++;
	},
	paint: function() {
		this.jsPainter.paint();
		this.paintCount++;
	},
	clear: function() {
		this.jsPainter.clear();
		this.linesNow = 0;
		this.clearCount++;
	},
	toString: function() {
		return "[JavaScript3d.Painter Object]\n Total Lines Drawn: "+this.linesDrawn
			+"\n Lines Currently Painted: "+this.linesNow+"\n Screen Painted: "
			+this.paintCount+" times \n Canvas Cleared: "+this.clearCount;
	}
}
