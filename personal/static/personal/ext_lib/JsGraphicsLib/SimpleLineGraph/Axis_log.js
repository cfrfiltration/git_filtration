SimpleLineGraph.Axis = Class.create();
//This seems to only be being called by the index.html, not the other pages.
SimpleLineGraph.Axis.prototype = {
	initialize: function(orginx, orginy, maxx, maxy) {
		this.orginx = parseFloat(orginx);
		this.orginy = parseFloat(orginy);
		this.maxx = parseFloat(maxx);
		this.maxy = parseFloat(maxy);
		this.markerCount = parseFloat(10);
		this.xLabel = "";
		this.yLabel = "";
		this.yLabel2 = "";
		this.size = 3;
		this.color = "#000000";
	},
	draw: function(painter, offX, offY, scalex, scaley, precisionFactor) {
		ErrorManager.logDebug("Drawing Axis: "+this);
		painter.jsPainter.setStroke(this.size);
		painter.jsPainter.setColor(this.color);
		// orgin
		x00 = 0 + offX;
		y00 = 0 + offY;
		
		scalex_log=120;
		x01 = (this.markerCount-6)*scalex_log + offX;
		y01 = (this.maxy - this.orginy)*scaley*-1 + offY;

		painter.jsPainter.drawLine(x00, y00, x00, y01);
		painter.jsPainter.drawLine(x00, y00, x01, y00);
		
		markerValueStepX = (this.maxx - this.orginx) / this.markerCount;
		markerValueStepY = (this.maxy - this.orginy) / this.markerCount;
		
		// Draw X Hashes
		for(i = 0; i < this.markerCount-5; i++) {
			painter.drawLineSeg(i*scalex_log + offX, y00+5, i*scalex_log + offX, y00-5);
			val = Math.pow(10,i-3);
			val = Math.round(val*1000000000000)/1000000000000; //some browsers show trailing zeros...
			painter.jsPainter.drawString(val, i*scalex_log + offX, y00 + 15);
		} 
		// Draw Y Hashes			
// 		for(i = 0; i < (this.maxy - this.orginy); i+=markerValueStepY) {
// 			painter.drawLineSeg(x00 - 5, i*scaley*-1 +offY, x00 + 5, i*scaley*-1 +offY);
// 			val = Math.round((i + this.orginy)*precisionFactor)/precisionFactor;
// 			painter.jsPainter.drawString(val, x00-(new String(val).length * 8)-5, i*scaley*-1 + offY);
// 		}
		for(i = 0; i < (this.maxy - this.orginy); i+=markerValueStepY) {
			painter.drawLineSeg(x00 - 5, i*scaley*-1 +offY, x00 + 5, i*scaley*-1 +offY);
			val = Math.pow(10,i-3);
			val = Math.round((i + this.orginy)*precisionFactor)/precisionFactor;
			painter.jsPainter.drawString(val, x00-(new String(val).length * 8)-5, i*scaley*-1 + offY);
		}
		
		// Draw X and Y Title
		painter.jsPainter.drawString(this.xLabel, x01 / 2, y00 + 40);
		painter.jsPainter.drawString(this.yLabel, x00 - (this.yLabel.length + new String(precisionFactor).length) * 5-50, (this.maxy - this.orginy)*scaley/2 * -1 + offY);
		painter.jsPainter.drawString(this.yLabel2, x00 - (this.yLabel2.length + new String(precisionFactor).length) * 5-50, (this.maxy - this.orginy)*scaley/2 * -1 + offY + 15);
	},
	toString: function() {
		return "[SimpleLineGraph.Axis] Orgin("+this.orginx+", "+this.orginy+"), max("+this.maxx+", "+this.maxy+")";
	}
}
