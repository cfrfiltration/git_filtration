<script type="text/javascript" src="../JavaScript3d.js"></script>
<script type="text/javascript" src="../lib/wz_jsgraphics.js"></script>
<script type="text/javascript" src="../Point.js"></script>
/* end imports (DO NOT REMOVE THIS LINE!) */
/**
 * Test the Point Object
 */
testTranslateTo2D: function() { with(this) {
	var point = new JavaScript3d.Point(550, 600, 0);
	assertEqual("(550, 600, 0)", point.toString());
	var point2d = point.translateTo2d();
	assertEnumEqual(point.getCoords(), point2d.getCoords(), "The original point "+point.toString()+" translated to "+point2d.toString()+" as a 2d point. If the z value is 0 there should be no distortion! Using EyeDistance of '"+JavaScript3d.EyeDistance+"' px.");

	// test that with a z value the point isn't the same
	point = new JavaScript3d.Point(550, 600, 10);
	var point2db = point.translateTo2d();
	assertNotEqual(point.getCoords()[0], point2db.getCoords()[0], "With a z coord the translated point should not be the same x value! The JavaScript3d.Point(x, y, z) is not working properly!");
	assertNotEqual(point.getCoords()[1], point2db.getCoords()[1], "With a z coord the translated point should not be the same y value! The JavaScript3d.Point(x, y, z) is not working properly!");

	// Need to check more complex transformations
	JavaScript3d.EyeDistance = 1000;
	point = new JavaScript3d.Point(300, 300, 50);
	var point2d = point.translateTo2d();
	// Distance = 1000, Depth = 50 so trig geo shows 
	// y = 300000 / 1050 = 286
	// x = 300000 / 1050 = 286
	var exPoint2d = new JavaScript3d.Point(286, 286, 0);
	assertEnumEqual(exPoint2d.getCoords(), point2d.getCoords());
}},

testRotationAboutZAxis: function() { with(this) {
	var point = new JavaScript3d.Point(100, 50, 25);
	var axis = new JavaScript3d.Point(100, 100, 50);

	// a 90 degree rotation about z should make y == 100 & x == 50
	var exPoint= new JavaScript3d.Point(50, 100, 25);
	point.rotate(axis, 0, 0, (90 * Math.PI)/180);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "The point did not rotate around the given axis properly!");

	// a 0 degree rotation about the z should cuase the same coords
	point.rotate(axis, 0, 0, 0);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "The point moved on a 0,0,0 rotation! Could be a compound error from the previous failure if any.");

	// lets rotate it another 90 degrees and it should be at: 100, 100, 25
	exPoint = new JavaScript3d.Point(100, 150, 25);
	point.rotate(axis, 0, 0, (90 * Math.PI)/180);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "The point did not rotate around the given axis properly!");

	// Now lets rotate it another 180 degrees and it should be back at: 100, 50, 25
	exPoint = new JavaScript3d.Point(100, 50, 25);
	point.rotate(axis, 0, 0, Math.PI);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "The point did not rotate around the given axis properly!");
	
	// Lets test a larger scale rotation now
	point = new JavaScript3d.Point(395, 395, 405);
	axis = new JavaScript3d.Point(400, 400, 400);
	exPoint = new JavaScript3d.Point(395, 405, 405);
	point.rotate(axis, 0, 0, Math.PI/2);
	assertEnumEqual(exPoint.getCoords(), point.getCoords());

	// lets benchmark the z rotation
	benchmark(function() {
		// Get time required to calculate the rotation of a point degree by degree in circle
		var point = new JavaScript3d.Point(100, 0, 0);
		var axis = new JavaScript3d.Point(0, 0, 0);
		for(var i = 360; i >= 0; i--) {
			point.rotate(axis, 0, 0, (i * Math.PI)/180);
		}
			}, 10, "Rotating (Z Only) a point around the orgin (0, 0, 0) one degree at a time."); 
}},

testRotationAboutYAxis: function() { with(this) {
	var point = new JavaScript3d.Point(100, 100, 100);
	var axis = new JavaScript3d.Point(200, 100, 100);

	// rotating 90 degrees should put point at: (200, 100, 200)
	var exPoint = new JavaScript3d.Point(200, 100, 200);
	point.rotate(axis, 0, (90 * Math.PI)/180, 0);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "Rotationg along the Y axis did not work properly!");

	// rotating another 90 degree should put point at: (300, 100, 100)
	exPoint = new JavaScript3d.Point(300, 100, 100);
	point.rotate(axis, 0, (90 * Math.PI)/180, 0);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "Rotationg along the Y axis did not work properly!");

	// rotating another 90 degrees should put point at: (200, 100, 0)
	exPoint = new JavaScript3d.Point(200, 100, 0);
	point.rotate(axis, 0, (90 * Math.PI)/180, 0);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "Rotationg along the Y axis did not work properly!");

	// rotating another 90 degrees should put back at original point: (100, 100, 100)
	exPoint = new JavaScript3d.Point(100, 100, 100);
	point.rotate(axis, 0, (90 * Math.PI)/180, 0);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "Rotationg along the Y axis did not work properly!")

	// lets benchmark the y rotation
	benchmark(function() {
		// Get time required to calculate the rotation of a point degree by degree in circle
		var point = new JavaScript3d.Point(100, 0, 0);
		var axis = new JavaScript3d.Point(0, 0, 0);
		for(var i = 360; i >= 0; i--) {
			point.rotate(axis, 0, (i * Math.PI)/180, 0);
		}
			}, 10, "Rotating (Y only) a point around the orgin (0, 0, 0) one degree at a time."); 
}},

testRotationAboutXAxis: function() { with(this) {
	var point = new JavaScript3d.Point(100, 100, 100);
	var axis = new JavaScript3d.Point(100, 200, 100);

	// rotating 90 degrees should put point at: (100, 200, 0)
	var exPoint = new JavaScript3d.Point(100, 200, 0);
	point.rotate(axis, (90 * Math.PI)/180, 0, 0);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "Rotationg along the X axis did not work properly!");

	// rotating 90 degrees should put point at: (100, 300, 100)
	var exPoint = new JavaScript3d.Point(100, 300, 100);
	point.rotate(axis, (90 * Math.PI)/180, 0, 0);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "Rotationg along the X axis did not work properly!");

	// rotating 90 degrees should put point at: (100, 200, 200)
	var exPoint = new JavaScript3d.Point(100, 200, 200);
	point.rotate(axis, (90 * Math.PI)/180, 0, 0);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "Rotationg along the X axis did not work properly!");

	// rotating 90 degrees should put point at start: (100, 100, 100)
	var exPoint = new JavaScript3d.Point(100, 100, 100);
	point.rotate(axis, (90 * Math.PI)/180, 0, 0);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "Rotationg along the X axis did not work properly!");

	// lets benchmark the y rotation
	benchmark(function() {
		// Get time required to calculate the rotation of a point degree by degree in circle
		var point = new JavaScript3d.Point(100, 0, 0);
		var axis = new JavaScript3d.Point(0, 0, 0);
		for(var i = 360; i >= 0; i--) {
			point.rotate(axis, (i * Math.PI)/180, 0, 0);
		}
			}, 10, "Rotating (X only) a point around the orgin (0, 0, 0) one degree at a time."); 
}},

testMultiAxisRotations: function() { with(this) {
	var axis = new JavaScript3d.Point(360, 360, 360);
	var point = new JavaScript3d.Point(0, 0, 0);

	// rotate diagonally using x y & z axis rotation
	var exPoint = new JavaScript3d.Point(720, 720, 720);
	point.rotate(axis, 0, Math.PI, Math.PI/2);
	assertEnumEqual(exPoint.getCoords(), point.getCoords(), "Multi axis rotations not working as expected!");

	benchmark(function() {
		// Get time required to calculate the rotation of a point degree by degree in circle
		var point = new JavaScript3d.Point(360, 360, 360);
		var axis = new JavaScript3d.Point(0, 0, 0);
		for(var i = 360; i >= 0; i--) {
			point.rotate(axis, (i * Math.PI)/180, (i * Math.PI)/180, (i * Math.PI)/180);
		}
			}, 10, "Rotating (X Y & Z) a point around the orgin (0, 0, 0) one degree at a time.");
}},
