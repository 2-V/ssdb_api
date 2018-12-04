//httpMsgs.js

var settings = require("../settings");

exports.show500 = function(req, res, err) {
	if (settings.httpMsgsFormat === "HTML") {
		res.writeHead(500, "Internal Error Occurred", {"Content-Type":"text/html"} );
		res.write("<html><head><title>500</title></head><body>500: Internal Error. Details: " + err + "</body></html>");
	}
	else {
		res.writeHead(500, "Internal Error Occurred", {"Content-Type":"application/json"} );
		res.write(JSON.stringify({ data: "ERROR occurred:" + err }));
	}

	res.end();
};

exports.sendJson = function (req, res, data) {
	res.writeHead(200, {"Content-Type":"application/json"} );
	if (data){
		res.write(JSON.stringify(data));
	}
	res.end();
}

exports.show405 = function(req, res) {
	if (settings.httpMsgsFormat === "HTML") {
		res.writeHead(405, "Method not Supported", {"Content-Type":"text/html"} );
		res.write("<html><head><title>405</title></head><body>405: Method not Supported</body></html>");
	}
	else {
		res.writeHead(405, "Method not Supported", {"Content-Type":"application/json"} );
		res.write(JSON.stringify({ data: "Method not Supported" }));
	}

	res.end();
};

exports.show404 = function(req, res) {
	if (settings.httpMsgsFormat === "HTML") {
		res.writeHead(404, "Resource not found", {"Content-Type":"text/html"} );
		res.write("<html><head><title>404</title></head><body>405: Resource not found</body></html>");
	}
	else {
		res.writeHead(404, "Resource not found", {"Content-Type":"application/json"} );
		res.write(JSON.stringify({ data: "Resource not found" }));
	}

	res.end();
};

exports.show413 = function(req, res) {
	if (settings.httpMsgsFormat === "HTML") {
		res.writeHead(413, "Request Entity too Large", {"Content-Type":"text/html"} );
		res.write("<html><head><title>413</title></head><body>413: Request Entity too Large</body></html>");
	}
	else {
		res.writeHead(413, "Request Entity too Large", {"Content-Type":"application/json"} );
		res.write(JSON.stringify({ data: "Request Entity too Large" }));
	}

	res.end();
};


exports.show401 = function(req, res) {
	if (settings.httpMsgsFormat === "HTML") {
		res.writeHead(401, "Unauthorized", {"Content-Type":"text/html"} );
		res.write("<html><head><title>401</title></head><body>401: Unauthorized</body></html>");
	}
	else {
		res.writeHead(401, "Unauthorized", {"Content-Type":"application/json"} );
		res.write(JSON.stringify({ data: "Unauthorized" }));
	}

	res.end();
};

exports.show400 = function(req, res) {
	if (settings.httpMsgsFormat === "HTML") {
		res.writeHead(400, "Bad Request", {"Content-Type":"text/html"} );
		res.write("<html><head><title>400</title></head><body>400: Bad Request</body></html>");
	}
	else {
		res.writeHead(400, "Bad Request", {"Content-Type":"application/json"} );
		res.write(JSON.stringify({ data: "Bad Request" }));
	}

	res.end();
};

exports.show403 = function(req, res) {
	if (settings.httpMsgsFormat === "HTML") {
		res.writeHead(403, "Forbidden", {"Content-Type":"text/html"} );
		res.write("<html><head><title>403</title></head><body>403: Forbidden</body></html>");
	}
	else {
		res.writeHead(403, "Forbidden", {"Content-Type":"application/json"} );
		res.write(JSON.stringify({ data: "Forbidden" }));
	}

	res.end();
};

exports.send200 = function(req, res) {	
	res.writeHead(200, {"Content-Type":"application/json"} );
	res.end();
};

exports.showHome = function(req, res) {
	if (settings.httpMsgsFormat === "HTML") {
		res.writeHead(200, {"Content-Type":"text/html"} );
		res.write("<html><head><title>Home</title></head><body>Valid endpoints:<br>/members - GET - to list all Members<br>/members/<memId> - GET - to search for a member</body></html>");
	}
	else {
		res.writeHead(200, {"Content-Type":"application/json"} );
		res.write(JSON.stringify( [
			{url: "/members", operation: "GET", description: "To list all members"},
			{url: "/members/<memId>", operation: "GET", description: "To search for a member"} 
		]));
	}

	res.end();
};