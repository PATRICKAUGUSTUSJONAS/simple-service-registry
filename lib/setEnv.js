const _ = require('underscore');

module.exports = function(namespace, envName, value, etcd, callback) {
	
	namespace = namespace.replace(/[^a-z0-9-_]+/gi, '-');
	envName = envName.replace(/[^a-z0-9-_]+/gi, '-');

	var key = `/root/${namespace}/env/${envName}`

	etcd.set(key, JSON.stringify(value), function(err, data) {

		if (_.isFunction(callback)) {
			return callback(err, data);
		}

	});		

}