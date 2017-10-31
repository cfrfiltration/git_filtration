SimpleLineGraph.Axis = Class.create();

SimpleLineGraph.Axis.prototype = {
	initialize: function(orginx, orginy, maxx, maxy) {
		this.orginx = parseFloat(orginx);
		this.orginy = parseFloat(orginy);
		this.maxx = parseFloat(maxx);
		this.maxy = parseFloat(maxy);
		this.markerCount = parseFloat(11);
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
		
		x01 = (this.maxx - this.orginx)*scalex + offX;
		y01 = (this.maxy - this.orginy)*scaley*-1 + offY

		painter.jsPainter.drawLine(x00, y00, x00, y01);
		painter.jsPainter.drawLine(x00, y00, x01, y00);
		
		markerValueStepX = (this.maxx - this.orginx) / this.markerCount;
		markerValueStepY = (this.maxy - this.orginy) / this.markerCount;
		
		// Draw X Hashes
		for(i = 0; i < (this.maxx - this.orginx); i+=markerValueStepX) {
			painter.drawLineSeg(i*scalex + offX, y00+5, i*scalex + offX, y00-5);
			val = i + this.orginx;
			painter.jsPainter.drawString(Math.round(val*precisionFactor)/precisionFactor, i*scalex + offX, y00 + 14);
		}
			
		// Draw Y Hashes			
		for(i = 0; i < (this.maxy - this.orginy); i+=markerValueStepY) {
			painter.drawLineSeg(x00 - 5, i*scaley*-1 +offY, x00 + 5, i*scaley*-1 +offY);
			val = Math.round((i + this.orginy)*precisionFactor)/precisionFactor;
			painter.jsPainter.drawString(val, x00-(new String(val).length * 7)-9, i*scaley*-1 + offY);
		}
		
		// Draw X and Y Title
		painter.jsPainter.drawString(this.xLabel, x01 / 2, y00 + 40);
		painter.jsPainter.drawString(this.yLabel, x00 - (this.yLabel.length + new String(precisionFactor).length) * 8 - 25, (this.maxy - this.orginy)*scaley/2 * -1 + offY);
		painter.jsPainter.drawString(this.yLabel2, x00 - (this.yLabel2.length + new String(precisionFactor).length) * 8 - 25, (this.maxy - this.orginy)*scaley/2 * -1 + offY + 15);
	},
	toString: function() {
		return "[SimpleLineGraph.Axis] Orgin("+this.orginx+", "+this.orginy+"), max("+this.maxx+", "+this.maxy+")";
	}
}