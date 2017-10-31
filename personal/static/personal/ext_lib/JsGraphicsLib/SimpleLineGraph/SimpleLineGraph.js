/**
 * The Simple Line Graph Controller
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 * @version 0.1.0
 */
SimpleLineGraph = Class.create();

SimpleLineGraph.prototype = {
	initialize: function(title) {
		this.Version = "0.1.0";
		this.width = 0;
		this.height = 0;
		this.title = title;
		this.precisionFactor = 100;
		
		this.dataSets = new Array();
		this.axis = new SimpleLineGraph.Axis(0, 0, 10, 10);
		this.legend = new SimpleLineGraph.Legend();
		this.table = new SimpleLineGraph.Table();
		
		this.f_showLegend = true;
		this.f_showAxis = true;
		this.f_showTable = true;
		
		this._setMaxX = null;
		this._setMaxY = null;
		this._setMinX = null;
		this._setMinY = null;
		
		this._scaleX = 1;
		this._scaleY = 1;
		
		this._p = null;
	},
	addDataSet: function(set, graph) {
		if(graph) this.dataSets.push(set);
		if(graph) this.legend.addSet(set);
		this.table.addSet(set);
		if (this._setMaxX == null) this._setMaxX = set._range['xmax'];
		if (this._setMaxY == null) this._setMaxY = set._range['ymax'];
		if (this._setMinX == null) this._setMinX = set._range['xmin'];
		if (this._setMinY == null) this._setMinY = set._range['ymin'];
		if(set._range['xmax'] > this._setMaxX) this._setMaxX = set._range['xmax'];
		if(set._range['ymax'] > this._setMaxY) this._setMaxY = set._range['ymax'];
		if(set._range['xmin'] < this._setMinX) this._setMinX = set._range['xmin'];
		if(set._range['ymin'] < this._setMinY) this._setMinY = set._range['ymin'];
		//alert("set ymax = " + set._range['ymax'] + "\nmax set to " + this._setMaxY);
		this.axis.maxx = this._setMaxX; this.axis.maxy = this._setMaxY;
		this.axis.orginx = this._setMinX; this.axis.orginy = this._setMinY;
		ErrorManager.logDebug("MaxX="+this._setMaxX+", MaxY="+this._setMaxY+", MinX="+this._setMinX+", MinY="+this._setMinY);
	},
	static_createDataSet: function(func, min, max, step) {
		var ds = new SimpleLineGraph.DataSet("New Data Set");
		min = parseFloat(min); max = parseFloat(max); step = parseFloat(step);
		
		if( ((max - min) / step) != Math.round(((max - min) / step)) )
			throw("Range must be a multiple of the step size!");
		
		compare = min;
		while(true) {
			f = func.replace("$x", compare);
			x = eval(f);
			if(isNaN(x)) x = 0;
			ds.addPoint(compare, x);
			
			if(compare >= parseFloat(max)) break;
			compare+=step;
		}
		return ds;
	},
	getScalingFactor: function(targetX, targetY, l_set) {
		var scalar = new Array();
//		scalar['x'] = targetX / (l_set._range['xmax'] - l_set._range['xmin']);
//		scalar['y'] = targetY / (l_set._range['ymax'] - l_set._range['ymin']);
		scalar['x'] = targetX / (this._setMaxX - this._setMinX);
		scalar['y'] = targetY / (this._setMaxY - this._setMinY);
		ErrorManager.logDebug("Scalar ("+scalar['x']+", "+scalar['y']+")");
		return scalar;
	},
	draw: function(divId, width, height, offx, offy) {
		if(this._p == null) {
			this._p = new SimpleLineGraph.Painter(divId, width, height);
		} else if (this._p.canvasId != divId) {
			throw("Cannot draw same graph to multiple canvases!");
		}
		for(var i=this.dataSets.length-1; i >= 0; i--) {
			var scalar = this.getScalingFactor(width, height, this.dataSets[i]);
			this.dataSets[i].drawLines = true;
			var maxRange = (this._setMaxY - this._setMinY);
			var dsRange = (this.dataSets[i]._range['ymax'] - this.dataSets[i]._range['ymin']);
			this.dataSets[i].draw(this._p, offx, offy, scalar['x'], scalar['y'], this._setMinY);
		}

		if(this.f_showAxis) {
			this.axis.draw(this._p, offx, offy, scalar['x'], scalar['y'], this.precisionFactor);
		}
		if(this.f_showLegend) this.legend.draw(this._p, offx + width, offy-(height/2), 1, 1);
		this._p.paint();
		if(this.f_showTable) this.table.draw(this._p.canvasId, offx-70, offy);
		
		// figure out div hieght and add padding to give illusion of fitting to canvas
		pixels = height + 30 + 150;
		count  = pixels /  20;
		br_str = "";
		for(var i=count; i>0; i--) br_str += "<br />";
		
		$(this._p.canvasId).innerHTML += br_str;
	},
	clear: function(soft) {
		if(this._p==null)
			throw("Cannot clear a canvas that has never been painted on!");
			
		this._p.clear();
		$(this._p.canvasId).innerHTML = "";
		if(!soft) {	// hard clear all data sets
			this.initialize(this.title);
		}
	},
	toString: function() {
		return "[SimpleLineGraph Object] " + this.title;
	}
}
