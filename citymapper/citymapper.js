/* global Module */

/* Magic Mirror
 * Module: MMM-Citymapper
 *
 * By Lucas Martin
 * MIT Licensed.
 */

Module.register("citymapper", {

    // Default module config.
    defaults: {
        baseUrlCityMapper: 'https://developer.citymapper.com/api/1/traveltime/',
        apiKeyCityMapper: 'f71539b9ac6542bd9f51ccf9972938b7',

        baseUrlGoogleMap:'https://maps.googleapis.com/maps/api/geocode/json',
        apiKeyGoogleMaps: 'AIzaSyB44n9v_Pq3ZlxhBy8VG0kdap39lCSFPnM',

        startCoords: '48.851514599999994,2.4204328999999998',
        // endCoords: '48.87013489622034, 2.31536865234375',
        endCoords: '2 avenue aristide maillol montigny',


        // Get next trains

        baseUrlRatp: "https://api-ratp.pierre-grimaud.fr/v3",
        endpoint: "schedules",
        type: "rers",
        code: "A",
        station: "noisy-champs",
        way: "A"
    },

    requiresVersion: "2.1.0",

    // Define start sequence.
    start: function() {

      Log.info('LE MODULE SE LANCE');

      var self = this;

      this.getDom();
      this.getSchedule();
      // this.getTravelTime();

    },

    getDom: function() {
      var self = this;

      // create element wrapper for show into the module
      var wrapper = document.createElement("div");
      wrapper.id = "citymapper";
      wrapper.className = "citymapper";
      wrapper.innerHTML = `<h3 class="title">Prochains horaires à partir de ${this.config.station}</h3>`;

      return wrapper;
    },

    getSchedule: function(){

      this.sendSocketNotification("GET_SCHEDULE", this.defaults);

    },


    getTravelTime: function() {

      // document.getElementById("timer").innerHTML("BONJOUR");
      this.sendSocketNotification("GET_TRAVELTIME", this.defaults);

    },

    // Override socket notification handler.
    socketNotificationReceived: function(notification, payload) {

      // RETURN TRAVEL TIME@
      if (notification === "RETURN-TRAVELTIME") {
        document.getElementById('traveltime').innerHTML = `You'll be at work in ${payload.travel_time_minutes}mn` ;

      }

      // RETURN SCHEDULE
      if(notification === "RETURN_SCHEDULE") {

        payload.forEach((e) => {

          let container = document.createElement('p');

          let name = document.createElement('span');
          name.innerHTML = `${e.code} - `;

          let schedule = document.createElement('span');
          schedule.className = "bright medium light";
          schedule.innerHTML = e.message;


          container.classList.add('schedule__single');
          container.appendChild(name);
          container.appendChild(schedule);

          document.getElementById('citymapper').appendChild(container);

        })

      }
    },

    getScripts: function() {
      return [];
    },

    getStyles: function() {
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

});
