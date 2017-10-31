/**
 * The User Interface Loader Functions
 */

var glbl_eff = [ [], [], [] ]; // e.g. refer to glbl_eff[currentSystem][i]
var glbl_pressureDrop = [ [], [], [] ]; // e.g. refer to glbl_pressureDrop[currentSystem][i]
var glbl_fmerit = [ [], [], [] ]; // e.g. refer to glbl_fmerit[currentSystem][i]
var glbl_GraphDisplay = 0;
//var glbl_eff = new Array(); // do NOT modify this variable
//var glbl_pressureDrop = new Array(); 
//var glbl_fmerit = new Array(); // do not Modify this variable.
//var glbl_GraphDisplay = 0; //global variable identifying whether any graph is being displayed.

// Removes a FilterLayer based on the input ID
function removeTab(layerId) {
	var newArr = [];
	for(i=cfg['systems'][currentSystem].length-1; i >= 0; i--) {
		if(i!=layerId)
			newArr.push(cfg['systems'][currentSystem][i]);
	}
	cfg['systems'][currentSystem] = [];
	
	newArr.reverse();
	
	cfg['systems'][currentSystem] = newArr;
	glbl_eff[currentSystem] = [];
	glbl_pressureDrop[currentSystem] = [];
	glbl_fmerit[currentSystem] = [];
	loadInputGUI(currentSystem);
}

function log10(val) {
	return Math.log(val) / Math.LN10;
}

function addTab(layerName) {
	if(layerName == "") {
		alert("Cannot add a layer without a name!");
		return;
	}
	
	for(i=cfg['systems'][currentSystem].length-1; i>=0; i--) {
		if(cfg['systems'][currentSystem][i].title == layerName) {
			alert("Cannot add duplicate layer names!");
			return;
		}
	}
	//alert($('newLayerName').value);
	cfg['systems'][currentSystem].push(new FilterLayer($('newLayerName').value, currentSystem));
	loadInputGUI(currentSystem);
}

// Defines input ids as 'constant_$symbol_layer_$layerId'
function generateConstantInputForm(layerId, li_system) {
        var greek=[];
        greek['T']="&tau;";
        greek['alpha']="&alpha;";
        greek['fs']="fs";
	var out = "<div class=\"constantContainer\">\n";
	out += "\t<strong>Filter Parameters</strong><br />\n";
	out += "<table>\n";
	for(i in cfg['constants']) {
		tmp = cfg['constants'][i];
		if(tmp instanceof DepositionMechanism.Constant) {
			if(!tmp.f_mutable) continue;
			out += "\t<tr><td><input type=\"text\" id=\""+tmp.description.replace(/ /g,'')+"Symbol\"value=\""+greek[i]+"\" readOnly=true size=2/></td>"
					+"<td><input type=\"text\" id=\"constant_"+tmp.symbol+"_system_" + li_system + "layer_"+layerId+"\" size=\"3\" value=\""+tmp.value+"\" /></td><td>"+tmp.units+"</td></tr>\n";
		}
	}
	out += "</table>\n";
	out += generateConstantsLegend();
	out += "</div>\n";
	//alert(out);
	return out;
}


//Open a pop-up window showing deposition mechanism equations
function PopupWindow() {
        window.open("Pop-up Window/Pop-up.html","_blank","width=820,height=600,top=0,left=0,scrollbars");
}


// Requires a DepositionMechanism Object loaded with formulae
// radio buttons named via 'dmForumula_$layerId_$dmId' with value $formulaId
function generateDepositionMechanismFormulaSelection(dm, dmId, layerId) {
	var leftString, myType, myDesc;
	var out = "<div class=\"depositionMechanismFormulaSelectionContainer\">\n";
	out += "\t<strong>"+dm.title+"</strong><br />\n";
	for(i=dm.formulae.length-1; i>=0; i--) {
		leftString = dm.formulae[i].title;
		leftString = leftString.substr(0,10);
		myType = "\"radio\"";
		myDesc = dm.formulae[i].title;
		if (leftString == "Nucleopore") {
			myType = "\"hidden\"";
			myDesc = "";
		}
              if(i==0)
		out += "\t<label><input type=" + myType + " value=\""+i+"\" name=\"dm"+dmId+"\" id=\"dmId"+dmId+"_"+i+"\" checked />"+dm.formulae[i].title+"&nbsp;<input type=\"button\" value=\"Show\" Onclick=\"PopupWindow()\" /></label><br />\n";
              else
                out += "\t<label><input type=" + myType + " value=\""+i+"\" id=\"dmId"+dmId+"_"+i+"\" name=\"dm"+dmId+"\" />"+myDesc+"</label><br />\n";
	}
	
	out += "</div>\n";
	
	return out;
}

// Generates a legend for all of the constants defined in the staticConfig.js
function generateConstantsLegend() {
        var greek=[];
        greek['T']="&tau;";
        greek['alpha']="&alpha;";
        greek['fs']="fs";
	var out = "<table id=\"constantsLegend\">\n"
			+"\t<tr><th colspan=\"2\">Legend</th></tr>\n";
	
	for(i in cfg['constants']) {
		tmp = cfg['constants'][i];
		if(tmp instanceof DepositionMechanism.Constant) {
			if(!tmp.f_mutable) continue;
			out += "\t<tr><th><input type=\"text\" id=\""+tmp.description.replace(/ /g,'')+"LegendSymbol\"value=\""+greek[i]+"\" readOnly=true size=2/></th><td><input type=\"text\" id=\""+tmp.description.replace(/ /g,'')+"Desc\"value=\""+tmp.description+"\" readOnly=true size=10/></td></tr>\n";
		}
	}
	out += "</table>\n";
	
	return out;
}

function loadInitialInputGUI() {
	for(var i = 0; i <= 2; i++) {
		loadInputGUI(i);
	}
}

function setPressure(li_pressureUnits, ld_pressure) {
	//li_pressureUnits:
	//1 = psi
	//2 = atm
	//3 = kPa
	//cfg['constants']['pre'] should be in PSI units
	var ld_pressurePSI = ld_pressure;
	if (li_pressureUnits == 1) {
		ld_pressurePSI = ld_pressure;
	} else if (li_pressureUnits == 2) {
		ld_pressurePSI = ld_pressure * 14.6979488;
	} else if (li_pressureUnits == 3) {
		ld_pressurePSI = ld_pressure / 6.89475729;
	}
	cfg['constants']['pre'].value=ld_pressurePSI;
}

function setTemp(li_tempUnits, ld_temp) {
	//li_tempUnits:
	//1 = K
	//2 = C
	//3 = F
	//cfg['constants']['temp'] should be in K
	var ld_tempK = ld_temp;
	if (li_tempUnits == 1) {
		ld_tempK = ld_temp;
	} else if (li_tempUnits == 2) {
		ld_tempK = (ld_temp*1) + 273.15;
	} else if (li_tempUnits == 3) {
		ld_tempK = (ld_temp - 32)*(5/9) + 273.15;
	}
	cfg['constants']['temp'].value=ld_tempK; 
}
function loadInputGUI(li_system) {
	var clearHtml = "<div style=\"clear:both;\">&nbsp;</div>";
	var tabs = [];
	//alert("for system " + li_system + ", length = " + cfg['systems'][li_system].length);
	for(i123=cfg['systems'][li_system].length-1; i123>=0; i123--) {
		tabs.push(new JsLayoutManager.TabGroup.Tab(cfg['systems'][li_system][i123].title, i123));
		//alert("pushing onto JsLayoutManager.TabGroup.Tab(" + cfg['systems'][li_system][i123].title + ", " + i123);
		html = "<form name=\"system" + li_system + "layer"+i123+"\"><table><tr>";
		html += "<td style=\"vertical-align:top\">"+generateConstantInputForm(i123, li_system)+"</td><td style=\"vertical-align:top\">";
		for(j=cfg['depositionMechanisms'].length-1; j>=0; j--) {
			html += generateDepositionMechanismFormulaSelection(cfg['depositionMechanisms'][j], j, i123);
		}
		html += generateDepositionMechanismFormulaSelection(cfg['pressure'], "pressure", i123);
		html += "</td></tr></table></form>";
		removeLink = "<div style=\"text-align: right\"><a href=\"javascript:void(0);\" onclick=\"removeTab("+i123+")\">remove layer (X)</a></div>";
		html = removeLink + clearHtml + html + clearHtml;
		tabs[tabs.length-1].html = html;
		//ErrorManager.logDebug("Adding Tab("+i+"): " + tabs[tabs.length-1].tabName);
	}
	// Add Pressure Selection Box

	$("systemTab" + li_system).innerHTML = "<br />";
	//$("mainContainer").innerHTML = "<br />";
	loadTabGroupUI(tabs, "systemTab" + li_system, li_system);
}

function loadNewTabGroupUI(tabPanelId) {
	var tabs = [];
	var tabGroup = new JsLayoutManager.TabGroup('Filter Systems', tabPanelId);
	for(var i=0; i<=2; i++) {
		tabs.push(new JsLayoutManager.TabGroup.Tab("Filter " + (i + 1), i));
		tabs[i].tabId = "systemTab" + i;
		tabs[i].parentNumber = i;
		tabGroup.addTab(tabs[i]);
		cfg['systems'][i].pop();//it just keeps getting better and better.
		//the pop() is here because somewhere in setting up the system tabs, an extra layer was getting thrown
		//on the array, causing bad results.  This fixes it.  I hope.
	}
	tabGroup.draw();
	initializing = false;
}

// Requres JsLayoutManager.Tab with a dynamic parameter 'html' which will contain the contents of that tab in HTML.
function loadTabGroupUI(tabs, canvasId, li_system) {
	//groupId = "tabGroup"+Math.floor(Math.random()*100001);
	groupId = "tabGroup" + li_system;
	tabGroup = new JsLayoutManager.TabGroup('Filter Layers', groupId);
	var out = "<div id=\""+groupId+"\" class=\"tabGroup\">\n";

	// traverse the slow way to maintain order without reverse operation on array
	for(i = tabs.length-1; i>=0; i--) {
		out += "\t<div id=\"tab"+i+"_"+groupId+"\" class=\"tabPanel\">\n";
		out += "\t\t"+tabs[i].html+"\n";
		out += "<p><a href=\"javascript:void(0);\" onclick=\"loadLayerResultTable("+tabs[i].tabId+", '"+canvasId+"', true, currentSystem)\">Load Result Table</a></p>";
		out += "\t</div>\n";
		tabs[i].tabId = "tab"+i+"_"+groupId;
		tabGroup.addTab(tabs[i]);
	}
	out += "</div>\n";
	$(canvasId).innerHTML += out;
	//$("mainContainer").innerHTML += out;
	tabGroup.draw();
}

function loadLayerResultTable(layerId, canvasId, display, li_system) {
	if(!validateLayerInputs(layerId))
		return;
	// load constants into array
	for(i in cfg['constants']) {
		if(cfg['constants'][i] instanceof DepositionMechanism.Constant) {
			if(cfg['constants'][i].f_mutable)
				cfg['constants'][i].value = parseFloat($('constant_'+i+'_system_' + li_system + 'layer_'+layerId).value);
		}
	}


	// Load Deposition Mechanisms
	for(i=cfg['depositionMechanisms'].length-1; i>=0; i--) {
		cfg['depositionMechanisms'][i].activeFormulaId = null;
		collection = eval("document.system" + li_system + "layer"+layerId+".dm"+i);
		// if(collection instanceof NodeList) {
		if (collection.length>0 && typeof(collection[0].checked)=='boolean') {
			for(j=collection.length-1; j>=0; j--) {
				if(collection[j].checked) {
					cfg['depositionMechanisms'][i].activeFormulaId = parseInt(collection[j].value);
				}
			}
		} else if(collection instanceof HTMLInputElement) {
			cfg['depositionMechanisms'][i].activeFormulaId = parseInt(collection.value);
		}
		if(cfg['depositionMechanisms'][i].activeFormulaId==null) {
			alert("You have forgotten to select one or more deposition mechanisms to use.");
			break;
		}
	}
	
	// Load Pressure Drop Equation
	cfg['pressure'].activeFormulaId = null;
	collection = eval("document.system" + li_system + "layer"+layerId+".dmpressure");
	// if(collection instanceof NodeList) {
	if (collection.length>0 && typeof(collection[0].checked)=='boolean') {
		for(j=collection.length-1; j>=0; j--) {
			if(collection[j].checked) {
				cfg['pressure'].activeFormulaId = parseInt(collection[j].value);
			}
		}
	} else if(collection instanceof HTMLInputElement) {
		cfg['pressure'].activeFormulaId = parseInt(collection.value);
	}
	if(cfg['pressure'].activeFormulaId==null)
		alert("You have not choosen a Pressure Drop equation.");
	
	// load
	setDependantConstants(cfg['constants']);
	
	
	glbl_pressureDrop[li_system].push(new function() { this.layerId = null; this.value = null; });
	glbl_pressureDrop[li_system][glbl_pressureDrop[li_system].length-1].layerId = layerId;
	glbl_pressureDrop[li_system][glbl_pressureDrop[li_system].length-1].value = cfg['pressure'].evaluate(null, cfg['constants']);
	
	out = "<strong>Pressure Drop:</strong> " + glbl_pressureDrop[li_system][glbl_pressureDrop[li_system].length - 1].value.toFixed(3) + "&nbsp;Pa  "+" <br />";
	
	// generate table
	out += "<table id=\"system" + li_system + "layer_"+layerId+"_resultTable\" class=\"resultTable\">\n";
	var topThs = "<tr><th>&nbsp;</th>";
	for(j=cfg['depositionMechanisms'].length-1; j>=0; j--)
		topThs += "<th>"+cfg['depositionMechanisms'][j].shortName+"</th>";
	out += topThs + "<th>Eff</th><th>Figure of Merit</th></tr>";
	
	var bodyTds = "";
	//alert("before for");
	for(psize = parseFloat($('minRange').value); psize <= parseFloat($('maxRange').value); psize+=parseFloat($('step').value)) {
		psize = Math.round(psize*10000) / 10000;

		bodyTds += "<tr><th>"+psize+"</th>";
		sum = 0;
		for(j=cfg['depositionMechanisms'].length-1; j>=0; j--) {
			v = cfg['depositionMechanisms'][j].evaluate(psize, cfg['constants']);
			bodyTds += "<td>"+v.toExponential(3)+"</td>";
			sum += v;
		}
		glbl_eff[li_system].push( new function(){ this.layerId = null; this.psize = null; this.value = null;});
		glbl_eff[li_system][glbl_eff[li_system].length-1].layerId = layerId;
		glbl_eff[li_system][glbl_eff[li_system].length-1].psize = psize;
		glbl_eff[li_system][glbl_eff[li_system].length-1].value = (100*(1-Math.exp(-4*cfg['constants']['alpha'].value*cfg['constants']['T'].value*0.1* sum /(3.14*cfg['constants']['fs'].value*0.0001))));
		bodyTds += "<td>"+glbl_eff[li_system][glbl_eff[li_system].length-1].value.toFixed(3)+"%</td>";
		
		glbl_fmerit[li_system].push( new function() { this.layerId = null; this.psize = null; this.value = null; });
		glbl_fmerit[li_system][glbl_fmerit[li_system].length-1].layerId = layerId;
		glbl_fmerit[li_system][glbl_fmerit[li_system].length-1].psize = psize;
		glbl_fmerit[li_system][glbl_fmerit[li_system].length-1].value = -1 * (Math.log(1 - 0.01 * glbl_eff[li_system][glbl_eff[li_system].length-1].value) / cfg['pressure'].evaluate(psize, cfg['constants']));
		bodyTds += "<td>"+glbl_fmerit[li_system][glbl_fmerit[li_system].length-1].value.toExponential(3)+"</td>";
		bodyTds += "</tr>"
	
		ErrorManager.logDebug("Added glbl_eff[" + li_system + "] with layerId: " + glbl_eff[li_system][glbl_eff[li_system].length-1].layerId
			+", particle size: " + glbl_eff[li_system][glbl_eff[li_system].length-1].psize
			+", and value: " +glbl_eff[li_system][glbl_eff[li_system].length-1].value);
	}
	out += bodyTds + "</table>";
	if(display) {
		if (glbl_GraphDisplay == 1) {
			XWindow.close("windowContainer");
		}
		$("windowContainer").innerHTML = out;
		XWindow.create("Result Table--"+cfg['systems'][li_system][layerId].title, "windowContainer");
		XWindow.maximize("windowContainer");
		glbl_GraphDisplay = 1;
	}
}

function loadLayerResultTableNucleopore(layerId, canvasId, display, li_system) {
	if(!validateLayerInputs(layerId))
		return;
	// load constants into array
	for(i in cfg['constants']) {
		if(cfg['constants'][i] instanceof DepositionMechanism.Constant) {
			if(cfg['constants'][i].f_mutable)
				cfg['constants'][i].value = parseFloat($('constant_'+i+'_system_' + li_system + 'layer_'+layerId).value);
		}
	}


	// Load Deposition Mechanisms
	for(i=cfg['depositionMechanisms'].length-1; i>=0; i--) {
		cfg['depositionMechanisms'][i].activeFormulaId = null;
		collection = eval("document.system" + li_system + "layer"+layerId+".dm"+i);
		// if(collection instanceof NodeList) {
		if (collection.length>0 && typeof(collection[0].checked)=='boolean') {
			for(j=collection.length-1; j>=0; j--) {
				if(collection[j].checked) {
					cfg['depositionMechanisms'][i].activeFormulaId = parseInt(collection[j].value);
				}
			}
		} else if(collection instanceof HTMLInputElement) {
			cfg['depositionMechanisms'][i].activeFormulaId = parseInt(collection.value);
		}
		if(cfg['depositionMechanisms'][i].activeFormulaId==null) {
			alert("You have forgotten to select one or more deposition mechanisms to use.");
			break;
		}
	}
	
	// Load Pressure Drop Equation
	cfg['pressure'].activeFormulaId = null;
	collection = eval("document.system" + li_system + "layer"+layerId+".dmpressure");
	// if(collection instanceof NodeList) {
	if (collection.length>0 && typeof(collection[0].checked)=='boolean') {
		for(j=collection.length-1; j>=0; j--) {
			if(collection[j].checked) {
				cfg['pressure'].activeFormulaId = parseInt(collection[j].value);
			}
		}
	} else if(collection instanceof HTMLInputElement) {
		cfg['pressure'].activeFormulaId = parseInt(collection.value);
	}
	if(cfg['pressure'].activeFormulaId==null)
		alert("You have not choosen a Pressure Drop equation.");
	
	// load
	setDependantConstants(cfg['constants']);
	
	
	glbl_pressureDrop[li_system].push(new function() { this.layerId = null; this.value = null; });
	glbl_pressureDrop[li_system][glbl_pressureDrop[li_system].length-1].layerId = layerId;
	glbl_pressureDrop[li_system][glbl_pressureDrop[li_system].length-1].value = cfg['pressure'].evaluate(null, cfg['constants']);
	
	out = "<strong>Pressure Drop:</strong> " + glbl_pressureDrop[li_system][glbl_pressureDrop[li_system].length - 1].value.toFixed(3) + "&nbsp;Pa  "+" <br />";
	
	// generate table
	out += "<table id=\"system" + li_system + "layer_"+layerId+"_resultTable\" class=\"resultTable\">\n";
	var topThs = "<tr><th>&nbsp;</th>";
	for(j=cfg['depositionMechanisms'].length-1; j>=0; j--)
		topThs += "<th>"+cfg['depositionMechanisms'][j].shortName+"</th>";
	out += topThs + "<th>Eff</th><th>Figure of Merit</th></tr>";
	
	var bodyTds = "";
	//alert("before for");
	for(psize = parseFloat($('minRange').value); psize <= parseFloat($('maxRange').value); psize+=parseFloat($('step').value)) {
		psize = Math.round(psize*10000) / 10000;

		bodyTds += "<tr><th>"+psize+"</th>";
		product = 1;
		for(j=cfg['depositionMechanisms'].length-1; j>=0; j--) {
			v = cfg['depositionMechanisms'][j].evaluate(psize, cfg['constants']);
			bodyTds += "<td>"+v.toExponential(3)+"</td>";
			product *= (1-v);
		}
		glbl_eff[li_system].push( new function(){ this.layerId = null; this.psize = null; this.value = null; this.lastPsize = null});
		glbl_eff[li_system][glbl_eff[li_system].length-1].layerId = layerId;
		glbl_eff[li_system][glbl_eff[li_system].length-1].psize = psize;
		if (psize > parseFloat($('step').value)) {
			glbl_eff[li_system][glbl_eff[li_system].length-1].lastPsize = psize - parseFloat($('step').value);
		} else {
			glbl_eff[li_system][glbl_eff[li_system].length-1].lastPsize = psize;
		}
//		glbl_eff[li_system][glbl_eff[li_system].length-1].value = (100*(1-Math.exp(-4*cfg['constants']['alpha'].value*cfg['constants']['T'].value*0.1* sum /(3.14*cfg['constants']['fs'].value*0.0001))));
		glbl_eff[li_system][glbl_eff[li_system].length-1].value = 100*(1-product);
		bodyTds += "<td>"+glbl_eff[li_system][glbl_eff[li_system].length-1].value.toFixed(3)+"%</td>";
		
		glbl_fmerit[li_system].push( new function() { this.layerId = null; this.psize = null; this.value = null; });
		glbl_fmerit[li_system][glbl_fmerit[li_system].length-1].layerId = layerId;
		glbl_fmerit[li_system][glbl_fmerit[li_system].length-1].psize = psize;
		glbl_fmerit[li_system][glbl_fmerit[li_system].length-1].value = -1 * (Math.log(1 - 0.01 * glbl_eff[li_system][glbl_eff[li_system].length-1].value) / cfg['pressure'].evaluate(psize, cfg['constants']));
		bodyTds += "<td>"+glbl_fmerit[li_system][glbl_fmerit[li_system].length-1].value.toExponential(3)+"</td>";
		bodyTds += "</tr>"
	
		ErrorManager.logDebug("Added glbl_eff[" + li_system + "] with layerId: " + glbl_eff[li_system][glbl_eff[li_system].length-1].layerId
			+", particle size: " + glbl_eff[li_system][glbl_eff[li_system].length-1].psize
			+", and value: " +glbl_eff[li_system][glbl_eff[li_system].length-1].value);
	}
	out += bodyTds + "</table>";
	if(display) {
		if (glbl_GraphDisplay == 1) {
			XWindow.close("windowContainer");
		}
		$("windowContainer").innerHTML = out;
		XWindow.create("Result Table--"+cfg['systems'][li_system][layerId].title, "windowContainer");
		XWindow.maximize("windowContainer");
		glbl_GraphDisplay = 1;
	}
}
function loadGraph(systemBooleans,type) {
	var SLG = new SimpleLineGraph("Overall Efficiency");
	SLG.axis.xLabel = "Particle Diameter (um)";
	SLG.axis.yLabel = "Efficiency (%)";
	var ds = [];
	for(var system=0; system <= 2; system++) {
		resetGlobalMaxes();
		if (systemBooleans[system]) {
			ds.push(new SimpleLineGraph.DataSet("Fltr " + (system + 1) + ", MPPS="));
			glbl_eff[system] = [];
			glbl_pressureDrop[system] = [];
			glbl_fmerit[system] = [];
			//alert("layers in system " + system + " = " + cfg['systems'][system].length);
			for(var i333=cfg['systems'][system].length-1; i333>=0; i333--) {
				ErrorManager.logDebug("Processing layer efficiency layer "+i333);
				if (type == 1) {// fibrous
					loadLayerResultTable(i333, "adlksv", false, system);
				} else { //type = 2 is nucleopore
					loadLayerResultTableNucleopore(i333, "adlksv", false, system);
				}
			}
		
	// glbl_eff

			for(psize = parseFloat($('minRange').value); psize <= parseFloat($('maxRange').value); psize+=parseFloat($('step').value)) {
				psize = Math.round(psize*10000) / 10000;
				//val = [];
				var val = 1;
				for(var j=glbl_eff[system].length-1; j>=0; j--) {
					if(glbl_eff[system][j].psize == psize) {
						val *= (1 - 0.01* glbl_eff[system][j].value);
						//ErrorManager.logDebug("Mutiplying Layer("+glbl_eff[system][j].layerId+") with particle size("+glbl_eff[system][j].psize +") and efficiency: " + glbl_eff[systemconsole][j].value + " equaling: " + val);
					}
				}
				val = 1 - val;
				percent = Math.round(val*1000000) / 10000;
				//percent = val * 100;
				ds[ds.length - 1].addPoint(psize, percent);
//				console.log("Adding Point: " + psize);	
			}
		}
	}
	if (glbl_GraphDisplay == 1) {
		XWindow.close("windowContainer");
	}
	$("windowContainer").innerHTML = "";
	XWindow.create("Overall Efficiency Graph", "windowContainer");
	XWindow.maximize("windowContainer");
	for(var i=0; i<= ds.length-1; i++) {
		ds[i].color = systemPlotColor(i);
		ds[i].size = 2;
		ds[i].title += ds[i]._range['x at ymin'];
		SLG.addDataSet(ds[i], true);
	}
	SLG.draw("windowContainer", 400, 400, 150, 430);

	glbl_GraphDisplay = 1;
	glbl_eff[currentSystem] = [];
	
}

function checkedSystems(sys1, sys2, sys3) {
	var systems = [];
	systems.push(sys1);
	systems.push(sys2);
	systems.push(sys3);
	return systems;
}

function systemPlotColor(li_system) {
	if (li_system == 0) {
		var plotColor="#CC0000";
	} else if (li_system == 1) {
		var plotColor="#0000CC";
	} else {
		var plotColor="#00CC00";
	}
	return plotColor;
}

function loadFOMGraph(systemBooleans) {
	var SLG = new SimpleLineGraph("Overall FOM");
	SLG.precisionFactor = 10000;
	SLG.axis.xLabel = "Particle Diameter (um)";
	SLG.axis.yLabel = "FOM (1/Pa)";
	var ds = [];
	//var ds = new SimpleLineGraph.DataSet("Overall FOM");

	for(var system=0; system <= 2; system++) {
		if (systemBooleans[system]) {
			ds.push(new SimpleLineGraph.DataSet("FOM, Filter " + (system+1)));
			glbl_eff[system] = [];
			glbl_pressureDrop[system] = [];
			glbl_fmerit[system] = [];
			for(i333=cfg['systems'][system].length-1; i333>=0; i333--) {
				ErrorManager.logDebug("Processing layer efficiency layer "+i333);
				loadLayerResultTable(i333, "adlksv", false, system);
			}
			sum = 0;
			// load global pressure drop
			for(i222=glbl_pressureDrop[system].length-1; i222 >= 0; i222--) {
				sum += glbl_pressureDrop[system][i222].value;
			}
			//Start loop over systems
			for(var psize = parseFloat($('minRange').value); psize <= parseFloat($('maxRange').value); psize+=parseFloat($('step').value)) {
				psize = Math.round(psize*10000) / 10000;
//				val = [];
				var val = 1;
				for(var j=glbl_eff[system].length-1; j>=0; j--) {
					if(glbl_eff[system][j].psize == psize) {
						val *= (1 - 0.01* glbl_eff[system][j].value);
					}
				}
				val = 1 - val;
				if (val > 0) {
					val = -1 * ( Math.log(1 - val) / sum);
					var percent = Math.round(val*10000000) / 10000000;
//					var percent = Math.round(log10(val)*10000000) / 10000000;
					ds[ds.length-1].addPoint(psize, percent);
				}
			}
		}
	}
	
	if (glbl_GraphDisplay == 1) {
		XWindow.close("windowContainer");
	}
	$("windowContainer").innerHTML = "";
	XWindow.create("Overall FOM Graph", "windowContainer");
	XWindow.maximize("windowContainer");
	for(var i=0; i<= ds.length-1; i++) {
		ds[i].color = systemPlotColor(i);
		ds[i].size = 2;
		SLG.addDataSet(ds[i], true);
	}
	//end loop
	SLG.draw("windowContainer", 400, 400, 150, 430);

	glbl_GraphDisplay = 1;
	glbl_eff[currentSystem] = [];
}


function validateLayerInputs(layerId) {
	if($('minRange').value <= 0) {
		alert("Minimum Range is not defined properly.");
		return false;
	}
	if($('maxRange').value <= 0) {
		alert("Maximum Range is not defined properly.");
		return false;
	}
	if($('step').value <= 0) {
		alert("Step size is not defined properly.");
		return false;
	}
	
	return true;
}

function PopupSample() {

        window.open("images/PDropSample.jpg","_blank","width=446,height=373,top=0,left=0,scrollbars");

}
function setActiveDmEquation(dmId, eqId) {
	cfg['depositionMechanisms'][dmId].activeFormulaId = eqId;
}
