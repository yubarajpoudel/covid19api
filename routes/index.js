// @description: Covid 19 api
// @author: Yubaraj Poudel
const axios = require('axios');
const scrapper = require("../scrapper");
const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const redis = require('redis');
const port_redis = process.env.PORT || 6379;
const client = redis.createClient(port_redis);
const globalCountUrl = 'https://api.coronatracker.com/v3/stats/worldometer/global';
const coviddataUrl = 'https://corona.lmao.ninja/v2';
client.on('error', (err) => {
  console.log("Error " + err);
});

//Middleware Function to Check Cache
checkCache = (req, res, next) => {
  client.get(globalCountUrl, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    //if no match found
    if (data != null) {
      res.status(200).send(data);
    } else {
      //proceed to next middleware function
      next();
    }
  });
};

router.get('/', (req, res) => {
	res.send("api working");
});

// all countries
router.get('/stat', (req, res) => {
   client.get('stat', (err, data) => {
	   	if(err) {
	   		console.log(err);
	   		res.status(500).send(err);
	   	} 
	   	if(data != null) {
	   		console.log("from Cache");
	   		res.status(200).send(JSON.parse(data));
	   	} else {
	   		 const options = { headers: {'accept': 'application/json'}};
	   		 axios.get(coviddataUrl+"/countries?sort=recovered", options)
	   		 .then(function(response) {
	   		 	 client.setex('stat', 600, JSON.stringify(response.data));
	   	 	 	 res.status(200).send(response.data);
	   		 })
	   		 .catch(function(error) {
	   		 	console.log(error);
	   		 	res.status(500).send(JSON.stringify({'success': false, 'message': error}))
	   		 });
	   	}
	});
});

// timeSeries data
router.get('/timeseries', (req, res) => {
    var days = req.query.days || '30';
    var key = 'timeseries-'+days;
   client.get(key, (err, data) => {
	   	if(err) {
	   		console.log(err);
	   		res.status(500).send(err);
	   	} 
	   	if(data != null) {
	   		console.log("from Cache");
	   		res.status(200).send(JSON.parse(data));
	   	} else {
	   		 const options = { headers: {'accept': 'application/json'}};
	   		 axios.get(coviddataUrl+"/historical/all?lastdays="+days, options)
	   		 .then(function(response) {
	   		 	 client.setex(key, 600, JSON.stringify(response.data));
	   	 	 	 res.status(200).send(response.data);
	   		 })
	   		 .catch(function(error) {
	   		 	console.log(error);
	   		 	res.status(500).send(JSON.stringify({'success': false, 'message': error}))
	   		 });
	   	}
	});
});


// only counts
router.get('/count', checkCache, async (req, res) => {
	try{
		const options = { headers: {'Origin': 'https://www.coronatracker.com'}};
		axios.get(globalCountUrl, options)
		  .then(function (response) {
		    // handle success
		    console.log(response.data);
		    client.setex(globalCountUrl, 3600, JSON.stringify({ source: 'Redis Cache', ...response.data, }));
		    res.status(200).send(JSON.stringify(response.data));
		  })
		  .catch(function (error) {
		    // handle error
		    res.send(error);
		    console.log(error);
		  })
		  .finally(function () {
		    // always executed
		  });
		}
	catch(error) {
		console.log(error);
    	res.status(500).json(error);
	}
	
});

// all districts
router.get('/districts', (req, res) => {
	const options = { headers: {'Origin': 'https://covidnepal.org'}};
	if(req.query == {} || !req.query.province) {
		res.send(JSON.stringify({'message': 'province key missing in request'}));
	} else{
		var url = "https://api-prod.covidnepal.org:5000/districts?province="+req.query.province;
		console.log(url);
		axios.get(url, options)
		  .then(function (response) {
		    // handle success
		    console.log(response.data);
		    res.status(200).send(JSON.stringify(response.data));
		  })
		  .catch(function (error) {
		    // handle error
		    res.status(500).send(error);
		    console.log(error);
		  })
		  .finally(function () {
		    // always executed
		  });
	} 
});

// all hospitals

router.get('/hospitals', (req, res) => {
	const options = { headers: {'Origin': 'https://covidnepal.org'}};
	if(req.query == {} || (!req.query.province && !req.query.district)) {
		res.send(JSON.stringify({'message': 'either province or district key missing in request'}));
	} else{
		var url = "https://api-prod.covidnepal.org:5000/hospitals?province=" + req.query.province + "&district=" + req.query.district;
		console.log(url);
		axios.get(url, options)
		  .then(function (response) {
		    // handle success
		    console.log(response.data);
		    res.status(200).send(JSON.stringify(response.data));
		  })
		  .catch(function (error) {
		    // handle error
		    res.status(500).send(error);
		    console.log(error);
		  })
		  .finally(function () {
		    // always executed
		  });
	} 
});

// get press release from https://heoc.mohp.gov.np/
router.get('/np/pressrelease', (req, res) => {
	try {
		scrapper.getResults().then(pressreleaseData => {
			console.log("i am here");
			console.log(pressreleaseData);
			res.send(JSON.stringify(pressreleaseData));
		});
	} catch(error) {
		res.send(error);
	}
});

// get WHO scrap data
router.get('who/all', (req, res) => {
	try {
		scrapper.getWHOData().then( whodata => {
			console.log(whodata);
		});
	} catch(error) {
		res.send(error);
	}
});

// get by country name
router.get('/country', (req, res) => {
	try {
		if (req.query == {} || !req.query.name) {
			res.status(200).send(JSON.stringify({'message': 'key name missing in request'}));
		} else {
			 console.log(req.query.name);
			 var countryName =req.query.name;
			 const options = { headers: {'accept': 'application/json'}};
			 var url = coviddataUrl+"/countries/"+countryName;
	   		 axios.get(url, options)
	   		 .then(function(response) {
	   	 	 	 res.status(200).send(response.data);
	   		 })
	   		 .catch(function(error) {
	   		 	res.status(500).send(JSON.stringify({'success': False, 'message': error}))
	   		 });
		}
		
	} catch(e) {
		console.log(e);
		res.status(500).send(e);
	}
	
});

module.exports = router;


