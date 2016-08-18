# Simple Service Registry

This module is a wrapper around [Etcd](https://github.com/coreos/etcd), designed to assist with the registration and discovery of consumable microservices and associated configuration.

## Installation and Setup

To install, `npm install simple-service-registry`.

To use:

```javascript
const Registry = require('simple-service-registry')

const r = return new Registry({ 
	url: <Host of Etcd instance>
})
```

### Optional params
This module uses [request](https://github.com/request/request) under the hood so any request parameter can be passed in as part of the options.

If you are using Etcd via [Compose](http://www.compose.com) and want to use the supplied SSL certificate you can do:

```javascript
const Registry = require('simple-service-registry')

const r = return new Registry({ 
	url: <Host of Etcd instance>,
	ca: fs.readFileSync("/path/to.cert.ca")
})
```

Alternatively, if you wish to ignore the SSL requirements, use `strictSSL: false`:

```javascript
const Registry = require('simple-service-registry')

const r = return new Registry({ 
	url: <Host of Etcd instance>,
	strictSSL: false
})
```

## Methods

There are a number of methods to help with the registration and discovery of services and configuration parameters.

### .register( namespace, serviceName, serviceConfig, opts )
The `.register()` method will register a service in Etcd.

* `namespace` is a string that defines a namespace for these services to be collected in (e.g. production, search, crm)
* `serviceName` is a string that defines the name of the service
* `serviceConfig` is a JSON object that defines the configuration needed to consume this service
* `opts` is a JSON object that defines some options for the registration, such as a TTL.

```javascript
const serviceConfig = {
  hostname: "http://search.example.com",
  api_key: "mylittlesecret"
}
r.register("production", "search-api", serviceConfig, { ttl: 30 })
```

The `.register()` method will register this service against Etcd every 10 seconds by default (or by the defined `ttl`). This means that once your app is stopped, the registration will expire within this time frame.

### .service( namespace, serviceName )
The `.service()` method will attempt to discover a service by `serviceName` in a particular `namespace`.

This method returns an EventEmitter with events on:

* `set` - when a service is registered (or re-registered)
* `expire` - when a service registration expires
* `delete` - when a service registration is deleted

```javascript
r.service("production", "search-api")
.on("set", data => {
	// handle set event
})
.on("expire", data => {
	// handle expire event
})
.on("delete", data => {
	// handle delete event
})
```

### .setEnv( namespace, envName, envValue, [callback] )
The `.setEnv()` method will set an environment parameter inside the provided `namespace`.

```javascript
r.setEnv("production", "support-email", "support@example.com", (err, data) => {
	// handle optional callback
});
```

### .getEnv( namespace, envName )
The `.getEnv()` method will attempt to discover environment parameters inside the provided `namespace`.

This method returns an EventEmitter with events on:

* `set` - when a service is registered (or re-registered)
* `expire` - when a service registration expires
* `delete` - when a service registration is deleted

```javascript
r.getEnv("production", "support-email")
.on("set", data => {
	// handle set event
})
.on("expire", data => {
	// handle expire event
})
.on("delete", data => {
	// handle delete event
})
```

## Contributing

The projected is released under the Apache-2.0 license so forks, issues and pull requests are very welcome.