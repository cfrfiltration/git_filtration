<script type="text/javascript" src="../JavaScript3d.js"></script>
<script type="text/javascript" src="../lib/wz_jsgraphics.js"></script>
<script type="text/javascript" src="../lib/ErrorManager.js"></script>
<script type="text/javascript" src="../Painter.js"></script>
<script type="text/javascript" src="../Point.js"></script>
<script type="text/javascript" src="../Sphere.js"></script>
/* end imports (DO NOT REMOVE THIS LINE!) */
/**
 * Test the sphere Object
 */

testInitialization: function() { with(this) {
	var sphere = new JavaScript3d.Sphere(new JavaScript3d.Point(0, 0, 0), 100);
	assertEqual("100", sphere.radius);
	assertEnumEqual([0, 0, 0], sphere.center.getCoords());
	assertEnumEqual([0, 0, 0], [sphere.aor.x, sphere.aor.y, sphere.aor.z]);
}},

testMove: function() { with(this) {
	var sphere = new JavaScript3d.Sphere(new JavaScript3d.Point(0, 0, 0), 100);
	assertEqual("100", sphere.radius);
	assertEnumEqual([0, 0, 0], sphere.center.getCoords());
	assertEnumEqual([0, 0, 0], [sphere.aor.x, sphere.aor.y, sphere.aor.z]);
	sphere.move(50, 20, 102);
	assertEnumEqual([50, 20, 102], sphere.center.getCoords());
}},

testRotate: function() { with(this) {
	var sphere = new JavaScript3d.Sphere(new JavaScript3d.Point(0, 0, 0), 100);
	assertEqual("100", sphere.radius);
	assertEnumEqual([0, 0, 0], sphere.center.getCoords());
	assertEnumEqual([0, 0, 0], [sphere.aor.x, sphere.aor.y, sphere.aor.z]);
	sphere.rotate(30, 201, 20);
	assertEnumEqual([30, 201, 20], [sphere.aor.x, sphere.aor.y, sphere.aor.z]);
}},

testRotateDrawAndClearPerformance: function() { with(this) {
	benchmark(function() {
		var painter = new JavaScript3d.Painter('sandbox');
		var sphere = new JavaScript3d.Sphere(new JavaScript3d.Point(300, 300, 10), 100);
		painter.clear();
		for(i = 0; i <= 360; i = i + 5) {
			painter.clear();
			sphere.rotate(0, 0, i*Math.PI/180);
			sphere.drawWire(painter);
			painter.paint();
		}
	}, 2, "Rotates the sphere 360 degrees about the z-axis redrawing at every 5th degree. Sphere has a scaling factor of 100px.");
}},
