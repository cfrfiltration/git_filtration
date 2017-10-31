/**This function plots the filter pressure drop vs pleat density.**/

var glbl_PDropGraphDisplay = 0; //global variable identifying whether the pressure drop graph is being displayed.

function loadGraph() {
	
	t = parseFloat(document.form1.thickness.value);
	k = parseFloat(document.form1.permeability.value);
	L = parseFloat(document.form2.pleatHeight.value);
	Q = parseFloat(document.form2.flowRate.value);
	Length = parseFloat(document.form2.panelLength.value);
	Width = parseFloat(document.form2.panelWidth.value);
	pleatden_l = parseFloat(document.form2.pleatDen_LL.value);
	pleatden_u = parseFloat(document.form2.pleatDen_UL.value);
	pressureUnits = parseInt(document.form2.pressureUnits.value);
	if (document.form2.highFlow.checked == true) {
		c1 = parseFloat(document.form2.c1.value);
		c2 = parseFloat(document.form2.c2.value);
		m1_k = parseFloat(document.form2.m1_k.value);
		m1_p = parseFloat(document.form2.m1_p.value);
		m2_k = parseFloat(document.form2.m2_k.value);
		m2_p = parseFloat(document.form2.m2_p.value);
	}

	//Flowrate unit conversion
	switch (parseInt(document.form2.flowrateUnit.value))
	{
	  case 1: break; //lpm
	  case 2: {
	    Q = 28.3168*Q; //cfm to lpm
	    break;
	  }
	  case 3: {
	    Q = Q/60*1000; //m3/h to lpm
	    break;
	  }
	}

	//Check the range of input values
	flag = 0;
	if (t <= 0) {
		alert("Invalid input: 'Filter medium thickness' should be greater than 0!");
		flag = 1;
	}
	if (k <= 0) {
		alert("Invalid input: 'Filter medium permeability' should be greater than 0!");
		flag = 1;
	}
	if (L <= 0) {
		alert("Invalid input: 'Pleat height' should be greater than 0!");
		flag = 1;
	}
	if (Q <= 0) {
		alert("Invalid input: 'Flow rate' should be greater than 0!");
		flag = 1;
	}
	if (Length <= 0) {
		alert("Invalid input: 'Panel length' should be greater than 0!");
		flag = 1;
	}
	if (Width <= 0) {
		alert("Invalid input: 'Panel width' should be greater than 0!");
		flag = 1;
	}
	if (pleatden_l <= 0) {
		alert("Invalid input: 'Pleat density lower limit' should be greater than 0!");
		flag = 1;
	}
	if (pleatden_u <= 0) {
		alert("Invalid input: 'Pleat density upper limit' should be greater than 0!");
		flag = 1;
	}
	if (pleatden_u <= pleatden_l) {
		alert("Invalid input: 'Pleat density upper limit' should be greater than 'Pleat density lower limit'!");
		flag = 1;
	}
	if (document.form2.highFlow.checked == true && document.form2.pleatShape.value == 1) {
		alert("Invalid input: 'High flowrate mode' is applicable to triangular pleat only!");
		flag = 1;
	}

	//Add data points and draw graph
	if (flag == 0) {
		if (glbl_PDropGraphDisplay == 1) {
			XWindow.close("windowContainer");
		}
		var SLG = new SimpleLineGraph("Pleated Filter Pressure Drop");
				
		switch (pressureUnits)
		{
	  	case 1:
	    	SLG.axis.yLabel = "P Drop";
	    	SLG.axis.yLabel2 = "(mmH20)";
	    	break;
	  	case 2:
	    	SLG.axis.yLabel = "P Drop (Pa)";
	    	break;
		}

		SLG.axis.xLabel = "Pleat Density (#/100 mm)";
		if (document.form2.pleatShape.value == 1)
		{
		    var ds = new SimpleLineGraph.DataSet("Rectangular Pleat");
		}
		else if (document.form2.pleatShape.value == 2 && document.form2.highFlow.checked == false)
		{
		    var ds = new SimpleLineGraph.DataSet("Triangular Pleat");
		}
		else if (document.form2.pleatShape.value == 2 && document.form2.highFlow.checked == true)
		{
		    var ds = new SimpleLineGraph.DataSet("Triangular Pleat High Flow");
		    SLG.legend.width = 200;
			SLG.legend.offsety = 100;
		}
		
		for(n = Math.round(pleatden_l); n <= Math.round(pleatden_u); n++) {
			v_0 = 10/(2*n); //v_0 = W
			if (document.form2.pleatShape.value == 1) /*Rectangular pleat*/
			{
			    pdrop = DP_pleat_rec(t, k, L, v_0, Q, Length, Width);
			}
			else if (document.form2.pleatShape.value == 2 && document.form2.highFlow.checked == false) /*Triangular Pleat*/
			{
			    pdrop = DP_pleat_tri(t, k, L, v_0, Q, Length, Width);
			}
			else if (document.form2.pleatShape.value == 2 && document.form2.highFlow.checked == true)
			{
			    pdrop = DP_pleat_tri_high(t, k, L, v_0, Q, Length, Width, c1, c2, m1_k, m1_p, m2_k, m2_p);
			}
			/*If units requested are in Pa, multiply by 9.80665 to go from mmH20 to Pa*/
			if (pressureUnits == 2) //if they are in panelLength
			{
				pdrop = pdrop * 9.80665;
			}
			
			pdrop = Math.round(pdrop*100) / 100;
			ds.addPoint(n, pdrop);
		}
	
		$("windowContainer").innerHTML = "";
		XWindow.create("Pleated Filter Pressure Drop", "windowContainer");
		XWindow.maximize("windowContainer");
		ds.color = "#CC0000";
		ds.size = 2;
		SLG.addDataSet(ds, true);
		SLG.legend.offsetx = -100;
		SLG.draw("windowContainer", 500, 400, 150, 430);

		glbl_PDropGraphDisplay = 1;
	}
		
}

/**This function is used to select the parameters of filter media.**/

function selectFilter () {

	switch (parseInt(document.form1.filterMedium.value))
	{
	  case 1: {
	    document.form1.permeability.value = 6.095E-9;
	    document.form1.permea_frazier.value = 1359460000*6.095E-13/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 2: {
	    document.form1.permeability.value = 7.245E-9;
	    document.form1.permea_frazier.value = 1359460000*7.245E-13/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 3: {
	    document.form1.permeability.value = 7.68E-9;
	    document.form1.permea_frazier.value = 1359460000*7.68E-13/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 4: {
	    document.form1.permeability.value = 1.038E-8;
	    document.form1.permea_frazier.value = 1359460000*1.038E-12/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 5: {
	    document.form1.permeability.value = 1.256E-8;
	    document.form1.permea_frazier.value = 1359460000*1.256E-12/0.46E-3;
	    document.form1.thickness.value = 0.046;
	    break;
	  }
	  case 6: {
	    document.form1.permeability.value = 8.574E-9;
	    document.form1.permea_frazier.value = 1359460000*8.574E-13/0.28E-3;
	    document.form1.thickness.value = 0.028;
	    break;
	  }
	  case 7: {
	    document.form1.permeability.value = 1.371E-8;
	    document.form1.permea_frazier.value = 1359460000*1.371E-12/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 8: {
	    document.form1.permeability.value = 2.259E-8;
	    document.form1.permea_frazier.value = 1359460000*2.259E-12/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 9: {
	    document.form1.permeability.value = 2.56E-8;
	    document.form1.permea_frazier.value = 1359460000*2.56E-12/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 10: {
	    document.form1.permeability.value = 3.2E-8;
	    document.form1.permea_frazier.value = 1359460000*3.2E-12/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 11: {
	    document.form1.permeability.value = 7.68E-8;
	    document.form1.permea_frazier.value = 1359460000*7.68E-12/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 12: {
	    document.form1.permeability.value = 7.68E-8;
	    document.form1.permea_frazier.value = 1359460000*7.68E-12/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 13: {
	    document.form1.permeability.value = 1.097E-7;
	    document.form1.permea_frazier.value = 1359460000*1.097E-11/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 14: {
	    document.form1.permeability.value = 9.527E-8;
	    document.form1.permea_frazier.value = 1359460000*9.527E-12/0.33E-3;
	    document.form1.thickness.value = 0.033;
	    break;
	  }
	  case 15: {
	    document.form1.permeability.value = 1.097E-7;
	    document.form1.permea_frazier.value = 1359460000*1.097E-11/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 16: {
	    document.form1.permeability.value = 3.335E-7;
	    document.form1.permea_frazier.value = 1359460000*3.335E-11/0.33E-3;
	    document.form1.thickness.value = 0.033;
	    break;
	  }
	  case 17: {
	    document.form1.permeability.value = 3.84E-7;
	    document.form1.permea_frazier.value = 1359460000*3.84E-11/0.38E-3;
	    document.form1.thickness.value = 0.038;
	    break;
	  }
	  case 18: {
	    document.form1.permeability.value = 7.07E-7;
	    document.form1.permea_frazier.value = 1359460000*7.07E-11/0.33E-3;
	    document.form1.thickness.value = 0.033;
	    break;
	  }
	  case 19: {
	    document.form1.permeability.value = 9.6E-9;
	    document.form1.permea_frazier.value = 1359460000*9.6E-13/0.45E-3;
	    document.form1.thickness.value = 0.045;
	    break;
	  }
	  case 20: {
	    document.form1.permeability.value = 5.19E-9;
	    document.form1.permea_frazier.value = 1359460000*5.19E-13/0.26E-3;
	    document.form1.thickness.value = 0.026;
	    break;
	  }
	  case 21: {
	    document.form1.permeability.value = 5.15E-9;
	    document.form1.permea_frazier.value = 1359460000*5.15E-13/0.68E-3;
	    document.form1.thickness.value = 0.068;
	    break;
	  }
	  case 22: {
	    document.form1.permeability.value = 5E-9;
	    document.form1.permea_frazier.value = 1359460000*5E-13/0.33E-3;
	    document.form1.thickness.value = 0.033;
	    break;
	  }
	  case 23: {
	    document.form1.permeability.value = 1.09E-8;
	    document.form1.permea_frazier.value = 1359460000*1.09E-12/0.45E-3;
	    document.form1.thickness.value = 0.045;
	    break;
	  }
	}
	
}

/**This function is used to update the Frazier when permeability or thickness is changed.**/

function updateFrazier() {
	
	t = parseFloat(document.form1.thickness.value);
	k = parseFloat(document.form1.permeability.value);
	document.form1.permea_frazier.value = 1359460000*(k*1E-4)/(t*1E-2);
	
}

/**This function enables or disables high flowrate mode for triangular pleat.**/

function checkHighFlow() {
	
	if (document.form2.highFlow.checked == true) {
		document.form2.c1.disabled = false;
		document.form2.c2.disabled = false;
		document.form2.m1_k.disabled = false;
		document.form2.m1_p.disabled = false;
		document.form2.m2_k.disabled = false;
		document.form2.m2_p.disabled = false;
		document.form2.pleatShape.value = 2;
	}
	else {
		document.form2.c1.disabled = true;
		document.form2.c2.disabled = true;
		document.form2.m1_k.disabled = true;
		document.form2.m1_p.disabled = true;
		document.form2.m2_k.disabled = true;
		document.form2.m2_p.disabled = true;
	}
	
}
