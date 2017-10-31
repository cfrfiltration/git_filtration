glbl_eq1_helper = null;
glbl_eq2_helper = null;
glbl_eq3_helper = null;
glbl_eq4_helper = null;
glbl_eq5_helper = null;
glbl_eq6_helper = null;
glbl_maxShapeFactor = 0;
glbl_maxInterceptionEfficiency = 0;
glbl_gamma = 1;
glbl_prefactor = 1;
glbl_message_received = null;

function effectiveDensityMaricq(primaryParticleSize, primaryParticleDensity, mobilityDiameter, fractalDimension) {
	var ld_effectiveDensity = primaryParticleDensity * Math.pow(mobilityDiameter / primaryParticleSize, fractalDimension - 3);
	return ld_effectiveDensity;
}

function resetGlobalMaxes() {
	//my god this is getting to be a big kluge
	glbl_maxShapeFactor = 0;
	glbl_maxInterceptionEfficiency = 0;
	glbl_message_received = false;
}

function effectiveDensityKim(mobilityDiameter, fractalDimension, primaryParticleDensity) {
	var dynamicShapeFactor;
	var d4coeff, d3coeff, d2coeff, d1coeff, d0coeff, gamma, prefactor;
	var dp = mobilityDiameter * 1e3;
	if (fractalDimension == 2.07) {
		d4coeff = -2.39e-11;
		d3coeff = 6.18e-8;
		d2coeff = -5.72e-5;
		d1coeff = 2.26e-2;
		d0coeff = 0.81;
		glbl_gamma = 1.268;
		glbl_prefactor = 0.603;
	} else if (fractalDimension == 2.25) {
		d4coeff = -7.77e-10;
		d3coeff = 6.13e-7;
		d2coeff = -1.82e-4;
		d1coeff = 2.7e-2;
		d0coeff = 0.37;
		glbl_gamma = 1.088;
		glbl_prefactor = 1.047;
	} else {
		d4coeff = 0;
		d3coeff = 0;
		d2coeff = 0;
		d1coeff = 0;
		d0coeff = 1;
		glbl_gamma = 1;
		glbl_prefactor = 1;
	}
	dynamicShapeFactor = d4coeff*Math.pow(dp,4) + d3coeff*Math.pow(dp,3) + d2coeff*Math.pow(dp,2) + d1coeff*dp + d0coeff;
	if (dynamicShapeFactor < 1) { dynamicShapeFactor = 1; }
	if (dynamicShapeFactor > glbl_maxShapeFactor) {
		glbl_maxShapeFactor = dynamicShapeFactor;
	} else {
		dynamicShapeFactor = glbl_maxShapeFactor;
	}
	return primaryParticleDensity / dynamicShapeFactor;
}
function mantonCoefficients(x,y,z,c) {
	//Manton coefficients are 2nd order polynomials with the porosity
	return (x + y*(1 - c['alpha'].value) + z*Math.pow(1 - c['alpha'].value,2));
}
function defineHelpers(particleSize, c) {
	// helper formulae
	glbl_eq1_helper = particleSize / c['fs'].value;
	//glbl_eq2_helper = 1+(2*c['lambda'].value/particleSize)*(1.165 + 0.483 * Math.exp(-0.997/(2 * c['lambda'].value / particleSize)));
	glbl_eq2_helper = 1+(c['lambda'].value/particleSize)*(2.34 + 1.05*Math.exp(-0.39 * particleSize / c['lambda'].value));
	//glbl_eq3_helper = c['df'].value * Math.pow(particleSize * 0.0001,2) * glbl_eq2_helper * c['uf'].value/ (18 * c['mu'].value * c['fs'].value * 0.0001);
	//alert(c['fractalDimension'].value + "; " + c['primaryParticleDiameter'].value + "; " + c['useAgg'].value);
	//alert(particleSize);
	var roEff;
	if (c['useAgg'].value) {
		if (c['nucleopore'].value) {
			roEff = effectiveDensityKim(particleSize, c['fractalDimension'].value, c['df'].value);
			//alert('using agg (nucleopore), roEff = ' + roEff + "; primaryParticleDiameter = " + c['primaryParticleDiameter'].value);
		} else {
			roEff = effectiveDensityKim(particleSize, c['fractalDimension'].value, c['df'].value);
			//roEff = effectiveDensityMaricq(c['primaryParticleDiameter'].value, c['df'].value, particleSize, c['fractalDimension'].value);
			//alert('using agg (fibrous), roEff = ' + roEff + "; primaryParticleDiameter = " + c['primaryParticleDiameter'].value);
		}
	} else {
		roEff = c['df'].value;
		//alert('not using agg, roEff = ' + roEff);
	}
	glbl_eq3_helper = roEff * Math.pow(particleSize * 0.0001,2) * glbl_eq2_helper * c['uf'].value/ (18 * c['mu'].value * c['fs'].value * 0.0001);
	if (glbl_eq1_helper < c['r'].value) 
			glbl_eq4_helper = (c['j1'].value-c['j2'].value*Math.pow(c['alpha'].value,c['j3'].value))* Math.pow(glbl_eq1_helper,2) - c['j4'].value * Math.pow(glbl_eq1_helper, c['j5'].value);
	else 	glbl_eq4_helper = 2;

	glbl_eq5_helper = glbl_eq2_helper * 1.38 * Math.pow(10,-16) * 293 / (3 * 3.14 * c['mu'].value * particleSize * 0.0001);
	glbl_eq6_helper = c['fs'].value * 0.0001 * c['uf'].value/glbl_eq5_helper;
	
	//Nucleopore Spurny Impaction
 	glbl_stk = Math.pow(10,-4) * Math.pow(particleSize,2)*c['df'].value*c['uf'].value * glbl_eq2_helper / 9 / c['mu'].value / c['fs'].value;
 	glbl_stk = Math.pow(10,-4) * Math.pow(particleSize,2)*roEff*c['uf'].value * glbl_eq2_helper / 9 / c['mu'].value / c['fs'].value;
 	//glbl_stk is only for nucleopore...note that c['fs'] is actually the pore diameter
 	glbl_sqrt_porosity = Math.sqrt(1 - c['alpha'].value);
 	glbl_Spurny_imp_helper_4 = glbl_sqrt_porosity / (1 - glbl_sqrt_porosity); //Shawn Chen et al, spherical, eq 4
 	glbl_Spurny_imp_helper_2a = (2 * glbl_stk * Math.pow(glbl_Spurny_imp_helper_4, 0.5)); //Shawn Chen et al, spherical, eq 2a
 	glbl_Spurny_imp_helper_2b = (2 * Math.pow(glbl_stk, 2) * glbl_Spurny_imp_helper_4 * Math.exp(-1 / glbl_stk / Math.pow(glbl_Spurny_imp_helper_4, 0.5))); // Shawn Chen et al, spherical, eq 2b
 	glbl_Spurny_imp_helper_2c = 2 * Math.pow(glbl_stk, 2) * glbl_Spurny_imp_helper_4;
 	glbl_Spurny_imp_helper_2 = glbl_Spurny_imp_helper_2a + glbl_Spurny_imp_helper_2b - glbl_Spurny_imp_helper_2c;
 	glbl_Spurny_imp_helper_1a = glbl_Spurny_imp_helper_2 / (1 + glbl_Spurny_imp_helper_4);
 	glbl_Spurny_imp_efficiency = glbl_Spurny_imp_helper_1a * (2 - glbl_Spurny_imp_helper_1a);
 	
 	//Nucleopore Spurny Diffusion
  	glbl_mobility = glbl_eq2_helper / (3 * 3.141592 * c['mu'].value * particleSize * Math.pow(10,-7));
  	glbl_diffusivity = glbl_mobility * 1.3806488e-23 * c['temp'].value;
  	glbl_Spurny_ND = Math.pow(10.0,11.0) * c['T'].value * (1.0 - c['alpha'].value) * glbl_diffusivity / Math.pow((c['fs'].value / 2.0),2.0) / c['uf'].value;
  	
  	if (glbl_Spurny_ND < 0.01) { //the problem is here, but I don't know in what.  Disagrees with matlab right here, for ND < 0.01
  		//only shows up for pore diameter > 1 um
  		glbl_Spurny_diff_efficiency = 2.56*Math.pow(glbl_Spurny_ND,2.0/3.0) - 1.2*glbl_Spurny_ND - 0.177*Math.pow(glbl_Spurny_ND,4.0/3.0);
  		//alert('dp = ' + particleSize + '; 0.177*Math.pow(glbl_Spurny_ND,4.0/3.0) = ' + 0.177*Math.pow(glbl_Spurny_ND,4.0/3.0));
  	} else {
  		glbl_Spurny_diff_efficiency = 1.0 - 0.819*Math.exp(-3.657*glbl_Spurny_ND) - 0.098*Math.exp(-22.305*glbl_Spurny_ND) - 0.032*Math.exp(-56.95*glbl_Spurny_ND) - 0.016*Math.exp(-107.6*glbl_Spurny_ND);
 	}
 	
 	//Nucleopore Spurny interception
 	var Lmax = 1.0e-3 * glbl_prefactor * Math.pow(particleSize * 1.0e3, glbl_gamma);
 	glbl_Spurny_NR = Lmax / c['fs'].value;
 	glbl_Spurny_inter_efficiency = glbl_Spurny_NR * (2.0 - glbl_Spurny_NR);
 	if (glbl_Spurny_inter_efficiency > glbl_maxInterceptionEfficiency) {
 		glbl_maxInterceptionEfficiency = glbl_Spurny_inter_efficiency;
 	} else {
 		glbl_Spurny_inter_efficiency = glbl_maxInterceptionEfficiency;
 	}
 	//Nucleopore Modified Spurny term
 	glbl_psi = 2.0e8 * glbl_diffusivity * glbl_sqrt_porosity / (c['uf'].value * c['fs'].value);
 	glbl_alpha1 = 4.57 - 6.46*(1 - c['alpha'].value) + 4.58*Math.pow(1 - c['alpha'].value,2);
 	glbl_alpha2 = 4.5;
 	glbl_Spurny_surfDiff_efficiency = 1 - Math.exp( -1 * glbl_alpha1 * Math.pow(glbl_psi, 2/3) / (1 + (glbl_alpha1/glbl_alpha2)*Math.pow(glbl_psi, 7/15)));

	//Nucleopore Manton Part 1
	glbl_inertial_parameter = Math.pow(10,-4) * c['df'].value * c['uf'].value * c['fs'].value * Math.sqrt(1 - c['alpha'].value) / 9.0 / c['mu'].value;
	glbl_Manton_a1 = mantonCoefficients(0.6885,-1.473959,0.286458,c);
	glbl_Manton_a2 = mantonCoefficients(7.754343,-46.535261,72.73776,c);
	glbl_Manton_a3 = mantonCoefficients(1.296234,-4.525388,6.554401,c);
	glbl_Manton_b1 = mantonCoefficients(2.72,-33.125,65.625,c);
	glbl_Manton_b2 = mantonCoefficients(16.117649,-36.71587,27.829932,c);
	glbl_Manton_b3 = mantonCoefficients(-10.61161,28.831488,-31.098401,c);
	glbl_Manton_a = (glbl_Manton_a1 * Math.pow(glbl_inertial_parameter,2) - glbl_Manton_a2 * glbl_inertial_parameter) / (glbl_inertial_parameter + glbl_Manton_a3);
	glbl_Manton_b = glbl_Manton_b1*glbl_inertial_parameter + glbl_Manton_b2*Math.sqrt(glbl_inertial_parameter) + glbl_Manton_b3*Math.pow(glbl_inertial_parameter,0.25);
	glbl_manton_part1 = Math.pow(glbl_Spurny_inter_efficiency, 2.0 / (1 + glbl_Manton_a*glbl_Spurny_NR + 2*glbl_Manton_b*glbl_Spurny_NR));
	glbl_manton_efficiency = glbl_manton_part1 + glbl_Spurny_diff_efficiency*(1 - glbl_manton_part1);
	glbl_manton_efficiency = 1 - (1 - glbl_manton_efficiency) * (1 - glbl_Spurny_surfDiff_efficiency);
	
	//if inertial parameter > 1, we prefer Manton over Spurny.  Therefore, upon this check, we may reset all Spurny efficiencies to ZERO.
	//else, we set the Manton efficiency to ZERO.  The combining will take place below
	if (glbl_inertial_parameter > 1 && c['fractalDimension'].value == 3) { // use Manton
		glbl_Spurny_diff_efficiency = 0;
		glbl_Spurny_imp_efficiency = 0;
		glbl_Spurny_inter_efficiency = 0;
		glbl_Spurny_surfDiff_efficiency = 0;
		//if (!glbl_message_received) { alert('Using Manton'); }
		glbl_message_received = true;
	} else { // use Spurny
//		alert('Spurny imp efficiency = ' + glbl_Spurny_imp_efficiency + '/nSpurny imp interception eff = ' + glbl_Spurny_inter_efficiency);
//		alert('Spurny diff efficiency = ' + glbl_Spurny_diff_efficiency + ', Spurny surfDiff_efficiency = ' + glbl_Spurny_surfDiff_efficiency);
		//alert('Dynamic Shape Factor = ' + glbl_
		glbl_manton_efficiency = 0;
		//if (!glbl_message_received) { alert('Using Spurny'); }
		glbl_message_received = true;
//		glbl_Spurny_diff_efficiency = 0;
//		glbl_Spurny_imp_efficiency = 0;
//		glbl_Spurny_inter_efficiency = 0;
//		glbl_Spurny_surfDiff_efficiency = 0;

	}
}

/**
 * Each formula must behave identical to this function
 * @param particleSize A numeric value representing the particleSize variable in the formula
 * @param constantsArray An array of constants as defined in the staticConfig that are used in the formula
 * @return numeric
 */
var interception_exampleFormula1 = new Formula("Equation One",
	function(particleSize, c) 
	{
		defineHelpers(particleSize, c);
		interceptionEqOne = Math.abs(c['interception'].value-0)*(1-c['alpha'].value)*Math.pow(glbl_eq1_helper,2)/(c['ku'].value*(1+glbl_eq1_helper));
		return interceptionEqOne;
	}
);
var interception_exampleFormula2 = new Formula("Equation Two",
	function(particleSize, c) 
	{
		defineHelpers(particleSize, c);	
		result = ( (1/(1 + glbl_eq1_helper)) - (1 + glbl_eq1_helper) + 2*(1 + 1.996 *c['kn'].value)*(1+glbl_eq1_helper) * Math.log(1+glbl_eq1_helper) ) / (2*(-0.75-0.5*Math.log(c['alpha'].value)) + 1.996*c['kn'].value*(-0.5 - Math.log(c['alpha'].value)));
		return result;
	}
);

var interception_formula_nucleopore = new Formula ("Nucleopore Interception", function(particleSize, c) {
	defineHelpers(particleSize, c);
	return (glbl_Spurny_inter_efficiency);
}
);

var impaction_exampleFormula1 = new Formula("Equation One",
	function(particleSize, c) 
	{		
		defineHelpers(particleSize, c);
		impactionEqOne = glbl_eq3_helper * glbl_eq4_helper/(4*Math.pow(c['ku'].value,2));
		return impactionEqOne;
	}
);

var impaction_formula2 = new Formula("Equation Two",
	function(particleSize, c) {
		defineHelpers(particleSize, c);
		result =  Math.pow(glbl_eq3_helper,3) / (Math.pow(glbl_eq3_helper,3) + 0.77 * Math.pow(glbl_eq3_helper,2) + 0.22);
		return result;
	}
);

var impaction_formula_nucleopore = new Formula ("Nucleopore Impaction", function(particleSize, c) {
	defineHelpers(particleSize, c);
	return (glbl_Spurny_imp_efficiency);
}
);

var diffusion_exampleFormula1 = new Formula("Equation One",
	function(particleSize, c) 
	{		
		defineHelpers(particleSize, c);
		diffusionEqOne = Math.abs(c['diffuAst'].value-0)*2*Math.pow(glbl_eq6_helper,(-2/3));
		return diffusionEqOne;
	}
);

var diffusion_formula2 = new Formula ("Equation Two",
	function(particleSize, c) {
		defineHelpers(particleSize, c);
		return (2.27 * Math.pow(c['ku'].value, -1/3) * Math.pow(glbl_eq6_helper, -2/3)) * (1+0.62*c['kn'].value * Math.pow(glbl_eq6_helper, 1/3) * Math.pow(c['ku'].value, -1/3));
	}
);

var diffusion_formula_nucleopore = new Formula ("Nucleopore Diffusion", function(particleSize, c) {
	defineHelpers(particleSize, c);
	return (1 - (1 - glbl_Spurny_diff_efficiency) * (1 - glbl_Spurny_surfDiff_efficiency));
}
);


var interDiffInter_exampleFormula1 = new Formula("Equation One",
	function(particleSize, c) 
	{
		defineHelpers(particleSize, c);
		drEqOne = 1.24*Math.pow(glbl_eq1_helper,(2/3))/Math.pow((c['ku'].value*glbl_eq6_helper),0.5);
		return drEqOne;
	}
);

var manton_nucleopore = new Formula ("Nucleopore Manton", function(particleSize, c) {
	defineHelpers(particleSize, c);
	return(glbl_manton_efficiency);
}
);

/**
 * SPECIA Equations
 */
var pressureDrop_equationOne = new Formula("Equation One",
	function(particleSize, c) {
		return 1000000 * ((c['mu'].value * c['uf'].value * c['T'].value * (64 * Math.pow(c['alpha'].value,1.5) * (1 + 56 * Math.pow(c['alpha'].value,3)))) / Math.pow(c['fs'].value, 2) );
	}

);
var pressureDrop_equationTwo = new Formula("Equation Two",
	function(particleSize, c) {
		return 1000000 * ( (c['T'].value *  4 * c['mu'].value * c['alpha'].value * c['uf'].value) * (1+1.996*c['kn'].value) / ((0.25 *  Math.pow(c['fs'].value, 2)) * ( -0.5 * Math.log(c['alpha'].value) - 0.75 + c['alpha'].value - (Math.pow(c['alpha'].value, 2) / 4 ) + 1.996 * c['kn'].value * (-0.5 * Math.log(c['alpha'].value) - 0.25 + (Math.pow(c['alpha'].value, 2) / 4)))) ) ;
	}
);

var pressureDrop_Spurny = new Formula ("Nucleopore Pressure Drop", function(particleSize, c) {
	defineHelpers(particleSize, c);
	return (1);
}
);