/**
 * The Panel Object
 *
 * This is an OO style panel object like in java
 * it is used to represnet objects grouped together
 * in a panel
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 * @version 0.2.0
 */
JsLayoutManager.Panel = Class.create();

JsLayoutManager.Panel.prototype = {
	/**
	 * Constructor
	 * @param String name The name of the panel to create
	 * @param String id The DIV object id
	 */
	initialize: function(name, id) {
		this.panelName = name;
		this.panelId = id;
		this.panelHeader_open = null;
		this.panelHeader_close = null;
		this.clickActionDelay = 
		
		this._applyOpenCloseHeaders();
		LayoutManager.registerPanel(this);
	},
	/**
	 * unregisters panel so it is no longer accessable through layoutmanager
	 * @param String panelName The name of the panel to unregister
	 */
	destroy: function(panelName) { LayoutManager.unregisterPanel(panelName); },
	/**
	 * Used to refresh the open close headers after a change to the panel name or panel object
	 */
	_applyOpenCloseHeaders: function() {
		this.panelHeader = "<div align=\"center\" style=\"display: block;\" onclick=\"LayoutManager.invokePanelMethod('"+this.panelName+"', 'openClose');\" "
			+" onmouseover=\"this.className='panelHeaderHover'\" "
			+" onmouseout=\"this.className='panelHeader'\" class=\"panelHeader\" "
			+"id=\""+this.panelId+"_header\">Expand/Collapse :: "+this.panelName+"</div>";
			
		// Apply header and body wrappers
		document.getElementById(this.panelId).innerHTML = this.panelHeader + "<div id=\""+this.panelId+"_body\" class=\"panelContent\">"+document.getElementById(this.panelId).innerHTML+"</div>";
		this.show();
		this.open();
	},
	/**
	 * Sets a style attribute on the tab
	 * @param String attr The javascript style name being set
	 * @param String val The value to set the attribute to
	 */
	setStyleAttr: function (attr, val) {
		try {
			this.tabObj.style.attr = val;
		} catch(e) {
			ErrorManager.logError("Exception caught trying to set a style attribute on tab '"+this.tabName+"': "+e);
		}
	},
	/**
	 * This method return the panel properties
	 */
	toString: function() {
		return "Panel Name: "+this.panelName+"\n<br/>"
			+"Panel Div Id: "+this.panelId+"\n<br/>"
			+"Panel Div Contents: "+document.getElementById(this.panelId).innerHTML+"\n<br/>";
	},
	/**
	 * This method hides a panel completly, it can only be recovered by javascript call, not the user!
	 */
	hide: function() {
		try {
			document.getElementById(this.panelId).style.display = "none";
		} catch(e) {
			ErrorManager.logError("Unknown Exception Caught in Panel.hide()\n\n<br/><br/>"
			+"Exception: "+e);
		}
	},
	/**
	 * This method shows the parent panel if it has been hidden by the LayoutManager.hide() method
	 */
	show: function() {
		try {
			document.getElementById(this.panelId).style.display = "block";
		} catch(e) {
			ErrorManager.logError("Unknown Exception Caught in Panel.show(): \n\n<br/><br/>Exception: "+e);
		}
	},
	/**
	 * This method opens or closes a panel (expand / collapse)
	 */
	openClose: function () {
		try {
			parentId = this.panelId;
			objHead = document.getElementById(parentId+"_header");
			objBody = document.getElementById(parentId+"_body");
			
			if(objBody.style.display != "none") {
				objBody.style.display = "none";
			} else {
				objBody.style.display = "block";
			}

		} catch(e) {
			try {
				ErrorManager.logError("Unknown exception caught: "+e+"\n\n"
					+"[*** DEBUGGING OUTPUT ***]\n"
					+"Parent Div ID: '"+name+"'\n"
					+"objHead Div ID: '"+objHead.id+"'\n"
					+"objBody Div ID: '"+objBody.id+"'\n"
					+"Display Style: '"+objBody.style.display+"'\n"
					+"Parent Type: '"+document.getElementById(name)+"'\n"
					+"objHead Type: '"+objHead+"'\n"
					+"objBody Type: '"+objBody+"'\n");
		
			} catch (e2) {
				ErrorManager.logError("Debugging output exception!\n\n"
					+"Original Exception: "+e+"\n\n"
					+"Debugging Exception: "+e2);
			}
		}
	},
	/**
	 * This method is just like the openClose method but this will only open, if it is already open  nothing happens!
	 */
	open: function() {
		try {
			if( document.getElementById(this.panelId+"_body").style.display != "block") { // This if statement is required for  IE 6
				document.getElementById(this.panelId+"_body").style.display = "block";
			}
		} catch(e) {
			ErrorManager.logError("Unknown Exception Caught in Panel.open(): "+e);
		}
	},
	/**
	 * This method is just like the openClose method but this will only close , if it is already closed   nothing happens!
	 */
	close: function() {
		try {
			if( document.getElementById(this.panelId+"_body").style.display != "none") { // This if statement is required for IE 6
				document.getElementById(this.panelId+"_body").style.display = "none";
			}
		} catch(e) {
			ErrorManager.logError("Unknown Exception Caught in Panel.close(): "+e);
		}
	},
	/**
	 * This method opens any panels that encapsulate this panel
	 */
	openParents: function() {
		parent_obj = document.getElementById(this.panelId).parentNode;
		while(parent_obj.nodeName != "BODY") {
			if(parent_obj.className == "panel") {
				try {
					if( document.getElementById(parent_obj.id+"_body").style.display != "block") { // This if statement is required for IE 6
						document.getElementById(parent_obj.id+"_body").style.display = "block";
					}
				} catch(e) {
					ErrorManager.logError("Unknown Exception Caught in Panel.openParents(): "+e);
				}
			}
			
			parent_obj = parent_obj.parentNode;
		}
	}
}