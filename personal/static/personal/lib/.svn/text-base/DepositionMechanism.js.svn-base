/**
 * DepositionMechanisms Object
 *
 * Represents a  method of capturing a particle within a filter.
 */
DepositionMechanism = Class.create();

DepositionMechanism.prototype = {
	initialize: function(shortName, title) {
		this.shortName = shortName;
		this.title = title;
		this.formulae = new Array();
		this.activeFormulaId = null;
	},
	addFormula: function(func) {
		this.formulae.push(func);
	},
	evaluate: function(particleSize, constants) {
		if(this.activeFormulaId == null || this.formulae.length < this.activeFormulaId)
			throw("Invalid active formula id("+this.activeFormulaId+"), this is probably a bug.");
		
		return this.formulae[this.activeFormulaId].formula(particleSize, constants);
	},
	toString: function() { return "[DepositionMechanism]"; }
}