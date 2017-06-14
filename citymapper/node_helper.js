/* Magic Mirror
 * Node Helper: citymapper
 *
 * By Lucas Martin
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var axios = require("axios");

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */


	socketNotificationReceived: function(notification, payload) {

		// if (notification === "CITYMAPPER-NOTIFICATION_TEST") {
		// 	console.log("Working notification system. Notification:", notification, "payload: ", payload);
		// 	// Send notification
		// 	this.sendNotificationTest(this.anotherFunction()); //Is possible send objects :)
		// }

		if (notification === "GET_TRAVELTIME") {

			this.getAddressCoords(payload);

		}

		if (notification === "GET_SCHEDULE"){

			this.getSchedule(payload);

		}

	},


	getSchedule: function(payload){

		let self = this;

		axios.get(`${payload.baseUrlRatp}/${payload.endpoint}/${payload.type}/${payload.code}/${payload.station}/${payload.way}`)
		.then(function (response){

			// console.log(response.data.result);
			let array = [];

			response.data.result.schedules.forEach((e, index) => {

				array[index] = e;

			})

			self.sendSocketNotification("RETURN_SCHEDULE", array);

		})
		.catch(function (error){

			console.log(error);
		})

	},


	getAddressCoords: function(payload){

		let self = this;

		axios.get(`${payload.baseUrlGoogleMap}?address=${encodeURIComponent(payload.endCoords)}&key=${payload.apiKeyGoogleMaps}`)
		.then(function (response){

			let lat = response.data.results[0].geometry.location.lat;
			let lng = response.data.results[0].geometry.location.lng;

			let endCoords = `${lat},${lng}`;

			self.getTravelTime(payload, endCoords);

		})
		.catch(function (error){

			console.log(error);

		})

	},

	// Example function send notification test
	sendNotificationTest: function(payload) {
		this.sendSocketNotification("CITYMAPPER-NOTIFICATION_TEST", payload);
	},

	// Test another function
	getTravelTime: function(payload, endCoords) {

		let self = this;

		axios.get(`${payload.baseUrlCityMapper}?startcoord=${encodeURIComponent(payload.startCoords)}&endcoord=${encodeURIComponent(endCoords)}&key=${payload.apiKeyCityMapper}`)
		.then(function (response) {

			self.sendSocketNotification('RETURN-TRAVELTIME', response.data);

			return response;

		})
		.catch(function (error) {
			console.log(error);
		});

	},

});
