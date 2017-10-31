/**
 * The Error Manager Class
 *
 * This object is used to manage errors created either by user input or
 * by faulty code/browser incapatbilities
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 * @version 0.1.0
 */
 
function ErrorManager() {
	this.errors = new Array();
	this.debug = false;
	
	this.logDebug = function(msg) {
		if(this.debug) this.errors.push("[*** DEBUG ***] "+msg);
	}
	
	this.logError = function(msg) {
		this.errors.push(msg);
	}
	
	this.getErrorArray = function() {
		return this.errors;
	}
	
	this.clearErrors = function() {
		this.errors = new Array();
	}
	
	this.getFormatedHTMLErrors = function() {
		out = "";
		for(i = this.errors.length-1; i >= 0; i--) {
			out = out + "<div class=\"errorMsg\">" + this.errors[i] + "</div>";
		}
		
		return out;
	}
	
	this.throwException = function(msg) { throw msg; }
}

var ErrorManager = new ErrorManager();

function ErrorManager_logUncaughtError(msg, url, line) {
	var cmsg = "Unexpected Exception Caught: ("+msg+") in ("+url+" : "+line+")";
	ErrorManager.logError(cmsg);
}
// set on error event for catching unexpected errors
onerror = ErrorManager_logUncaughtError;