/* global Module */

/* Magic Mirror
 * Module: {{MODULE_NAME}}
 *
 * By {{AUTHOR_NAME}}
 * {{LICENSE}} Licensed.
 */

Module.register("teeths", {
	defaults: {
		updateInterval: 1000,
		retryDelay: 1000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		Log.info("Starting module: " + this.name);

		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getDom();
		this.getData();

	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("p");
		wrapper.id = "timer";
		wrapper.innerHTML = "02<span class='point'>:</span>00";

		return wrapper;
	},

	getData: function() {
		var min = 1;
	    var sec = 59;

		var timer = setInterval(function(){

	       sec--;

	       document.getElementById("timer").innerHTML = min +" <span class='point'>:</span> " + sec ;

	       if (min == 00 && sec == 00) {
	       		clearInterval(timer);
	       		document.getElementById("timer").className += "final-message";
	       		document.getElementById("timer").innerHTML = "TEETH BRUSHED !";
	        }
	        else{
	        	if(min < 10 && sec < 10){
			    	document.getElementById("timer").innerHTML = "0" + min +" <span class='point'>:</span> " + "0" + sec ;
			    }
		       else if(min < 10 && sec > 9){
		    		document.getElementById("timer").innerHTML = "0" + min +" <span class='point'>:</span> " + sec ;
		       }
	        }

	       if(sec == 00) {
	         min--;
	         sec = 59;
	       }
	     },1000);
	},

	getScripts: function() {
		return [];
	},

	getStyles: function() {
		return ["teeths.css"];
	},
	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

});
