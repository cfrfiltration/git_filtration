/**This formula is used to calculate pressure drop across the dust cake.**/

function pDrop_formula (ldmass, mu, uface, porosity, rho_1, dvg_1, GSD_1, kappa_1, percent_1, rho_2, dvg_2, GSD_2, kappa_2, percent_2) {
	/** units: ldmass (g/cm^2), mu (g/cm*s), uface (cm/s), rho (g/cm^3), dvg (um), 1 inH2O = 249.1 Pa. **/
	percent_1 = percent_1/100;
	percent_2 = percent_2/100;
	percent_mass_1 = percent_1*rho_1*Math.pow(dvg_1,3)/(percent_1*rho_1*Math.pow(dvg_1,3)+percent_2*rho_2*Math.pow(dvg_2,3));
	percent_mass_2 = percent_2*rho_2*Math.pow(dvg_2,3)/(percent_1*rho_1*Math.pow(dvg_1,3)+percent_2*rho_2*Math.pow(dvg_2,3));
	R = (percent_1*Math.pow(dvg_1,3)*Math.exp(4.5*Math.pow(Math.log(GSD_1),2))+percent_2*Math.pow(dvg_2,3)*Math.exp(4.5*Math.pow(Math.log(GSD_2),2)))/(kappa_1*percent_1*dvg_1*Math.exp(0.5*Math.pow(Math.log(GSD_1),2))+kappa_2*percent_2*dvg_2*Math.exp(0.5*Math.pow(Math.log(GSD_2),2)));
	pdrop = 40144.5*18*mu*uface*ldmass*(percent_mass_1*rho_2+percent_mass_2*rho_1)/rho_1/rho_2*10*(1-porosity)/Math.pow(porosity,3)/R;
	return pdrop;

}
