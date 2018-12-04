// settings.js

exports.dbConfig = {
	user:     "ssdbadmin",
	password: "ssdbadminpwd",
	server:   "degnonsql2",
	database: "schedule",
	port: 1433
};

exports.webPort = 3000;
exports.httpMsgsFormat = "JSON";

exports.employeeSql = "SELECT [Member ID] as memberId, First_Name as firstName, Last_Name as lastName, email, username, agrps, isIt, inactive, webAccess FROM Main ";
exports.jobSql = "SELECT id, title, dteReq, compDte, org, emp, status, empId, itId, job_subaccount as [jobSubaccount] FROM degnonjobs ";
exports.commentSql = "SELECT id, dateEntered, comments, jobId, empid, itid, pmid, org, wrkHours FROM tblJobNotes ";
exports.defaultSearchLimit = 25;

exports.secret = "5FDF19D7-EC51-4FE6-AAA1-E10B729BFF09";