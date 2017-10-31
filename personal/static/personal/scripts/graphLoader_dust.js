/**This is the loading function for pressure drop graph.**/

var glbl_PDropGraphDisplay = 0; //global variable identifying whether the cake pressure drop graph is being displayed.

function loadGraph() {
	
	mu = parseFloat(document.form1.gasViscosity.value);
	uface = parseFloat(document.form1.faceVelocity.value);
	porosity = parseFloat(document.form1.cakePorosity.value);
	rho_1 = parseFloat(document.form2.particleDensity.value);
	dvg_1 = parseFloat(document.form2.geoMeanDiameter.value);
	GSD_1 = parseFloat(document.form2.geoStdDeviation.value);
	kappa_1 = parseFloat(document.form2.shapeFactor.value);
	percent_1 = parseFloat(document.form2.numPercent.value);
	rho_2 = parseFloat(document.form2.particleDensity2.value);
	dvg_2 = parseFloat(document.form2.geoMeanDiameter2.value);
	GSD_2 = parseFloat(document.form2.geoStdDeviation2.value);
	kappa_2 = parseFloat(document.form2.shapeFactor2.value);
	percent_2 = parseFloat(document.form2.numPercent2.value);

	//Check input value
	flag = 0;
	if (mu <= 0) {
		alert("Invalid input: 'Gas viscosity' should be greater than 0!");
		flag = 1;
	}
	if (uface <= 0) {
		alert("Invalid input: 'Face velocity' should be greater than 0!");
		flag = 1;
	}
	if (porosity <= 0||porosity >= 1) {
		alert("Invalid input: 'Cake porosity' should be between 0 and 1!");
		flag = 1;
	}
	if (rho_1 <= 0||rho_2 <= 0) {
		alert("Invalid input: 'Particle density' should be greater than 0!");
		flag = 1;
	}
	if (kappa_1 < 1||kappa_2 < 1) {
		alert("Invalid input: 'Dynamic shape factor' should be no less than 1!");
		flag = 1;
	}
	if (dvg_1 <= 0||dvg_2 <= 0) {
		alert("Invalid input: 'Volume equivalent diameter' should be greater than 0!");
		flag = 1;
	}
	if (GSD_1 <= 1||GSD_2 <= 1) {
		alert("Invalid input: 'Geometric standard deviation' should be greater than 1!");
		flag = 1;
	}
	if (percent_1 < 0||percent_1 > 100||percent_2 < 0||percent_2 > 100) {
		alert("Invalid input: 'Component percentage' should be between 0 and 100!");
		flag = 1;
	}
	if ((percent_1+percent_2) != 100) {
		alert("Invalid input: The sum of two 'Component percentage' should be 100!");
		flag = 1;
	}

	//Add data points and draw graph
	if (flag == 0) {
		if (glbl_PDropGraphDisplay == 1) {
			XWindow.close("windowContainer");
		}
		var SLG = new SimpleLineGraph("Cake Pressure Drop");
		pressureUnits = parseInt(document.form2.pressureUnits.value);

		switch (pressureUnits)
		{
	  	case 1:
	    	SLG.axis.yLabel = "P Drop (inH20)";
	    	break;
	  	case 2:
	    	SLG.axis.yLabel = "P Drop (kPa)";
	    	break;
	    case 3:
	    	SLG.axis.yLabel = "P Drop (g/cm s^2)";
		}

		SLG.axis.xLabel = "Loading Mass (g/cm^2)";
		var ds = new SimpleLineGraph.DataSet("Cake Pressure Drop");
		voidSelection = parseInt(document.form1.voidSelection.value);
		V = void_function(porosity, voidSelection);
	if ((porosity > 0.9) && (voidSelection == 1)) {
		alert("The Carmen-Kozeny model for the void function isn't recommended for porosities approaching 1.  Try selecting a different void model.");
	}
		//alert("void function = " + V);
		var avgSlope = 0;
		var i = 0;
		for(ldmass = 0; ldmass <= 0.1; ldmass+=0.001) {
			ldmass = Math.round(ldmass*10000) / 10000;
			pdrop = pDrop_formula(ldmass, mu, uface, porosity, rho_1, dvg_1, GSD_1, kappa_1, percent_1, rho_2, dvg_2, GSD_2, kappa_2, percent_2, voidSelection, pressureUnits);
			pdrop = Math.round(pdrop*10000) / 10000;
			ds.addPoint(ldmass, pdrop);
			if (ldmass > 0) {
				avgSlope += pdrop/ldmass;
				i++;
			}
		}
		avgSlope = Math.round(100*avgSlope/i) / 100;
		ds.title = "Slope: " + avgSlope;
		$("windowContainer").innerHTML = "";
		XWindow.create("Cake Pressure Drop Graph", "windowContainer");
		XWindow.maximize("windowContainer");
		ds.color = "#CC0000";
		ds.size = 2;
		SLG.addDataSet(ds, true);
		SLG.draw("windowContainer", 400, 400, 150, 430);

		glbl_PDropGraphDisplay = 1;
	}
		
}
function loadPorosityDiameterGraph() {
	
	mu = parseFloat(document.form1.gasViscosity.value);
	uface = parseFloat(document.form1.faceVelocity.value);
	rho_1 = parseFloat(document.form2.particleDensity.value);
	temp = parseFloat(document.form1.temp.value);
	pressure = parseFloat(document.form1.pressure.value);
	//Check input value
	flag = 0;
	if (mu <= 0) {
		alert("Invalid input: 'Gas viscosity' should be greater than 0!");
		flag = 1;
	}
	if (uface <= 0) {
		alert("Invalid input: 'Face velocity' should be greater than 0!");
		flag = 1;
	}

	//Add data points and draw graph
	if (flag == 0) {
		if (glbl_PDropGraphDisplay == 1) {
			XWindow.close("windowContainer");
		}
		var SLG = new SimpleLineGraph("Porosity vs Diameter (nm)");
		SLG.axis.yLabel = "Porosity";
		SLG.axis.xLabel = "Log(D) (nm)";
		var ds = new SimpleLineGraph.DataSet("Porosity vs D (nm)");
		var i = 0;

		for (logD = 1; logD <= 3; logD+=0.01) {
			knd = logDiffKnudsen(rho_1*1000,Math.pow(10,logD)*1e-9/2,temp,mu/10,pressure);
			xf = logThermalEnergyRatio(rho_1*1000,Math.pow(10,logD)*1e-9/2,uface/100,temp);
			ld_porosity = getPackingData(knd,xf);
			ds.addPoint(logD,ld_porosity);
			i++;
		}

		$("windowContainer").innerHTML = "";
		XWindow.create("Porosity vs Diameter (nm)", "windowContainer");
		XWindow.maximize("windowContainer");
		ds.color = "#CC0000";
		ds.size = 2;
		SLG.addDataSet(ds, true);
		SLG.draw("windowContainer", 400, 400, 150, 430);

		glbl_PDropGraphDisplay = 1;
	}
		
}
function loadPorosityFaceVelGraph() {
	
	mu = parseFloat(document.form1.gasViscosity.value);
	d = parseFloat(document.form2.geoMeanDiameter.value);
	rho_1 = parseFloat(document.form2.particleDensity.value);
	temp = parseFloat(document.form1.temp.value);
	pressure = parseFloat(document.form1.pressure.value);
	//Check input value
	flag = 0;
	if (mu <= 0) {
		alert("Invalid input: 'Gas viscosity' should be greater than 0!");
		flag = 1;
	}

	//Add data points and draw graph
	if (flag == 0) {
		if (glbl_PDropGraphDisplay == 1) {
			XWindow.close("windowContainer");
		}
		var SLG = new SimpleLineGraph("Porosity vs Face Vel (cm/s)");
		SLG.axis.yLabel = "Porosity";
		SLG.axis.xLabel = "Log(Face Vel) (nm)";
		var ds = new SimpleLineGraph.DataSet("Porosity vs U (cm/s)");
		var i = 0;

		for (logU = -2; logU <= 4; logU+=0.01) {
			knd = logDiffKnudsen(rho_1*1000,d*1e-6/2,temp,mu/10,pressure);
			xf = logThermalEnergyRatio(rho_1*1000,d*1e-6/2,Math.pow(10,logU)/100,temp);
			ld_porosity = getPackingData(knd,xf);
			ds.addPoint(logU,ld_porosity);
			i++;
		}

		$("windowContainer").innerHTML = "";
		XWindow.create("Porosity vs Face Velocity (nm)", "windowContainer");
		XWindow.maximize("windowContainer");
		ds.color = "#CC0000";
		ds.size = 2;
		SLG.addDataSet(ds, true);
		SLG.draw("windowContainer", 400, 400, 150, 430);

		glbl_PDropGraphDisplay = 1;
	}
		
}
function loadPorosityPressureGraph() {
	
	mu = parseFloat(document.form1.gasViscosity.value);
	uface = parseFloat(document.form1.faceVelocity.value);
	rho_1 = parseFloat(document.form2.particleDensity.value);
	temp = parseFloat(document.form1.temp.value);
	d = parseFloat(document.form2.geoMeanDiameter.value);
	//Check input value
	flag = 0;
	if (mu <= 0) {
		alert("Invalid input: 'Gas viscosity' should be greater than 0!");
		flag = 1;
	}
	if (uface <= 0) {
		alert("Invalid input: 'Face velocity' should be greater than 0!");
		flag = 1;
	}

	//Add data points and draw graph
	if (flag == 0) {
		if (glbl_PDropGraphDisplay == 1) {
			XWindow.close("windowContainer");
		}
		var SLG = new SimpleLineGraph("Porosity vs Pressure (Pa)");
		SLG.axis.yLabel = "Porosity";
		SLG.axis.xLabel = "Log(Pressure) (Pa)";
		var ds = new SimpleLineGraph.DataSet("Porosity vs P (Pa)");
		var i = 0;

		for (logP = 0; logP <= 6; logP+=0.01) {
			knd = logDiffKnudsen(rho_1*1000,d*1e-6/2,temp,mu/10,Math.pow(10,logP));
			xf = logThermalEnergyRatio(rho_1*1000,d*1e-6/2,uface/100,temp);
			ld_porosity = getPackingData(knd,xf);
			ds.addPoint(logP,ld_porosity);
			i++;
		}

		$("windowContainer").innerHTML = "";
		XWindow.create("Porosity vs Pressure (Pa)", "windowContainer");
		XWindow.maximize("windowContainer");
		ds.color = "#CC0000";
		ds.size = 2;
		SLG.addDataSet(ds, true);
		SLG.draw("windowContainer", 400, 400, 150, 430);

		glbl_PDropGraphDisplay = 1;
	}
		
}

//Open a pop-up window showing the pressure drop equations

function PopupWindow() {

        window.open("Pop-up Window/Pop-up_dust.html","_blank","width=800,height=600,top=0,left=0,scrollbars");

}

function PopupVoidDesc() {

        window.open("Pop-up Window/Void_description.html","_blank","width=1024,height=800,top=0,left=0,scrollbars");

}
