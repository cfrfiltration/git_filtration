/**
 * The Painter
 *
 * Works on top of the wz_jsGraphics.js script to draw objects
 * to the screen
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 */

SimpleLineGraph.Painter = Class.create();

SimpleLineGraph.Painter.prototype = {
	initialize: function(canvasId, sizeX, sizeY) {
		this.canvasId = canvasId;
		this.jsPainter = new jsGraphics(canvasId);
		this.jsPainter.setStroke(1);
		this.jsPainter.setColor("#000000");
		this.maxPixelsX = sizeX;
		this.maxPixelsY = sizeY;
	},
	drawObj: function(obj, offX, offY, scale) {
		obj.draw(this, offX, offY, scale);
	},
	drawLineSeg: function(x0, y0, x1, y1) {
		ErrorManager.logDebug("Drawing line: ("+x0+", "+y0+") to ("+x1+", "+y1+")");
		this.jsPainter.drawLine(x0, y0, x1, y1);
	},
	drawEllipse: function(x, y, w, h) {
		this.jsPainter.drawEllipse(x, y, w, h);
	},
	fillEllipse: function(x, y, w, h) {
		this.jsPainter.fillEllipse(x, y, w, h);
	},
	paint: function() {
		this.jsPainter.paint();
	},
	clear: function() {
		this.jsPainter.clear();
	},
	toString: function() {
		return "[SimpleLineGraph.Painter Object]";
	}
}
