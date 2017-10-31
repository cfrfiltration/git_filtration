<script type="text/javascript" src="../JavaScript3d.js"></script>
/* end imports (DO NOT REMOVE THIS LINE!) */
testRuntimeConstants: function() { with(this) {
	assertNotNull(JavaScript3d.Version, "The version constant defined in the JavaScript3d object is either null or not properly defined! "+JavaScript3d.toString());
	assertNotNull(JavaScript3d.EyeDistance, "The EyeDistance constant defined in the JavaScript3d object is either null or not properly defined!");
	assertMatch("JavaScript3d", JavaScript3d.toString());
}},
