const _ = require('underscore');
const fs = require('fs');
const Etcd = require('node-etcd');
const register = require('./lib/register.js');
const setEnv = require('./lib/setEnv.js');
const discover = require('./lib/discover.js');

module.exports = function(opts) {

	if (_.isUndefined(opts)) {
		opts = {};
	}

	const url = opts.url || null;
	delete opts.url

	const etcd = new Etcd(url, opts);

	return {

		register: function(namespace, serviceName, config, opts) {
			register(namespace, serviceName, config, opts, etcd)
		},

		service: function(namespace, serviceName) {
			return discover.service(namespace, serviceName, etcd)
		},

		getEnv: function(namespace, envName) {
			return discover.env(namespace, envName, etcd)
		},

		setEnv: function(namespace, envName, value, callback) {
			return setEnv(namespace, envName, value, etcd, callback)
		}

	}

}