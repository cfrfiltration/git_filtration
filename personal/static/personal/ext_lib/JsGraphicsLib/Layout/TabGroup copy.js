/**
 * The Tab Group Object
 *
 * This object maintains a grouping of tabs and useful funtions
 * for interacting with the tab group.
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 * @version 0.2.0
 */
JsLayoutManager.TabGroup = Class.create();

JsLayoutManager.TabGroup.prototype = {
	/**
	 * Constructor
	 * @param String name The name used to reference this tab group
	 * @param String containerId The container div/span tag id attr that will hold the tabs in this group on display
	 */
	initialize: function(name, containerId) {
		this.groupName = name;
		this.groupTabs = new Array();	// An array of tabs that are in the group
		this.groupTabNames = new Array();
		this.groupContainerId = containerId;
		this.length = 0;
		this.activeTab = null;
		
		LayoutManager.registerTabGroup(this);
	},
	/** 
	 * Checks if the givent tab name is a valid tab
	 * @param String tabIter The array index of the tab in question
	 * @return boolean True if the tab is fake False if it is a ligitimate tab
	 */
	_fakeTab: function(tabIter) {
		var tmp = false;
		for(j = this.groupTabNames.length-1; j >= 0; j--) {
			if(tabIter == this.groupTabNames[j] && tabIter != null)
				tmp = true;
		}
		if(tmp == false)
			return true;
			
		return false;
	},
	_applyLayout: function() {
		// create tabs
		var tabs = "";
		for (tabName in this.groupTabs) {
			// Weed out undefineds.....
			if(this._fakeTab(tabName) == false) {
				tabs = tabs + "<div id=\""+this.groupTabs[tabName].tabId+"_"+this.groupContainerId+"\" class=\"tab\""
					+" onclick=\"LayoutManager.invokeTabGroupMethod('"+this.groupName+"', 'setActiveTab', '"+this.groupTabs[tabName].tabName.replace(/\'/g,'\\\'')+"');\">"
					+unescape(this.groupTabs[tabName].tabName)+"</div>";
			}
		}
		
		// apply header and body tags
		document.getElementById(this.groupContainerId).innerHTML = "<div id=\""+this.groupContainerId+"_header\" class=\"tabHeader\">"
				+tabs+"</div>\n"
				+"<div id=\""+this.groupContainerId+"_body\" class=\"tabBodyFocused\">"
				+document.getElementById(this.groupContainerId).innerHTML+"</div>";
	},
	/**
	 * Sets the active tab
	 * @param String tabName The name of the tab object to set as active
	 */
	setActiveTab: function (tabName) {
		try {
			switch(this.groupTabs[tabName].tabId)
			/*Added by Gus Lindquist for CFR application, set global for current system tab*/
			{
				case "systemTab0":
					currentSystem = 0;
					break;
				case "systemTab1":
					currentSystem = 1;
					break;
				case "systemTab2":
					currentSystem = 2;
					break;
			}
			ls_tabId = this.groupTabs[tabName].tabId;
			ls_activeTabId = this.groupTabs[this.activeTab].tabId;
			if ((ls_tabId.slice(0,9) == "systemTab") || initializing) {
				ls_tabIdChanged = ls_tabId;
				ls_activeTabIdChanged = ls_activeTabId;
			} else {
				ls_tabIdChanged = ls_tabId.slice(0,ls_tabId.length - 1) + currentSystem;
				ls_activeTabIdChanged = ls_activeTabId.slice(0,ls_activeTabId.length - 1) + currentSystem;
			}
			
			document.getElementById(ls_tabId).className = "tabBodyFocused";
			document.getElementById(ls_tabId+"_"+this.groupContainerId).className = "tabActive";
			if(tabName != this.activeTab) {
				document.getElementById(ls_activeTabId).className = "tabBodyBlured";
				document.getElementById(ls_activeTabId+"_"+this.groupContainerId).className = "tab";
			}
/*
			document.getElementById(ls_tabIdChanged).className = "tabBodyFocused";
			document.getElementById(ls_tabIdChanged+"_"+this.groupContainerId).className = "tabActive";
			if(tabName != this.activeTab) {
				document.getElementById(ls_activeTabIdChanged).className = "tabBodyBlured";
				document.getElementById(ls_activeTabIdChanged+"_"+this.groupContainerId).className = "tab";
			}
*/
			var alertString = "setActiveTab(" + tabName + "), groupTabs[" + tabName + "] = " + this.groupTabs[tabName].tabId;
			alertString += "\nChange " + ls_tabId + " to " + ls_tabIdChanged;
			alertString += "\nChange " + ls_activeTabId + " to " + ls_activeTabIdChanged;
			//alert(alertString);
			this.activeTab = tabName;
			//alert(tabName + " is active tab");

		} catch (e) {
			alert("error caught: " + e + "\ntabName = " + tabName);
			ErrorManager.logError("Exception caught while setting active tab to '"+tabName+"' exception: "+e);
		}
	},
	/** 
	 * Initializes the tab group
	 */
	draw: function () {
		try {
			this._applyLayout();
		} catch(e) {
			ErrorManager.logError("Error applying layout to tabs, exception: "+e);
			alert("Error applying layout to tabs, exception: "+e);
		}
		
		for (i in this.groupTabs) {
			if(this._fakeTab(i) == false) {
				try {
					document.getElementById(this.groupTabs[i].tabId).className = 'tabBodyBlured';
					if(this.activeTab == null && i != null)
						this.activeTab = i; 
				} catch(e) {
					ErrorManager.logError("Error hidding all panels, exception: "+e);
					alert("Error hidding all panels, exception: "+e);
				}
			}
		}
				
		// set active tab
		try {
				this.setActiveTab(this.activeTab);
		} catch(e) {
			ErrorManager.logError("Error setting active tab to: '"+this.activeTab+"', exception: "+e);
			alert("Error setting active tab to: '"+this.activeTab+"', exception: "+e);
		}
	},
	/**
	 * pushes a new tab object onto the array
	 * @param Tab A tab object
	 */
	addTab: function (tabObj) { 
		if(tabObj.tabId != "undefined") {
			this.groupTabs[tabObj.tabName] = tabObj;
			this.groupTabNames.push(tabObj.tabName);
			this.length++;
		} else {
			throw("Unable to addTab(tabObj) because the tabObj.tabId is undefined!");
			alert("Unable to addTab(tabObj) because the tabObj.tabId is undefined!");
		}
	},
	/**
	 * removes a tab object from the array
	 * @param Tab A tab object
	 * @return boolean True on success, False if the tab object wasn't in array
	 */
	removeTab: function (tabObj) {
		try {
			this.groupTabs.splice(tabObj.tabName, 1);
			this.length--;
			return true;
		} catch(e) {
			ErrorManager.logError("Exception caught while trying to remove a tab '"+tabObj+"' from tabGroup '"+this.groupName+"': "+e);
		}
		return false;
	},
	toString: function() {
		return "Tab Group Name: "+this.groupName+"\n<br />"
			+"Number of tabs: "+this.groupTabs.length+"\n<br />"
			+"Tab Array: "+this.groupTabs.toString()+"\n<br/>";
	}
}
