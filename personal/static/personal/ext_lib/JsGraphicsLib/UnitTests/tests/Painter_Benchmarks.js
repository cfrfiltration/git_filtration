<script type="text/javascript" src="../JavaScript3d.js"></script>
<script type="text/javascript" src="../lib/wz_jsgraphics.js"></script>
<script type="text/javascript" src="../Point.js"></script>
/* end imports (DO NOT REMOVE THIS LINE!) */
/**
 * Test the performance of the wz_jsGraphics.js library
 */
setup: function() { with(this) {
	document.getElementById('sandbox').style.display = "block";
	document.getElementById('sandbox').style.border = "solid thin black";
}},
testStraitLinePaintAndClearPerformance: function() { with(this) {
	var painter = new jsGraphics('sandbox');
	benchmark(function() {
		painter.clear();
		painter.drawLine(0, 10, 400, 10);
		painter.paint();
	}, 20, "Simply drawing a 400 pixel line strait across screen Clearing it and Redrawing it.");
}},
testSlantedLinePaintAndClearPerformance: function() { with(this) {
	var painter = new jsGraphics('sandbox');
	benchmark(function() {
		painter.clear();
		painter.drawLine(0,0,283,283);
		painter.paint();
	}, 20, "Drawing a line at a 45 degree angle that is 400 pixels in length, clearing it and redrawing it.");
	benchmark(function() {
		painter.clear();
		painter.drawLine(0,0,327,231);
		painter.paint();
	}, 20, "Drawing a line at a 30 degree angle that is 400 pixels in length, clearing it and redrawing it.");
}},
testLineRotateAndDrawPerformance: function() { with(this) {
	painter = new jsGraphics('sandbox');
	benchmark(function() {
		for(i = 0; i <= 360; i++) {
			one = new JavaScript3d.Point(20, 20, 0);
			two = new JavaScript3d.Point(120, 120, 0);
			c = new JavaScript3d.Point(70, 70, 0);
			one.rotate(c, 0, 0, i*Math.PI/180);
			two.rotate(c, 0, 0, i*Math.PI/180);
			painter.clear();
			painter.drawLine(one.x, one.y, two.x, two.y);
			painter.paint();
		}
		}, 1, "Rotating a line that is 100 pixels long in a circle one degree at a time. The axis of rotation is the point between the two ends of the line. This benchmark relizes on the Point object to rotate the coordinates of the line begin and end.");
}},
testCirclePaintAndClearPerformance: function() { with(this) {
	painter = new jsGraphics('sandbox');
	benchmark(function() {
		painter.clear();
		painter.drawEllipse(500, 500, 200, 200);
		painter.paint();
	}, 20, "Simply drawing a circle erasing it and drawing it again. Radius: 200px");
}},
testEllipsePaintAndClearPerformance: function() { with(this) {
	painter = new jsGraphics('sandbox');
	benchmark(function() {
		painter.clear();
		painter.drawEllipse(500, 500, 20, 200);
		painter.paint();
	}, 20, "Simply drawing a circle erasing it and drawing it again. Width: 20px, Height: 200px");
}},
teardown: function() { with(this) {
	document.getElementById('sandbox').style.display = "none";
}},