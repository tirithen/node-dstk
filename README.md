# node-dstk
node-dstk is a node.js module that provides an interface for the [Data Science Toolkit](http://www.datasciencetoolkit.org/) distribution.

The [Data Science Toolkit](http://www.datasciencetoolkit.org) is a tool that can be used to:

* Find places or persons in text
* Find coordinates for IP-numbers or street address
* Find the main content in a HTML document

...and several more methods.

The [Data Science Toolkit](http://www.datasciencetoolkit.org) it self is a Linux distribution assembled by Pete Warden that can be run as a virtual machine.

This module provides an interface by making HTTP requests to the server, by default the public server at http://www.datasciencetoolkit.org is used but to improve speed you can clone this virtual machine and run it locally and set the dstk.apiURL to the cloned machines url ex. http://localhost:8080.

## Installation
Simply use the npm package manager

	$ npm install dstk

## Usage example

	var dstk = require('dstk');

	// OPTIONAL: change from default http://www.datasciencetoolkit.org server to custom server
	// dstk.apiURL = 'http://localhost:8080';

	// Find GPS coordinates for an IP number
	dstk.ipToCoordinates('8.8.8.8', function (error, data, httpResponse) {
		if (!error) {
			console.log(data);
		}
	});

	// Find names in text
	var dstk = require('dstk'),
		text =	'This is a text naming Anna Andersson and Peter Nilsson ' +
				'to try out the text to people functionality';

	dstk.textToPeople(text, function (error, data, httpResponse) {
		if (!error) {
			console.log(data);
		}
	});

## Available methods
Below are the currently supported methods, they are linked to the [documentation on the Data Science Toolkit](http://www.datasciencetoolkit.org/developerdocs) for more detailed explanations.

* dstk.info
* [dstk.text2places or dstk.textToPlaces](http://www.datasciencetoolkit.org/developerdocs#text2places)
* [dstk.ip2coordinates or dstk.ipToCoordinates](http://www.datasciencetoolkit.org/developerdocs#ip2coordinates)
* [dstk.street2coordinates or dstk.streetToCoordinates](http://www.datasciencetoolkit.org/developerdocs#street2coordinates)
* [dstk.coordinates2politics or dstk.coordinatesToPolitics](http://www.datasciencetoolkit.org/developerdocs#coordinates2politics)
* [dstk.text2sentences or dstk.textToSentences](http://www.datasciencetoolkit.org/developerdocs#text2sentences)
* [dstk.html2text or dstk.htmlToText](http://www.datasciencetoolkit.org/developerdocs#html2text)
* [dstk.html2story or dstk.htmlToStory](http://www.datasciencetoolkit.org/developerdocs#html2story)
* [dstk.text2people or dstk.textToPeople](http://www.datasciencetoolkit.org/developerdocs#text2people)
* [dstk.text2times or dstk.textToTimes](http://www.datasciencetoolkit.org/developerdocs#text2times)

## License
(The GPL license)

Copyright (C) 2013  Fredrik Söderström

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see [http://www.gnu.org/licenses/](http://www.gnu.org/licenses/).
