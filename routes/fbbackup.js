var express = require('express')
var router = express.Router()
const backup = require('../firebase/firebase');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

router.post('/backup', function(req, res) {
	// two params required in post request
	// 1. type (global, country_wise, nepal)
	// 2. data
	try {
		if(req.body && 'type' in req.body && 'data' in req.body) {
			var data = req.body.data;
			var type = req.body.type;
			console.log("type = " + type + " data = " + data);
			if(type == 'global') {
				backup.globalData(data).then(function(response){
					console.log(response);
					res.send(response);
			 }, function(err) {
			 	console.log(err);
			 });
			}else if(type == 'country_wise') {
				backup.allStat(data).then(function(response){
					console.log(response);
					res.send(response);
			 }, function(err) {
			 	console.log(err);
			 });
			} else if(type == 'nepal') {
				backup.nepalData(data).then(function(response){
					console.log(response);
					res.send(response);
			 }, function(err) {
			 	console.log(err);
			 });
			} else {
				res.status(401).send({'message': 'invalid type'});
			}
			
		} else {
			res.status(401).send({'message': 'type or data is missing'});
		}
		
	} catch(error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
