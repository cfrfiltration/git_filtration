/**
 * The Tab Object
 *
 * This object is used to represnet a single tab. It is in
 * many ways alot like the Panel Object
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 * @version 0.2.0
 */

JsLayoutManager.TabGroup.Tab = Class.create();
 
JsLayoutManager.TabGroup.Tab.prototype = {
	/**
	 * Constructor
	 * @param String name The name of the tab being created
	 * @param String id The id of the div/span object
	 */
	initialize: function(name, id) { 
		this.tabName = name;
		this.tabId = id;
	},
	toString: function() {
		return "Tab Name: "+this.tabName+"\n<br/>"
			+"Tab Object: "+this.tabObj+"\n<br/>";
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
	}
}