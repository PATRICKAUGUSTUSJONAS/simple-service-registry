const _ = require('underscore');

module.exports = function(namespace, serviceName, config, opts, etcd) {
	
	namespace = namespace.replace(/[^a-z0-9-_]+/gi, '-');
	serviceName = serviceName.replace(/[^a-z0-9-_]+/gi, '-');

	var key = `/root/${namespace}/services/${serviceName}`

	if (_.isUndefined(opts)) {
		opts = {};
	}

	if (_.isNumber(opts.ttl) && opts.ttl > 10) {
		var interval = opts.ttl - 5;
	}

	else {
		opts.ttl = 10;
		var interval = 5;
	}

	const doRegister = function() {
		
		etcd.set(key, JSON.stringify(config), { ttl: opts.ttl }, function(err, data) {

			if (err) {
				console.log(err.errors);
				return console.log(`Failed to register @ ${key}`)
			}

			return console.log(`Registered @ ${key}`)

		});
		
	}

	doRegister();
	setInterval(doRegister, (interval * 1000));			

}