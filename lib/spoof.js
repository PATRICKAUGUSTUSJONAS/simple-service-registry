// If we aren't passed a decent looking URL for Etcd
// Then log out an error message
// This is to spoof the event emitters and so on so that the app
// doesn't blow up if this is called blindly. Little hacky.

const events = require('events');

const fail = function() {
	console.error("ERR: Invalid or unexpected value passed to Simple Service Registration module")
}

module.exports = {

	register: function() {
		fail()
	},

	service: function() {
		fail()
		return new events.EventEmitter();
	},

	getEnv: function() {
		fail()
		return new events.EventEmitter();
	},

	setEnv: function() {
		fail()
	}

}
