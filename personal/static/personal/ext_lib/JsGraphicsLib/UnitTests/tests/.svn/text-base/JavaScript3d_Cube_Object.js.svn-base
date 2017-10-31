<script type="text/javascript" src="../JavaScript3d.js"></script>
<script type="text/javascript" src="../lib/wz_jsgraphics.js"></script>
<script type="text/javascript" src="../Painter.js"></script>
<script type="text/javascript" src="../Point.js"></script>
<script type="text/javascript" src="../Cube.js"></script>
/* end imports (DO NOT REMOVE THIS LINE!) */
/**
 * Test the Cube Object
 */

testInitialization: function() { with(this) {
	var cube = new JavaScript3d.Cube(10, 0, 0, 0, 0, 0, 0);
	assertEqual("10", cube.scale);
	assertEnumEqual([0, 0, 0], cube.center.getCoords());
	assertEnumEqual([0, 0, 0], [cube.aor.x, cube.aor.y, cube.aor.z]);
}},

testMove: function() { with(this) {
	var cube = new JavaScript3d.Cube(10, 0, 0, 0, 0, 0, 0);
	assertEnumEqual([0, 0, 0], cube.center.getCoords());
	cube.move(50, 20, 102);
	assertEnumEqual([50, 20, 102], cube.center.getCoords());
}},

testRotate: function() { with(this) {
	var cube = new JavaScript3d.Cube(10, 0, 0, 0, 0, 0, 0);
	assertEnumEqual([0, 0, 0], [cube.aor.x, cube.aor.y, cube.aor.z]);
	cube.rotate(30, 201, 20);
	assertEnumEqual([30, 201, 20], [cube.aor.x, cube.aor.y, cube.aor.z]);
}},

test__getPoints: function() { with(this) {
	var cube = new JavaScript3d.Cube(10, 0, 0, 0, 0, 0, 0);
	var points = cube.__getPoints();
	
	assertEqual(8, points.length, "The __getPoints() method didn't generate the proper amount of points for a Cube.");
	assertEnumEqual([-5, 5, 5], points[0].getCoords());
	assertEnumEqual([-5, -5, 5], points[1].getCoords());
	assertEnumEqual([5, -5, 5], points[2].getCoords());
	assertEnumEqual([5, 5, 5], points[3].getCoords());
	
	assertEnumEqual([5, 5, -5], points[4].getCoords());
	assertEnumEqual([5, -5, -5], points[5].getCoords());
	assertEnumEqual([-5, -5, -5], points[6].getCoords());
	assertEnumEqual([-5, 5, -5], points[7].getCoords());
	
	// move and verify points again
	cube.move(400, 400, 400);
	points = cube.__getPoints();
	assertEqual(8, points.length, "The __getPoints() method didn't generate the proper amount of points for a Cube.");
	assertEnumEqual([395, 405, 405], points[0].getCoords());
	assertEnumEqual([395, 395, 405], points[1].getCoords());
	assertEnumEqual([405, 395, 405], points[2].getCoords());
	assertEnumEqual([405, 405, 405], points[3].getCoords());
	
	assertEnumEqual([405, 405, 395], points[4].getCoords());
	assertEnumEqual([405, 395, 395], points[5].getCoords());
	assertEnumEqual([395, 395, 395], points[6].getCoords());
	assertEnumEqual([395, 405, 395], points[7].getCoords());
	
	// rotate and verify points again
	cube.rotate(0, 0, Math.PI/2);
	points = cube.__getPoints();
	assertEqual(8, points.length, "The __getPoints() method didn't generate the proper amount of points for a Cube.");
	assertEnumEqual([405, 405, 405], points[0].getCoords());
	assertEnumEqual([395, 405, 405], points[1].getCoords());
	assertEnumEqual([395, 395, 405], points[2].getCoords());
	assertEnumEqual([405, 395, 405], points[3].getCoords());
	
	assertEnumEqual([405, 395, 395], points[4].getCoords());
	assertEnumEqual([395, 395, 395], points[5].getCoords());
	assertEnumEqual([395, 405, 395], points[6].getCoords());
	assertEnumEqual([405, 405, 395], points[7].getCoords());
	
	// rotate and verify points are moving from last position not from start position
	cube.rotate(0, 0, Math.PI/2);
	points = cube.__getPoints();
	assertEqual(8, points.length, "The __getPoints() method didn't generate the proper amount of points for a Cube.");
	assertEnumEqual([405, 395, 405], points[0].getCoords(), "The cube is not remembering past rotations!");
	assertEnumEqual([405, 405, 405], points[1].getCoords(), "The cube is not remembering past rotations!");
	assertEnumEqual([395, 405, 405], points[2].getCoords(), "The cube is not remembering past rotations!");
	assertEnumEqual([395, 395, 405], points[3].getCoords(), "The cube is not remembering past rotations!");
	
	assertEnumEqual([395, 395, 395], points[4].getCoords(), "The cube is not remembering past rotations!");
	assertEnumEqual([395, 405, 395], points[5].getCoords(), "The cube is not remembering past rotations!");
	assertEnumEqual([405, 405, 395], points[6].getCoords(), "The cube is not remembering past rotations!");
	assertEnumEqual([405, 395, 395], points[7].getCoords(), "The cube is not remembering past rotations!");
	
	benchmark( function() {
		var cube = new JavaScript3d.Cube(100, 0, 0, 0, 0, 0, 0);
		for(i = 0; i <= 360; i++) {
			cube.rotate(i*Math.PI/180, 0, 0);
			cube.move(Math.round(Math.random() * 1200), Math.round(Math.random() * 1200), Math.round(Math.random() * 1200));
			cube.__getPoints();
		}
	}, 5, "Testing the speed of getting the points of the cube. The cube (scale:100) was rotated 360 degrees one degree at a time about each axis then moved to a random ( 0 < x,y,z < 1200 ) coordinate. Each time the cube was rotated & moved the __getPoints() method was invoked.");
}},

testRotateDrawAndClearPerformance: function() { with(this) {
	benchmark(function() {
		var painter = new JavaScript3d.Painter('sandbox');
		var cube = new JavaScript3d.Cube(100, 200, 200, 100, 0, 0, 0);
		painter.clear();
		for(i = 0; i <= 360; i = i + 5) {
			painter.clear();
			cube.rotate(0, 0, i*Math.PI/180);
			cube.drawWire(painter);
			painter.paint();
		}
	}, 2, "Rotates the cube 360 degrees about the z-axis redrawing at every 5th degree. Cube has a scaling factor of 100px.");
}},
