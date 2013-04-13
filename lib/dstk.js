/**
 * node.js Data Science Toolkit module
 * version: 0.0.1 (2013-04-12)
 *
 *
 * This node.js module is a simple way to access the Data Science Toolkit
 * from node.js.
 *
 *
 * Example:
 *
 *  var dstk = require('dstk');
 *
 *  // OPTIONAL: change from default http://www.datasciencetoolkit.org server to custom server
 *  // dstk.apiURL = 'http://localhost:8080';
 *
 *  dstk.info(function (error, data, httpResponse) {
 *      if (!error) {
 *          console.log(data);
 *      }
 *  });
 *
 *
 * License:
 *
 *  Copyright (C) 2013  Fredrik Söderström
 *
 *  This program is free software: you can redistribute it and/or modify it under the terms of the
 *  GNU General Public License as published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 *  without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
 *  the GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along with this program. If
 *  not, see [http://www.gnu.org/licenses/](http://www.gnu.org/licenses/).
 *
 */

/*global module, require*/


var request = require('request'),
	supportedMethods = {
		info: {},
		text2places: {
			alternative: 'textToPlaces',
			acceptsParameters: true,
			httpMethod: 'POST'
		},
		ip2coordinates: {
			alternative: 'ipToCoordinates',
			acceptsParameters: true
		},
		street2coordinates: {
			alternative: 'streetToCoordinates',
			acceptsParameters: true
		},
		coordinates2politics: {
			alternative: 'coordinatesToPolitics',
			acceptsParameters: true
		},
		text2sentences: {
			alternative: 'textToSentences',
			acceptsParameters: true,
			httpMethod: 'POST'
		},
		html2text: {
			alternative: 'htmlToText',
			acceptsParameters: true,
			httpMethod: 'POST'
		},
		html2story: {
			alternative: 'htmlToStory',
			acceptsParameters: true,
			httpMethod: 'POST'
		},
		text2people: {
			alternative: 'textToPeople',
			acceptsParameters: true,
			httpMethod: 'POST'
		},
		text2times: {
			alternative: 'textToTimes',
			acceptsParameters: true,
			httpMethod: 'POST'
		}
	},
	methodName = '';


function DSTK() {
	'use strict';

	this.apiURL = 'http://www.datasciencetoolkit.org';
}

DSTK.prototype.call = function (method, data, callback, httpMethod) {
	'use strict';

	var self = this;

	httpMethod = httpMethod ? httpMethod.toLowerCase() : 'get';
	if (httpMethod === 'get') {
		request(
			this.apiURL + '/' + method + (data ? '/' + encodeURIComponent(data) : ''),
			function (error, response, data) {
				self._handleResult(error, response, data, callback);
			}
		);
	} else {
		request[httpMethod]({
			headers: {'Content-Type' : 'text/plain'},
			url: this.apiURL + '/' + method,
			body: data
		}, function (error, response, data) {
			self._handleResult(error, response, data, callback);
		});
	}
};

DSTK.prototype._stripHTMLTags = function (html) {
	'use strict';

	return html.replace(/<[^>]+>/g, '');
};

DSTK.prototype._handleResult = function (error, response, data, callback) {
	'use strict';

	if (error) {
		data = null;
	} else {
		try {
			data = JSON.parse(data);
		} catch (exception) {
			error = new Error(this._stripHTMLTags(data));
			error.code = response.statusCode;
			error.errno = response.statusCode;
			data = null;
		}

		if (!error && response.statusCode < 200 && response.statusCode >= 300) {
			error = new Error(this._stripHTMLTags(data));
			error.code = response.statusCode;
			error.errno = response.statusCode;
			data = null;
		}
	}

	callback(error, data, response);
};

DSTK.prototype._parametersToText = function (parameters) {
	'use strict';

	if (parameters) {
		if (typeof parameters === 'object') {
			parameters = JSON.stringify(parameters);
		}
	}

	return parameters;
};

DSTK.prototype._getFittingHTTPMethodForParameters = function (parameters) {
	'use strict';

	var method = 'get';

	if (parameters.length >= 7500) {
		method = 'post';
	}

	return method;
};

DSTK.prototype._addMethod = function (methodName, methodParameters) {
	'use strict';

	var self = this,
		httpMethod = '';

	// Add method to this objects prototype
	if (methodParameters.acceptsParameters) { // If method accepts parameters
		self[methodName] = function (parameters, callback) {
			parameters = self._parametersToText(parameters);

			if (methodParameters.httpMethod) {
				httpMethod = methodParameters.httpMethod;
			} else {
				httpMethod = self._getFittingHTTPMethodForParameters(parameters);
			}

			self.call(methodName, parameters, callback, httpMethod);
		};
	} else { // If method does not accept parameters
		self[methodName] = function (callback) {
			self.call(methodName, null, callback);
		};
	}

	// Add alternative method name
	if (methodParameters.alternative) {
		self[methodParameters.alternative] = self[methodName];
	}
};


// Create the single instance
module.exports = new DSTK();

// Build the API methods
for (methodName in supportedMethods) {
	if (supportedMethods.hasOwnProperty(methodName)) {
		module.exports._addMethod(methodName, supportedMethods[methodName]);
	}
}
