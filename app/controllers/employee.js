// employee.js

var db        = require("../../core/db");
var dbHelper  = require("../helpers/dbHelper");
var httpMsgs  = require("../../core/httpMsgs");
var util      = require("util");
var settings  = require('../../settings');
var expValidate  = require('express-validator');

exports.getList = function (req, res) {
	var numRows     // number of records in lookup table;

	dbHelper.getCount("main")    // first get records in lookup table
	.then(function(result, err) {
		try {
			if (err) {
				console.log(err);
				numRows = 0;
			} else {
				numRows = result;	
			}
		}
		catch (ex) {
			httpMsgs.show500(req, res, err);
			console.log(ex);
		}
		
	})
	.then(function () { 
		try{
			var page = parseInt(req.query.page, 10) || 1;  // page number passed in URL query string
			var numPerPage  = parseInt(settings.defaultSearchLimit);      // items per page
			var offset = (page - 1) * numPerPage;               // start row			      
			var numPages = Math.ceil(numRows / numPerPage) // max pages available
		
			// throw error is page requested is too large
			if (page > numPages) {
				var err = ("Page " + page + " exceeds available limit of " + numPages + " pages");
				httpMsgs.show500(req, res, err);
			} else {
				var sql = settings.employeeSql;

				sql += "ORDER BY [member id] OFFSET " + offset + " ROWS FETCH NEXT " + numPerPage + " ROWS ONLY";
				db.executeSql(sql, function(data, err) {
					if(err){
						httpMsgs.show500(req, res, err);
					} else {
						httpMsgs.sendJson(req, res, data);
					}
				});
			}
		}
		catch (ex) {
			httpMsgs.show500(req, res, err);
			console.log(ex);
		}

		
		
	});	
};

exports.get = function (req, res, employeeId) {
	try{
		var sql = settings.employeeSql;
		sql += "WHERE [Member Id] = " + employeeId;

		db.executeSql(sql, function(data, err) {
			if(err){
				httpMsgs.show500(req, res, err);
			} else {
				httpMsgs.sendJson(req, res, data);
			}
		});
	}
	catch (ex) {
		httpMsgs.show500(req, res, err);
		console.log(ex);
	}
};

exports.add = function (req, res) {
	try {
		if(!req.body) throw new Error("Input not valid");
		var data = req.body;
		if (data) {
			var sql = "INSERT INTO Main (First_Name, Last_Name, email) VALUES ";
			sql += util.format("('%s', '%s', '%s')", data.firstName, data.lastName, data.email);
			db.executeSql(sql, function (data, err) {
				if (err) {
					httpMsgs.show500(req, res, err);
				} else {
					httpMsgs.send200(req, res);
				}
			});
		}
		else {
			throw new Error("Input not valid");
		}
	}
	catch (ex) {
		httpMsgs.show500(req, res, ex);
	}
};

exports.update = function (req, res, employeeId) {
	try {
		if(!req.body) throw new Error("Input not valid");
		var data = req.body;

		if (data) {
			
			if(employeeId != req.decoded.employeeId && req.decoded.admin != 'Council'){
				httpMsgs.show401(req, res);
			} else {	
				var sql = "UPDATE Main SET";

				var isDataProvided = false;
				if(data.firstName) {
					sql += " First_Name = '" + data.firstName + "',";
					isDataProvided = true;
				}

				if(data.lastName) {
					sql += " Last_Name = '" + data.lastName + "',";
					isDataProvided = true;
				}

				if(data.email) {
					sql += " Email = '" + data.email + "',";
					isDataProvided = true;
				}

				if(data.password) {
					sql += " Web_Password = '" + data.password + "',";
					isDataProvided = true;
				}

				sql = sql.slice(0, -1); //remove last comma
				sql += "WHERE [member id] = " + employeeId;

				if(isDataProvided){
					db.executeSql(sql, function (data, err) {
						if (err) {
							httpMsgs.show500(req, res, err);
						} else {
							httpMsgs.send200(req, res);
						}
					});
				} else{
					httpMsgs.show400(req, res, ex);
				}
			}
		}
		else {
			throw new Error("Input not valid");
		}
	}
	catch (ex) {
		httpMsgs.show500(req, res, ex);
	}
};

exports.delete = function (req, res) {
	try {
		if(!req.body) throw new Error("Input not valid");
		var data = req.body;
		if (data) {

			if(!data.employeeId) throw new Error("employeeId not provided");

			if(data.employeeId !== req.decoded.employeeId && req.decoded.admin !== 'Council'){
				httpMsgs.show401(req, res);
			} else {

				var sql = "DELETE FROM Main";
				
				sql += "WHERE [member id] = " + data.employeeId;

				db.executeSql(sql, function (data, err) {
					if (err) {
						httpMsgs.show500(req, res, err);
					} else {
						httpMsgs.send200(req, res);
					}
				});
			}
		}
		else {
			throw new Error("Input not valid");
		}
	}
	catch (ex) {
		httpMsgs.show500(req, res, ex);
	}
};

