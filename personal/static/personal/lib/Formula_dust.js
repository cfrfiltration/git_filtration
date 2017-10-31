
var minKnd = -3;
var maxKnd = 2;
var minXf = -4;
var maxXf = 3;
var spacing = 0.1;

function getPackingData(rawKnd, rawXf) {
	var knd = spacing * Math.floor((rawKnd / spacing) + 0.5);
	var xf = spacing * Math.floor((rawXf / spacing) + 0.5);
	var xfCount = ((maxXf - minXf) / spacing) + 1;
	var kndCount = ((maxKnd - minKnd) / spacing) + 1;
	var knd_i = Math.floor(knd / spacing) - Math.floor(minKnd / spacing);
	var xf_i = Math.floor(xf / spacing) - Math.floor(minXf / spacing);
	var index = kndCount * (xf_i) + knd_i;
	return packingData[index];
}

function xCoord(xf) {
	var xfWidth = maxXf - minXf;
	var graphWidth = graphRight - graphLeft;
	var x = ((xf - minXf) / xfWidth) * graphWidth + graphLeft;
	return x;
}

function yCoord(knd) {
	var kndHeight = maxKnd - minKnd;
	var graphHeight = graphBottom - graphTop;
	var y = canvasHeight - ((knd - minKnd) / kndHeight) * graphHeight - graphTop;
	return y;
}
	
function void_function (porosity, model_number) {
	if (model_number == 1) {//Carman-Kozeny
		V = 10*(1 - porosity) / porosity;
	} else { //Vanni and Happel
		short_range_effects = 1 - (0.6 * Math.exp(-10 * (1 - porosity)));
		lre_1 = -4.5 * Math.pow(1 - porosity, 1/3);
		lre_2 = 4.5 * Math.pow(1 - porosity, 5/3);
		lre_3 = -3 * Math.pow(1 - porosity, 2);
		lre_4 = 2 * Math.pow(1 - porosity, 5/3);
		long_range_effects = (3 + lre_1 + lre_2 + lre_3) / (3 + lre_4);
		V = Math.pow(porosity,2) * short_range_effects / long_range_effects;
	}
	return V;
}

function slip_correction (dvg) {
	cc = 1 + (.066/dvg)*(2.34 + 1.05*Math.exp(-0.39*dvg/.066));
	return cc;
}

function slipCorrectionKn(kn) { return 1 + (kn)*(1.257 + 0.4*Math.exp(-0.55*kn)); }
function knudsen(radius, pressure, temp) { return meanFreePath(pressure, temp) / radius; }
function meanFreePath(pressure,temp) { return 68e-9 * (temp / 293.15) * (101325 / pressure); }	
function logDiffKnudsen(density,radius,temp,mu,pressure) {
	kn = knudsen(radius, pressure, temp);
	C = slipCorrectionKn(kn);
	knd = (C/3/mu)*Math.sqrt(density*temp*1.380658e-23/3/3.14159265359/radius);
	logKnd = Math.log(knd) / Math.log(10);
	return logKnd;
}
function logThermalEnergyRatio(density,radius,faceVelocity,temp) {
	xf= 4*density*Math.pow(radius,3)*3.14159265359*Math.pow(faceVelocity,2)/1.380658e-23/temp/3;
	logXf = Math.log(xf) / Math.log(10);
	return logXf;
}	
function pDrop_formula (ldmass, mu, uface, porosity, rho_1, dvg_1, GSD_1, kappa_1, percent_1, rho_2, dvg_2, GSD_2, kappa_2, percent_2, model_number, pressureUnits) {
	/** units: ldmass (g/cm^2), mu (g/cm*s), uface (cm/s), rho (g/cm^3), dvg (um), 1 inH2O = 249.1 Pa. **/
	percent_1 = percent_1/100;
	percent_2 = percent_2/100;
	percent_mass_1 = percent_1*rho_1*Math.pow(dvg_1,3)/(percent_1*rho_1*Math.pow(dvg_1,3)+percent_2*rho_2*Math.pow(dvg_2,3));
	percent_mass_2 = percent_2*rho_2*Math.pow(dvg_2,3)/(percent_1*rho_1*Math.pow(dvg_1,3)+percent_2*rho_2*Math.pow(dvg_2,3));
	R = (percent_1*Math.pow(dvg_1,3)*Math.exp(4.5*Math.pow(Math.log(GSD_1),2))+percent_2*Math.pow(dvg_2,3)*Math.exp(4.5*Math.pow(Math.log(GSD_2),2)))/(kappa_1/slip_correction(dvg_1)*percent_1*dvg_1*Math.exp(0.5*Math.pow(Math.log(GSD_1),2))+kappa_2/slip_correction(dvg_2)*percent_2*dvg_2*Math.exp(0.5*Math.pow(Math.log(GSD_2),2)));
	switch (pressureUnits)
	{
	  case 1:
	    unitCoefficient = 40144.5; //this is 1/2941 for dyne/cm2 to inches H20, *10^8 for the um2
	    break;
	  case 2:
	    unitCoefficient = 10000; //go from dyne/cm2 to kPa, with a 10^8 for the um2
	    break;
	  case 3:
	  	unitCoefficient = 100000000; //looks like hell, taking out
	  	break;
//	  case 4:
//	    window.open("pleating design.html","_self");
//	    break;
	}

	pdrop = unitCoefficient*18*mu*uface*ldmass*(percent_mass_1*rho_2+percent_mass_2*rho_1)/rho_1/rho_2/Math.pow(porosity,2)*void_function(porosity, model_number)/R;
	return pdrop;

}
