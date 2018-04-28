/**
 * http://usejsdoc.org/
 */
"use strict";
var express = require('express');
var async = require("async");
var oauthSignature = require('oauth-signature');
var router = express.Router();
var path = require('path');
var successCode = 'success';
var errorCode = 'error';
var failureCode = 'failure';
var http = require('http');
var request = require('request');
var fs = require('fs');
var multer = require('multer');
var querystring = require('querystring');
var twitterAPI = require('node-twitter-api');


var _host = '192.168.1.35';
var _port = '8080';

function modifyString(inputString, replacingChar, replaceWith) {
	var str = inputString.split(replacingChar).join(replaceWith);
	return str;
}

function getRequestHeader(req, content = true) {
	var _headers;
	if (req.headers['x-auth-header'] && req.headers['x-auth-header'].length) {
		if (content) {
			_headers = {
				'Content-Type': 'application/json',
				'X-AUTH-HEADER': req.headers['x-auth-header'],
			}
		} else {
			_headers = {
				'X-AUTH-HEADER': req.headers['x-auth-header'],
			}
		}
	} else {
		_headers = {
			'Content-Type': 'application/json',
		}
	}
	return _headers;
}

function mediaRquesthandle(methodType, req, res) {
	var action = modifyString(req.body.action, '_', '/');
	var data = req.body.rawBody;
	var dataKey = req.body.rawBodyKey;
	var fileName = req.body.file;
	var fileKey = req.body.fileKey;
	var opts = {
		url: 'http://' + _host + ':' + _port + '/' + action,
		method: methodType,
		headers: getRequestHeader(req, false),
		json: true,
		formData: getFormData(dataKey, fileKey, data, fileName)

	}
	var str = '';

	request(opts, function (err, resp, body) {
		if (!err) {
			if (fileName != null && typeof fileName != 'undefined') {
				fs.unlinkSync(path.join(__dirname, '../uploads', fileName));
			}

			resp.setEncoding('utf8');
			resp.on('data', function (chunk) {
				str += chunk;
			});
			res.send(body);

		}
	});
}

function getFormData(dataKey, fileKey, data, file) {

	switch (dataKey) {
		case 'user':
			var fileSet = null;
			var formData;
			if (file != null && file != undefined) {
				formData = {
					logo: fs.createReadStream(__dirname + '/../uploads/' + file),
					//logo: file,
					user: JSON.stringify(data)
				};
			} else {
				formData = {
					user: JSON.stringify(data)
				};
			}
			break;

		case 'media':
			var fileSet = null;
			var formData;
			if (file != null && file != undefined) {
				formData = {
					files: fs.createReadStream(__dirname + '/../uploads/' + file),
					//logo: file,
					media: JSON.stringify(data)
				};
			} else {
				formData = {
					media: JSON.stringify(data)
				};
			}
			break;

		case 'client':
			delete data.startDateString;
			delete data.endDateString;
			var formData;
			if (file != null && file != undefined) {
				formData = {
					logo: fs.createReadStream(__dirname + '/../uploads/' + file),
					client: JSON.stringify(data)
				};
			} else {
				formData = {
					client: JSON.stringify(data)
				};
			}
			break;

		case 'brand':
			var formData;
			if (file != null && file != undefined) {
				formData = {
					logo: fs.createReadStream(__dirname + '/../uploads/' + file),
					brand: JSON.stringify(data)
				};
			} else {
				formData = {
					brand: JSON.stringify(data)
				};
			}
			break;
		case 'campaign':
			var formData;
			if (file != null && file != undefined) {
				formData = {
					logo: fs.createReadStream(__dirname + '/../uploads/' + file),
					campaign: JSON.stringify(data)
				};
			} else {
				formData = {
					campaign: JSON.stringify(data)
				};
			}
			break;

		default:
			break;
	}
	return formData;
}


var storage = multer.diskStorage({ //multers disk storage settings
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},

	filename: function (req, file, cb) {
		var datetimestamp = Date.now();
		cb(null, 'socioseer-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
	}
});

var upload = multer({ //multer settings
	storage: storage
}).single('file');


router.route('')
	.post(function (req, res) {
		var dataArray = JSON.stringify(req.body.myparam);

		console.log(req.body.myparam)
		console.log(req.body.action)

		var action = modifyString(req.body.action, '_', '/');
		var options = {
			host: _host,
			port: _port,
			path: '/' + action,
			method: 'POST',
			headers: getRequestHeader(req)
		};
		var str = '';
		var httpreq = http.request(options, function (response) {
			response.setEncoding('utf8');
			response.on('data', function (chunk) {
				str += chunk;
			});
			response.on('end', function () {
				res.send(str);
			})
		});

		httpreq.on('error', (e) => {
		});
		httpreq.write(dataArray);
		httpreq.end();

	})


router.route('/image').post(function (req, res) {
	upload(req, res, function (err) {
		if (err) {
			res.json({
				error_code: 1,
				err_desc: err
			});
			return;
		}

		res.json({
			status: 200,
			success_message: 'uploaded successfully',
			error_code: 0,
			upload_file_name: req.file.filename
		});
	});
})
router.route('/media')
	.post(function (req, res) {
		mediaRquesthandle('POST', req, res);
	})

var twitter = new twitterAPI({
	consumerKey: 'fGeVSmbh0xjHymJUl4U9MkcUe',
	consumerSecret: 'pxHkhuLhl7ZcT5phuDM3igLURqUAyqLd66FITxW3zkbhKrk470',
	callback: 'http://192.168.1.35:9000/#!/viewClient'
});

var userAccessToken = '864051796444041216-LZ8CTa5lEntnGb7V9pPDMkYJaZQiUDK';
var userAccessSecret = 'XFgdYIOl6ahDQAb7KX9KEBo7a37mDJcyAIp4EDiz88tRb';

/*var twitter = new twitterAPI({
	consumerKey: 'hudWQEmYTBmMxIVI9Llo5RLd3',
	consumerSecret: 'ECjE3IfcTalhgMmLk5RzA6Gb5Y9zE05at07Kg6cH89lD9LXP9t',
	callback: 'http://14.141.23.102:9000/#!/viewClient'
});

var userAccessToken = '3114286482-EN865oExDbjipmZjWU9wcvUxowu4je9S4HWGMLf';
var userAccessSecret = 'N1j7JyGsvGVPrWJb7xIYH3smnKvarIngzl75M5pwZ6BRq';*/

router.route('/twitter').post(function (req, res) {

	twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
		if (error) {
		} else {
			/*store token and tokenSecret somewhere, you'll need them later; redirect user */
			var options = { force_login: true };
			var xxxxx = twitter.getAuthUrl(requestToken, options);
			var _response = {
				status: 200,
				data: {
					url: xxxxx,
					requestToken: requestToken,
					requestTokenSecret: requestTokenSecret,
				}
			};
			res.send(_response);
		}
	});

});
router.route('/twitter/access').post(function (req, res) {
	var reqData = req.body.data;
	
	try {
		twitter.getAccessToken(reqData.newData.oauth_token, reqData.prevData.requestTokenSecret, reqData.newData.oauth_verifier, function (error, accessToken, accessTokenSecret, results) {
			if (error) {
			} else {

				var _prm = { screen_name: results.screen_name };

				twitter.users('show', _prm, accessToken, accessTokenSecret, function (error, _data, response) {
					if (error) {
					} else {
						var _response = {
							status: 200,
							data: {
								accessToken: accessToken,
								accessTokenSecret: accessTokenSecret,
								results: results,
								image: _data.profile_image_url,
								fullName: _data.name
							}
						};

						res.send(_response);
					}
				});

			}
		});
	} catch (e) {
	}


});

router.route('/twitter/trends').get(function (req, res) {
	var reqData = req.query;
	try {
		var _prm = { id: reqData.woeid };
		twitter.trends('place', _prm, userAccessToken, userAccessSecret, function (error, _data, response) {
			if (error) {
			} else {
				var _response = {
					status: 200,
					data: _data[0],
				}
				res.send(_response);
			}
		});
	} catch (e) {
	}
})
router.route('/twitter/trendingPost').get(function (req, res) {
	var reqData = req.query;
	try {
		twitter.search(reqData, userAccessToken, userAccessSecret, function (error, _data, response) {
			if (error) {
			} else {

				var _response = {
					status: 200,
					data: _data
				}
				res.send(_response);
			}
		});
	} catch (e) {
	}
})

router.route('/delete')
	.post(function (req, res) {
		var data = req.body.rawBody;
		var dataKey = req.body.rawBodyKey;
		var action = modifyString(req.body.action, '_', '/');
		var opts = {
			url: 'http://' + _host + ':' + _port + '/' + action,
			method: 'DELETE',
			headers: getRequestHeader(req),
		}
		var str = '';

		request(opts, function (err, resp, body) {
			if (!err) {
				resp.setEncoding('utf8');
				resp.on('data', function (chunk) {
					str += chunk;
				});
				res.send(body);

			}
		});

	})

router.route('/put')
	.post(function (req, res) {
		var data = req.body.rawBody;
		var action = modifyString(req.body.action, '_', '/');
		var opts = {
			url: 'http://' + _host + ':' + _port + '/' + action,
			method: 'PUT',
			headers: getRequestHeader(req, false),
			json: true,
			body: data
		}
		var str = '';

		request(opts, function (err, resp, body) {
			if (!err) {
				resp.setEncoding('utf8');
				resp.on('data', function (chunk) {
					str += chunk;
				});
				res.send(body);
			}
		});

	})

router.route('/media/put')
	.post(function (req, res) {
		mediaRquesthandle('PUT', req, res);
	})

router.route('')
	.get(function (req, res) {
		try {

			var dataArray = JSON.stringify(req.query);
			var dataArrayObj = req.query;

			var action = modifyString(req.query.action, '_', '/');
			var queryParam = "";
			var i = 0;
			for (var key in dataArrayObj) {
				var q = "";
				i++;
				if (dataArrayObj.hasOwnProperty(key)) {
					if (Object.keys(dataArrayObj).length == i) {
						q = key + "=" + dataArrayObj[key] + "";
						queryParam += q;
					} else {
						if (key != 'action') {
							q = key + "=" + dataArrayObj[key] + "&";
							queryParam += q;
						}

					}
				}

			}

			var urlToHit = action;
			if (queryParam.length) {
				urlToHit += '?' + encodeURI(queryParam);
			}
			var options = {
				host: _host,
				port: _port,
				path: '/' + urlToHit,
				method: 'GET',
				headers: getRequestHeader(req)
			};
			var str = '';
			var httpreq = http.request(options, function (response) {
				response.setEncoding('utf8');
				response.on('data', function (chunk) {
					str += chunk;
				});
				response.on('end', function () {
					res.send(str);
				})
			});
			httpreq.on('error', (e) => {
			});

			httpreq.write(dataArray);
			httpreq.end();
		} catch (e) {
		}
	})


router.route('/uploads')
	.get(function (req, res) {
		res.sendFile(path.join(__dirname, '../uploads', req.query.file));
	})


module.exports = router; 