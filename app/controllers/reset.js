// authenticate.js

var db       = require("../../core/db");
var httpMsgs = require("../../core/httpMsgs");
var util     = require("util");
var settings = require('../../settings');
var jwt      = require('jsonwebtoken');
var isJSON   = require('is-json');
var aHelper = require("../helpers/assetHelper")

exports.getReset = function (req, res) {

	try {
		if(!req.body) throw new Error("Input not valid");
		var data = req.body;

		if (!aHelper.isEmptyObject(data)) {
			var sql = settings.memberSql;
			sql += util.format("WHERE email = '%s'", data.username);
			
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
							admin:    data[0].webAccess,
							memberId: data[0].memberId
						};
						var token = jwt.sign(params, settings.secret, {
							expiresIn: 60*24 // 60 * 24 minutes = 1 day
						});

						payload.message="success";
						payload.token = token;

						httpMsgs.sendJson(req, res, payload);
					}
				}
			});
		} else {
			throw new Error("Input not valid");
		}
			
	}
	catch (ex) {
		httpMsgs.show500(req, res, ex);
	}
};