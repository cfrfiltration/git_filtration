/**
 * The Data Set Object
 *
 * 1 Dimentional data Set
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 */

SimpleLineGraph.DataSet = Class.create();

SimpleLineGraph.DataSet.prototype = {
	initialize: function(stitle) {
		this.title = stitle;
		this.drawLines = false;	// default to draw dots not lines like scatter plot
		this.size = 3;
		this.color = "#000000";
		this.points = new Array();
		
		this._range = new Array();
		this._range['xmax'] = null;
		this._range['ymax'] = null;
		this._range['xmin'] = null;
		this._range['ymin'] = null;
		this._range['x at ymin'] = null;
	},
	getPoints: function() {
		return this.points;
	},
	addPoint: function(xcoord, ycoord) {
		if ((ycoord < Infinity) && (xcoord < Infinity)) {
			var npoint = new SimpleLineGraph.Point(xcoord, ycoord);
			if(this._range['xmax']==null || this._range['xmax'] < xcoord) this._range['xmax'] = xcoord;
			if(this._range['ymax']==null || this._range['ymax'] < ycoord) this._range['ymax'] = ycoord;
			if(this._range['xmin']==null || this._range['xmin'] > xcoord) this._range['xmin'] = xcoord;
			if(this._range['ymin']==null || this._range['ymin'] > ycoord) {
				this._range['ymin'] = ycoord;
				this._range['x at ymin'] = xcoord;
			}
			this.points.push(npoint);
		}
	},
//GJL added 'yshift' argument and made the adjustments below due to a bug in shifting the plots
	draw: function(painter, offX, offY, scalex, scaley, yshift) {
		this.points.sort(SimpleLineGraph.Point.pointCompare);
		painter.jsPainter.setStroke(this.size);
		painter.jsPainter.setColor(this.color);
                scalex_log=120;
		if(this.drawLines) {
			for(var i = this.points.length-1; i >= 1; i--) {
				x0 = (Math.log(this.points[i].x)/Math.LN10 - (-3)) * scalex_log;
//				y0 = (this.points[i].y - this._range['ymin']) * scaley * -1;
				y0 = (this.points[i].y - yshift) * scaley * -1;
				x1 = (Math.log(this.points[i-1].x)/Math.LN10 - (-3))  * scalex_log;
//				y1 = (this.points[i-1].y - this._range['ymin']) * scaley * -1;
				y1 = (this.points[i-1].y - yshift) * scaley * -1;
				painter.drawLineSeg(x0 + offX, y0 + offY, x1 + offX, y1 + offY);
				ErrorManager.logDebug("DataSet Line drawn ("+x0+", "+y0+") to ("+x1+", "+y1+").");
			}
		} else {
			for(var i = this.points.length-1; i >= 0; i--) {
				this.points[i].size = this.size;
				this.points[i].color = this.color;
				this.points[i].draw(painter, offX, offY);
			}
		}
	}
}
