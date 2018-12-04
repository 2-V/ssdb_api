// comment.js

var db        = require("../../core/db");
var dbHelper  = require("../helpers/dbHelper");
var httpMsgs  = require("../../core/httpMsgs");
var util      = require("util");
var settings  = require('../../settings');
var expValidate  = require('express-validator');

exports.getList = function (req, res, jobId) {
	var numRows     // number of records in lookup table;

	dbHelper.getCount("tblJobNotes", "jobId", jobId)    // first get records in lookup table
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
				var sql = settings.commentSql;

				sql += "WHERE jobId = " + jobId + " ORDER BY id DESC OFFSET " + offset + " ROWS FETCH NEXT " + numPerPage + " ROWS ONLY";
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

exports.get = function (req, res, jobId) {
	try{
		var sql = settings.commentSql;
		sql += "WHERE id = " + jobId;

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
			var sql = "INSERT INTO tblJobNotes (First_Name, Last_Name, email) VALUES ";
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

exports.update = function (req, res, commentId) {
	try {
		if(!req.body) throw new Error("Input not valid");
		var data = req.body;

		if (data) {
			
			if(commentId != req.decoded.commentId){
				httpMsgs.show401(req, res);
			} else {	
				var sql = "UPDATE degnonJobs SET";

				var isDataProvided = false;
				if(data.title) {
					sql += " title = '" + data.title + "',";
					isDataProvided = true;
				}

				if(data.compDte) {
					sql += " compDte = '" + data.compDte + "',";
					isDataProvided = true;
				}

				if(data.org) {
					sql += " org = '" + data.org + "',";
					isDataProvided = true;
				}

				if(data.empId) {
					sql += " empId = " + data.empId + ",";
					isDataProvided = true;
				}

				if(data.itId) {
					sql += " itId = " + data.itId + ",";
					isDataProvided = true;
				}

				if(data.jobSubaccount) {
					sql += " job_subaccount = " + data.jobSubaccount + ",";
					isDataProvided = true;
				}

				sql = sql.slice(0, -1); //remove last comma
				sql += "WHERE id = " + commentId;

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

			if(!data.commentId) throw new Error("commentId not provided");

			if(data.commentId !== req.decoded.commentId && req.decoded.admin !== 'Council'){
				httpMsgs.show401(req, res);
			} else {

				var sql = "DELETE FROM tblJobNotes";
				
				sql += "WHERE id = " + data.commentId;

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

