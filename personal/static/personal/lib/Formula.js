/**
 * Formula Object
 */
Formula = Class.create();

Formula.prototype = {
	initialize: function(title, func) {
		this.title = title;
		this.formula = func;
	},
	toString: function() { return "[Formula]"; }
}