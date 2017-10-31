/**
 * Layout Manager
 *
 * This object handles the layout of the application. It provides
 * advanced interface features to make the project more visually pleasing.
 * 
 * The use of this Manager and it's sub components requires certian CSS styles to exist.
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 * @version 0.2.0
 */
 
JsLayoutManager = Class.create();
 
JsLayoutManager.prototype = {
	initialize: function() {
		this.panels = new Array();
		this.tabGroups = new Array();
	},
	/**
	 * Calls a method in the TabGroup object
	 * @param String gname The name of the tab group to call method on
	 * @param String method The method to invoke
	 * @param mixed param (Optional) an optional parameter the method may require
	 */
	invokeTabGroupMethod: function (gname, method, param) {
		try {
			//alert("gname = " + gname + ", method = " + method + ", param = " + param);
			eval("this.tabGroups[gname]."+method+"(param)");
		} catch(e) {
			ErrorManager.logError("Exception caught while trying to invoke a method '"+method+"' on tab group '"+gname+"'"
				+" with parameter '"+param+"'. Exception: "+e);
		}
	},
	/**
	 * Calls a method in the Panel object
	 * @param String pname The name of the panel to call method on
	 * @param String method The method to invoke
	 * @param mixed param (Optional) an optional parameter the method may require
	 */
	invokePanelMethod: function (pname, method, param) {
		try {
			eval("this.panels[pname]."+method+"(param);");
		} catch(e) {
			ErrorManager.logError("Exception caught while trying to invoke a method '"+method+"' on panel '"+pname+"'"
				+" with parameter '"+param+"'. Exception: "+e);
		}
	},
	/**
	 * Adds a single panel to previously registered panels
	 * @param Panel obj The panel being added (full object)
	 * @return void
	 */
	registerPanel: function (obj) {
		this.panels[obj.panelName] = obj;
	},
	/**
	 * Unregisters a single panel
	 * @param String panelName The Name of the panel to unregister
	 */
	unregisterPanel: function(panelName) { this.panels.splice(panelName, 1); },
	/**
	 * Registers a tab group
	 * @param TabGroup obj The tab gorup being registered (Full object)
	 */
	registerTabGroup: function(obj) {
		this.tabGroups[obj.groupName] = obj;
	},
	/**
	 * Unregisters a single tab group
	 * @param String groupName The Name of the panel to unregister
	 */
	unregisterTabGroup: function(groupName) { this.tabGroups.splice(groupName, 1); }
}

var LayoutManager = new JsLayoutManager();
