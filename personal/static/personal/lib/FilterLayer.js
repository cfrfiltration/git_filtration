/**
 * Filter Layer Object
 */
FilterLayer = Class.create();

FilterLayer.prototype = {
	initialize: function(title, parentNumber) {
		this.title = title;
		this.parentNumber = parentNumber
	},
	toString: function() {
		return "[FilterLayer]";
	}
}
