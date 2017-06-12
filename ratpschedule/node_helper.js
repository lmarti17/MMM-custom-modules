/* Magic Mirror
 * Node Helper: {{MODULE_NAME}}
 *
 * By {{AUTHOR_NAME}}
 * {{LICENSE}} Licensed.
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


		if (notification === "GET_SCHEDULE"){

			this.getSchedule(payload);

		}

		if (notification === "GET_TRAFFIC") {

			this.getTraffic(payload);

		}
	},

	// getSchedule: function(payload){
	//
	// 	let self = this;
	//
	// 	axios.get(`${payload.baseUrl}/${payload.endpoint}/${payload.type}/${payload.code}/${payload.station}/${payload.way}`)
	// 	.then(function (response){
	//
	// 		// console.log(response.data.result);
	// 		let array = [];
	//
	// 		response.data.result.schedules.forEach((e, index) => {
	//
	// 			array[index] = e;
	//
	// 		})
	//
	// 		self.sendSocketNotification("RETURN_SCHEDULE", array);
	//
	// 	})
	// 	.catch(function (error){
	//
	// 		console.log(error);
	// 	})
	//
	// },


	getTraffic: function(payload){

		let self = this;


		axios.get(`${payload.baseUrl}/${payload.endpoint}`)
		.then(function (response){

			// console.log(Object.entries(response.data.result));

			let array = [];

			for (let category in response.data.result){

				// console.log(response.data.result[category]);

				response.data.result[category].forEach((ligne) => {

					if (ligne.slug != "normal") {

						array.push(ligne)

					}
				})

			}

			self.sendSocketNotification("RETURN_TRAFFIC", array);


		})
		.catch(function(error){

			console.log(error);
		})


	},

	// Example function send notification test
	sendNotificationTest: function(payload) {
		this.sendSocketNotification("{{MODULE_NAME}}-NOTIFICATION_TEST", payload);
	},

	// this you can create extra routes for your module
	extraRoutes: function() {
		var self = this;
		this.expressApp.get("/{{MODULE_NAME}}/extra_route", function(req, res) {
			// call another function
			values = self.anotherFunction();
			res.send(values);
		});
	},

	// Test another function
	anotherFunction: function() {
		return {date: new Date()};
	}
});
