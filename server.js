// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express           = require('express');        // call express
var app               = express();                 // define our app using express
var bodyParser        = require('body-parser');
var expressValidator  = require('express-validator');
var morgan            = require('morgan');
var jwt               = require('jsonwebtoken');
var settings          = require('./settings');
var db                = require('./core/db');
var httpMsgs          = require('./core/httpMsgs');
var employee          = require('./app/controllers/employee');
var job               = require('./app/controllers/job');
var comment           = require('./app/controllers/comment');
var authn             = require('./app/controllers/authenticate');
var reset             = require('./app/controllers/reset');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(expressValidator());
app.use(morgan('dev'));


var port = process.env.PORT || settings.webPort;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'Degnon Associates Job System API' });   
});

// Authenticate User (POST http://localhost:3000/api/authenticate)
router.post('/authenticate', function (req, res) {
	authn.getAuthn(req, res);
});

// Get Reset User Token (POST http://localhost:3000/api/reset)
router.post('/reset', function (req, res) {
	reset.getReset(req, res);
});

// check post, url params, or header for token
function valToken(req, res) {
	try{
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		
		// decode token
		if (token) {
			return new Promise(function(resolve, reject){
				// verify secret and check exp
				jwt.verify(token, settings.secret, function (err, decoded) {
					if (err) {
						reject(httpMsgs.show401(req, res));
					} else {
						// authn passed, save to request for use in other routes
						resolve(req, res);

					}
				});
			});
		} else {
			return new Promise(function(resolve, reject){
				if( req.headers['authorization'] ){
					resolve(authn.getAuthn(req, res));
				} else{
					// if no token or auth is passed return an error
					reject(httpMsgs.show401(req, res));
				}
			});
			
		}
	}
	catch (ex) {
		httpMsgs.show500(req, res, err);
		console.log(ex);
	}

}

//
//
//  EMPLOYEE
//
//

// employee GET all POST routes
router.route('/employees')
	.get(function (req, res) {

		valToken(req, res).then(function(){
			employee.getList(req, res);
		});
	})
	.post(function (req, res) { 
		valToken(req, res).then(function(){
			employee.add(req, res);
		});
});

// employee GET one PUT DELETE routes
router.route('/employees/:employeeId')
	.get(function (req, res) { 
		valToken(req, res).then(function(){
			var empIdPatt = "[0-9]+";
			var patt = new RegExp("/employees/" + empIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(empIdPatt);
				var employeeId = patt.exec(req.url);
				employee.get(req, res, employeeId);
			} else {
				httpMsgs.show404(req, res);
			}
		});
	})
	.put(function (req, res) {
		valToken(req, res).then(function(){
			var empIdPatt = "[0-9]+";
			var patt = new RegExp("/employees/" + empIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(empIdPatt);
				var employeeId = patt.exec(req.url);
				employee.update(req, res, employeeId);
			} else {
				httpMsgs.show404(req, res);
			}
		});
	})
	.post(function (req, res) {
		valToken(req, res).then(function(){
			var empIdPatt = "[0-9]+";
			var patt = new RegExp("/employees/" + empIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(empIdPatt);
				var employeeId = patt.exec(req.url);
				employee.update(req, res, employeeId);
			} else {
				httpMsgs.show404(req, res);
			}
		});
	})
	.delete(function (req, res) {
		valToken(req, res).then(function(){
			employee.delete(req, res);
		});
});


//
//
//  JOB
//
//

// job GET all POST routes
router.route('/jobs')
	.get(function (req, res) {
		valToken(req, res).then(function(){
			job.getList(req, res);
		});
	})
	.post(function (req, res) { 
		valToken(req, res).then(function(){
			job.add(req, res);
		});
});

// job GET one PUT DELETE routes
router.route('/jobs/:jobId')
	.get(function (req, res) { 
		valToken(req, res).then(function(){
			var jobIdPatt = "[0-9]+";
			var patt = new RegExp("/jobs/" + jobIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(jobIdPatt);
				var jobId = patt.exec(req.url);
				job.get(req, res, jobId);
			} else {
				httpMsgs.show404(req, res);
			}
		});
	})
	.put(function (req, res) {
		valToken(req, res).then(function(){
			var jobIdPatt = "[0-9]+";
			var patt = new RegExp("/jobs/" + jobIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(jobIdPatt);
				var jobId = patt.exec(req.url);
				job.update(req, res, jobId);
			} else {
				httpMsgs.show404(req, res);
			}
		});
	})
	.post(function (req, res) {
		valToken(req, res).then(function(){
			var jobIdPatt = "[0-9]+";
			var patt = new RegExp("/jobs/" + jobIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(jobIdPatt);
				var jobId = patt.exec(req.url);
				job.update(req, res, jobId);
			} else {
				httpMsgs.show404(req, res);
			}
		});
	})
	.delete(function (req, res) {
		valToken(req, res).then(function(){
			job.delete(req, res);
		});
});	


//
//
//  COMMENT
//
//	

// comment GET route
router.route('/jobs/:jobId/comments')
	.get(function (req, res) { 
		valToken(req, res).then(function(){
			var jobIdPatt = "[0-9]+";
			var patt = new RegExp("/jobs/" + jobIdPatt + "/comments");
			if (patt.test(req.url)) {
				patt = new RegExp(jobIdPatt);
				var jobId = patt.exec(req.url);
				comment.getList(req, res, jobId);
			} else {
				httpMsgs.show404(req, res);
			}
		});
});	

// comment PUT DELETE routes
router.route('/comments/:commentId')
	.get(function (req, res) { 
		valToken(req, res).then(function(){
			var jobIdPatt = "[0-9]+";
			var patt = new RegExp("/comments/" + jobIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(jobIdPatt);
				var jobId = patt.exec(req.url);
				var commentId = patt.exec(req.url);
				console.log(jobId + ' ' + commentId);
				comment.get(req, res, jobId);
			} else {
				httpMsgs.show404(req, res);
			}
		});
	})
	.put(function (req, res) {
		valToken(req, res).then(function(){
			var jobIdPatt = "[0-9]+";
			var patt = new RegExp("/comments/" + jobIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(jobIdPatt);
				var jobId = patt.exec(req.url);
				comment.update(req, res, jobId);
			} else {
				httpMsgs.show404(req, res);
			}
		});
	})
	.post(function (req, res) {
		valToken(req, res).then(function(){
			var jobIdPatt = "[0-9]+";
			var patt = new RegExp("/comments/" + jobIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(jobIdPatt);
				var jobId = patt.exec(req.url);
				comment.update(req, res, jobId);
			} else {
				httpMsgs.show404(req, res);
			}
		});
	})
	.delete(function (req, res) {
		valToken(req, res).then(function(){
			comment.delete(req, res);
		});
});	

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api/v1
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Started listening at ' + port);


