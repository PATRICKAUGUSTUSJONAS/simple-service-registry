const _ = require('underscore');
const events = require('events');

// return a watcher for a service key
const service = function(namespace, serviceName, etcd) {

	namespace = namespace.replace(/[^a-z0-9_]+/gi, '-');
	serviceName = serviceName.replace(/[^a-z0-9_]+/gi, '-');

	var key = `/root/${namespace}/services/${serviceName}`;

	return watcher(key, etcd);

}

// return a watcher for an env key
const env = function(namespace, envName, etcd) {

	namespace = namespace.replace(/[^a-z0-9_]+/gi, '-');
	envName = envName.replace(/[^a-z0-9_]+/gi, '-');

	var key = `/root/${namespace}/env/${envName}`;

	const w = watcher(key, etcd);

	// detect value already set
	etcd.get(key, function(err, data) {
		
		if (!err && data) {
			w.emit("set", parseEvent(data))
		}

	})

	return w;

}

// utility function to parse responses from etcd
const parseEvent = function(event) {

	var node = null;

	if (_.isObject(event) && _.isObject(event.node) && _.isString(event.node.value)) {

		try {
			node = JSON.parse(event.node.value);
		}

		catch(e) {
			node = event.node.value;
		}

	}

	return node;

}

// utility function to create a new watcher EventEmitter
const watcher = function(key, etcd) {

	var e = new events.EventEmitter();

	// watch for further updates to this key
	etcd.watcher(key)

	// change events
	.on("change", function(event) {
		e.emit("change", parseEvent(event))
	})

	// set events
	.on("set", function(event) {
		e.emit("set", parseEvent(event))
	})

	// delete events
	.on("delete", function(event) {
		e.emit("delete", parseEvent(event))
	})

	// expiration events
	.on("expire", function(event) {
		e.emit("expire")
	})

	return e;

}

module.exports = {
	service: service,
	env: env
}