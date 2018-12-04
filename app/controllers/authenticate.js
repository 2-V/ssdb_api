// authenticate.js

var db       = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
var util     = require("util");
var settings = require('../../settings');
var jwt      = require('jsonwebtoken');
var isJSON   = require('is-json');
var aHelper = require("../helpers/assetHelper")

exports.getAuthn = function (req, res) {

	try {
		if(!req.body && !req.headers['authorization']) throw new Error("Input not valid");
		var data = req.body;

		if (!aHelper.isEmptyObject(data)) {
			var sql = settings.memberSql;
			sql += util.format("WHERE email = '%s' AND web_password = '%s'", data.username, data.password);
			
			db.executeSql(sql, function (data, err) {
				if (err) {
					httpMsgs.show500(req, res, err);
				} else {
					
					// return unauthorized if credentials do not match a record
					if (!data.length) {
						httpMsgs.show401(req, res);
					} else {
						// generate and return auth token to client
						var payload = {};
						const params = {
							admin:        data[0].webAccess,
							memberId:     data[0].memberId,
							email:        data[0].email,
							display_name: data[0].firstName
						};
						var token = jwt.sign(params, settings.secret, {
							expiresIn: 60*24*14 // 60 * 24 minutes * 14 days = 2 weeks
						});

						payload.message="success";
						payload.token = token;

						httpMsgs.sendJson(req, res, payload);
					}
				}
			});
		}
		else {
			// handle requests made by basic auth
			if(req.headers['authorization']){

				var data = req.headers['authorization'];

				var bToken = data.split(' '); // isolate the auth token
				var buf = new Buffer(bToken[1], 'base64'); // get buffer ready to accept token string
				var plain_auth = buf.toString(); // decode token into auth string

				// console.log("Decoded Authorization ", plain_auth);
				var creds = plain_auth.split(':'); // convert credentials string into array
				username = creds[0];
				password = creds[1];

				var sql = settings.memberSql;
				sql += util.format("WHERE email = '%s' AND web_password = '%s'", username, password);
				
				db.executeSql(sql, function (data, err) {
					if (err) {
						httpMsgs.show500(req, res, err);
					} else {
						// return unauthorized if credentials do not match a record
						if (!data.length) {
							httpMsgs.show401(req, res);
						} else {
							var payload = {};
							const params = {
								admin:    data.webAccess,
								memberId: data.memberId
							};
							var token = jwt.sign(params, settings.secret, {
								expiresIn: 60*24 // 60 * 24 minutes = 1 day
							});

						}
					}
				});

			} else {
				throw new Error("Input not valid");
			}
			
		}
	}
	catch (ex) {
		httpMsgs.show500(req, res, ex);
	}
};