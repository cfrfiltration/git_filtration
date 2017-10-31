/**
 * The X Window Object
 *
 * THis object is used to maintian a javascript window inside of a page
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 * @version 0.2.0
 */
 
function XWindow() {
	this.windows = new Array();
	this.currentWindow = "";
}
XWindow.prototype = {
	setWindowContent: function(divId, content) {
		document.getElementById(divId+'_content').innerHTML = content;
	},
	__isCreated: function(div) {
		for(x in this.windows) {
			if(this.windows[x] == div)
				return true;
		}
		return false;
	},
	create: function(name, div) {
		if(!this.__isCreated(div)) {
			this.windows.push(div);
			var obj = document.getElementById(div);
			if(obj.firstChild == undefined || obj.firstChild.id != div+"_titleBar") {
				obj.className = "XWindow";
				obj.innerHTML = "<div id=\""+obj.id+"_container\" style=\"margin-bottom: 30px;\">"
					+"<div id=\""+obj.id+"_titleBar\" class=\"XWindowTitleBar\">"
					+"<table border=\"0\" style=\"width:100%\" ><tr><td align=\"left\">"
					+"<span class=\"WindowTitleBarTitle\">"+name+"</span></td>"
					+"<td id=\"XWindowTitleBarActions\"><span class=\"WindowTitleBarActions\">"
/*					+"<a href=\"javascript:void(0);\" onclick=\"XWindow.minimize('"+div+"');\">_</a>&nbsp;"
					+"<a href=\"javascript:void(0);\" onclick=\"XWindow.maximize('"+div+"');\">O</a>&nbsp;" */
					+"<a href=\"javascript:void(0);\" onclick=\"XWindow.close('"+div+"');\">X</a>&nbsp;"
					+"</span>"
					+"</td></tr></table>"
					+"</div>"
					+"<div id=\""+obj.id+"_content\" class=\"XWindowContent\">"
					+obj.innerHTML
					+"</div>";
					+"</div>";
			}
			obj.style.display = "block";
			
			// Add focus listener
			Event.observe(div, "click", function() { eval("XWindow.focus('"+div+"');"); });
			
			// Make window dragable
			new Draggable(div, {handle: div+"_titleBar"} );	
		}
		
		this.maximize(div);
		setTimeout("XWindow.focus('"+div+"')", 50);
	},
	minimize: function (divId) {
		document.getElementById(divId+'_content').style.display = "none";
	},
	maximize: function (divId) {
		document.getElementById(divId+'_content').style.display = "block";
	},
	close: function (divId) {
		for(x in this.windows) {
			if(this.windows[x] == divId) {
				this.windows.splice(x, 1);
				break;
			}
		}
		obj = document.getElementById(divId);
		obj.innerHTML = document.getElementById(divId+"_content").innerHTML;
		obj.style.display = "none";
		glbl_PDropGraphDisplay = 0; //global variable identifying whether the cake pressure drop graph is being displayed.
		glbl_GraphDisplay = 0; //global variable identifying whether any graph in 'filter analysis' is being displayed.
	},
	focus: function (divId) {
		try { 
			if(this.currentWindow != "")
				document.getElementById(this.currentWindow).style.zIndex = "1"; 
		} catch(e) {
			alert("Exception: "+e);
		}
		document.getElementById(divId).style.zIndex = "2";
		this.currentWindow = divId;
	}
}

var XWindow = new XWindow();
