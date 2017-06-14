/* global Module */

/* Magic Mirror
 * Module: ratpschedule
 *
 * By Lucas Martin
 * MIT Licensed.
 */

Module.register("ratpschedule", {


	defaults: {

		baseUrl: "https://api-ratp.pierre-grimaud.fr/v3",

		endpoint: "traffic",

		updateInterval: 5 * 1000,
		animationSpeed: 2.5 * 1000,

		// endpoint: "schedules",
		//
		// type: "rers",
		// code: "A",
		// station: "noisy-champs",
		// way: "A",

	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {

		var self = this;

		this.activeItem = 0,
		this.arrayOfSchedule = [],

		this.getDom();
		// this.getSchedule();

		this.getTraffic();

	},

	getDom: function() {
		var self = this;

		if (this.activeItem >= this.arrayOfSchedule.length) {
			this.activeItem = 0;
		}

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		wrapper.className = "ratpschedule";
		wrapper.innerHTML = "<h3>Statut RATP</h3>";

		var line = document.createElement("p");
		line.className = "bright medium light";

		var message = document.createElement("p");
		message.className = "bright medium light";

		if (this.arrayOfSchedule[this.activeItem] !== undefined) {

			line.innerHTML = `Ligne: ${self.arrayOfSchedule[self.activeItem].line}`;
			message.innerHTML = self.arrayOfSchedule[self.activeItem].message;

		} else {

			message.innerHTML = "Tout fonctionne bien sur la ligne";

		}

		wrapper.appendChild(line);
		wrapper.appendChild(message);

		return wrapper;

	},

	getTraffic: function(){

		this.sendSocketNotification("GET_TRAFFIC", this.defaults);

	},


	/* scheduleUpdateInterval()
	 * Schedule visual update.
	 */
	scheduleUpdateInterval: function() {
		var self = this;

		self.updateDom(self.config.animationSpeed);

		timer = setInterval(function() {
			self.activeItem++;
			self.updateDom(self.config.animationSpeed);
		}, this.config.updateInterval);
	},



	getScripts: function() {
		return [];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("{{MODULE_NAME}}-NOTIFICATION_TEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {

		let self = this;
		// if(notification === "RETURN_SCHEDULE") {
		//
		// 	payload.forEach((e) => {
		//
		// 		let container = document.createElement('p');
		//
		// 		let name = document.createElement('span');
		// 		name.innerHTML = e.code;
		//
		// 		let schedule = document.createElement('span');
		// 		schedule.innerHTML = e.message;
		//
		//
		// 		container.classList.add('schedule__single');
		// 		container.appendChild(name);
		// 		container.appendChild(schedule);
		//
		// 		document.getElementById('ratpschedule').appendChild(container);
		//
		// 	})
		// }


		if (notification === 'RETURN_TRAFFIC') {

			payload.forEach((e) => {


				self.arrayOfSchedule.push(e);

			// 	let container = document.createElement('p');
			//
			// 	let name = document.createElement('span');
			// 	name.innerHTML = `Ligne: ${e.line} - `;
			//
			// 	let schedule = document.createElement('span');
			// 	schedule.innerHTML = e.message;
			//
			//
			// 	container.classList.add('schedule__single');
			// 	container.appendChild(name);
			// 	container.appendChild(schedule);
			//
			// 	document.getElementById('ratpschedule').appendChild(container);
			//
			// })

			});

			this.scheduleUpdateInterval();

		}
	}

});
