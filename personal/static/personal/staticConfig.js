/**
 * The Static Configuration
 * 
 * This file defines the starting configuration for
 * the application. Most if not all of these settings
 * can be changed at runtime.
 */
ErrorManager.debug = true;

var cfg = new Array();

// Define Constants
//	Params( symbol, description, units, value, mutable)
cfg['constants'] = new Array();
cfg['constants']['T'] = new DepositionMechanism.Constant("T", "Thickness", "mm", 1, true);
cfg['constants']["alpha"] = new DepositionMechanism.Constant("alpha", "Solidity", "", .05, true);
cfg['constants']["fs"] = new DepositionMechanism.Constant("fs", "Fiber Size", "&mu;m", 20, true);

cfg['constants']["lambdaStandard"] = new DepositionMechanism.Constant("lambdaStandard", "Gas Mean Free Path", "micron meters", 0.066, false);
cfg['constants']["df"] = new DepositionMechanism.Constant("df", "Particle Density", "g/cc", 1, false);
cfg['constants']["fractalDimension"] = new DepositionMechanism.Constant("fractalDimension", "Fractal Dimension", "", 3, false);
cfg['constants']["primaryParticleDiameter"] = new DepositionMechanism.Constant("primaryParticleDiameter", "Primary Particle Diameter", "um", 0.005, false);
cfg['constants']["uf"] = new DepositionMechanism.Constant("uf", "Face Velocity", "cm/s", 10, false);
cfg['constants']["mu"] = new DepositionMechanism.Constant("mu", "Gas Viscosity", "g/cm*s", 0.000181, false);
cfg['constants']["useAgg"] = new DepositionMechanism.Constant("useAgg", "Agglomerates", "", "false", false);
cfg['constants']["nucleopore"] = new DepositionMechanism.Constant("nucleopore","Nucleopore", "", "false", false);
cfg['constants']["temp"] = new DepositionMechanism.Constant("temp", "Tempurature", "K", 293.15, false);
cfg['constants']["pre"] = new DepositionMechanism.Constant("pre", "Pressure", "psi", 14.6979488, false);
cfg['constants']['j1'] = new DepositionMechanism.Constant("j1", "j1", "", 29.6, false);
cfg['constants']['j2'] = new DepositionMechanism.Constant("j2", "j1", "", 28, false);
cfg['constants']['j3'] = new DepositionMechanism.Constant("j3", "j3", "", 0.62, false);
cfg['constants']['j4'] = new DepositionMechanism.Constant("j4", "j4", "", 27.5, false);
cfg['constants']['j5'] = new DepositionMechanism.Constant("j5", "j5", "", 2.8, false);
cfg['constants']['r'] = new DepositionMechanism.Constant("r", "r", "", 0.4, false);
cfg['constants']['diffuFact'] = new DepositionMechanism.Constant("diffuFact", "diffuFact", "", 2.6, false);
cfg['constants']['diffuAst'] = new DepositionMechanism.Constant("diffuAst", "diffuAst", "", 1, false);
cfg['constants']['diffuSimp'] = new DepositionMechanism.Constant("diffuSimp", "diffuSimp", "", 0, false);
cfg['constants']['interception'] = new DepositionMechanism.Constant("interception", "interception", "", 1, false);
cfg['constants']['interaction'] = new DepositionMechanism.Constant("interaction", "interaction", "", 1, false);

function setDependantConstants(constants) {
//	cfg['constants']['lambda']=new DepositionMechanism.Constant("lambda", "Gas Mean Free Path", "micron meters", constants['lambdaStandard'].value * constants['temp'].value / 293 * 14.7/ constants['pre'].value, false);
	cfg['constants']['lambda']=new DepositionMechanism.Constant("lambda", "Gas Mean Free Path", "micron meters", constants['lambdaStandard'].value * constants['temp'].value / 293, false);
	cfg['constants']['re'] = new DepositionMechanism.Constant("re", "Reynolds Number", "", 6.6 * constants['uf'].value * constants['fs'].value * 0.0001, false);
	cfg['constants']['ku'] = new DepositionMechanism.Constant("ku", "KU Lambs", "", 2 - Math.log(constants['re'].value), false);
	cfg['constants']['ku'] = new DepositionMechanism.Constant("ku", "KU Kuwabara", "", -0.5*Math.log(constants['alpha'].value)-0.75 + constants['alpha'].value - 0.25 * Math.pow(constants['alpha'].value, 2), false);
	cfg['constants']['kn'] = new DepositionMechanism.Constant("kn", "kn", "", 2*cfg['constants']['lambda'].value 
/ cfg['constants']['fs'].value, false);


}
setDependantConstants(cfg['constants']);

// Define DepositionMechanisms that will be used
cfg['depositionMechanisms'] = new Array();
cfg['depositionMechanisms'][0] = new DepositionMechanism("Interception", "Interception");
cfg['depositionMechanisms'][0].addFormula(interception_exampleFormula2);
cfg['depositionMechanisms'][0].addFormula(interception_exampleFormula1);
cfg['depositionMechanisms'][0].addFormula(new Formula("Ignore Mechanism", function(particleSize, c) { return 0; }));
cfg['depositionMechanisms'][0].addFormula(interception_formula_nucleopore);

cfg['depositionMechanisms'][1] = new DepositionMechanism("Impaction", "Impaction");
cfg['depositionMechanisms'][1].addFormula(impaction_formula2);
cfg['depositionMechanisms'][1].addFormula(impaction_exampleFormula1);
cfg['depositionMechanisms'][1].addFormula(new Formula("Ignore Mechanism", function(particleSize, c) { return 0; }));
cfg['depositionMechanisms'][1].addFormula(impaction_formula_nucleopore);

cfg['depositionMechanisms'][2] = new DepositionMechanism("Diffusion", "Diffusion");
cfg['depositionMechanisms'][2].addFormula(diffusion_formula2);
cfg['depositionMechanisms'][2].addFormula(diffusion_exampleFormula1);
cfg['depositionMechanisms'][2].addFormula(new Formula("Ignore Mechanism", function(particleSize, c) { return 0; }));
cfg['depositionMechanisms'][2].addFormula(diffusion_formula_nucleopore);

cfg['depositionMechanisms'][3] = new DepositionMechanism("Interception-Diffusion-Interaction", "Interception-Diffusion-Interaction Term");
cfg['depositionMechanisms'][3].addFormula(interDiffInter_exampleFormula1);
cfg['depositionMechanisms'][3].addFormula(new Formula("Ignore Mechanism", function(particleSize, c) { return 0; }));
cfg['depositionMechanisms'][3].addFormula(manton_nucleopore);

cfg['pressure'] = new DepositionMechanism("Pressure Drop", "Pressure Drop");
cfg['pressure'].addFormula(pressureDrop_equationTwo);
cfg['pressure'].addFormula(pressureDrop_equationOne);
cfg['pressure'].addFormula(pressureDrop_Spurny);

// Define filter layers
cfg['systems'] = [
	[ new FilterLayer('Layer1'), 0],
	[ new FilterLayer('Layer1'), 1],
	[ new FilterLayer('Layer1'), 2]
];
var currentSystem = 0; // current system, may be 0, 1 or 2.
var initializing = true; //part of a major kluge
// NOTE: everywhere we used to refer to cfg['layers'] we now refer to cfg['systems'][currentSystem].

cfg['rangeMin'] = 0;
cfg['rangeMax'] = 5;
cfg['step'] = 1;
