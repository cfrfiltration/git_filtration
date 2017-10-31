/**
 * Legend
 * 
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 */
SimpleLineGraph.Legend = Class.create();

SimpleLineGraph.Legend.prototype = {
	initialize: function() {
		this.sets = new Array();
		this.offsetx = 0;
		this.offsety = 0;
		this.width = 150;
		this.height = 50; //height per set
	},
	addSet: function(dataSet) {
		this.sets.push(dataSet);
	},
	draw: function(painter, offx, offy, scalex, scaley) {
		offx = offx + this.offsetx;
		offy = offy + this.offsety;
		//width = 150
		//height = 50 * this.sets.length;
		
		// Black box with lines and lables
		painter.jsPainter.drawRect(offx, offy, this.width, this.height * this.sets.length);
		
		for(i = this.sets.length-1; i >= 0; i--) {
			painter.jsPainter.setColor(this.sets[i].color);
			painter.jsPainter.setStroke(this.sets[i].size);
			painter.jsPainter.drawString(this.sets[i].title,10 + offx, 50*i + 10 + offy);
			painter.jsPainter.drawLine(10 + offx, 50*i + 25 + offy,  this.width - 20 + offx, 50*i + 25 + offy);
		}
	}
}