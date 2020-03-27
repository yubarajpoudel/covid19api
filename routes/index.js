// @description: Covid 19 api
// @author: Yubaraj Poudel

const covid = require('novelcovid');
const axios = require('axios');
// const getResults = require("../scrapper");
const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const redis = require('redis');
const siteUrl = "https://heoc.mohp.gov.np/";
const data = [];
const port_redis = process.env.PORT || 6379;
const client = redis.createClient(port_redis);


client.on('error', (err) => {
  console.log("Error " + err);
});

// //Middleware Function to Check Cache
// checkCache = (req, res, next) => {
//   const { id } = req.params;
//   redis_client.get(id, (err, data) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send(err);
//     }
//     //if no match found
//     if (data != null) {
//       res.send(data);
//     } else {
//       //proceed to next middleware function
//       next();
//     }
//   });
// };

router.get('/', (req, res) => {
	res.send("api working");
});

// only counts
router.get('/count', (req, res) => {
	const globalCountUrl = 'https://api.coronatracker.com/v3/stats/worldometer/global';
	client.get(globalCountUrl, (err, result) => {
		if(result) {
		   const resultJSON = JSON.parse(result);
           res.status(200).json(resultJSON);
		} else {
			const options = { headers: {'Origin': 'https://www.coronatracker.com'}};
			axios.get(globalCountUrl, options)
			  .then(function (response) {
			    // handle success
			    console.log(response.data);
			    client.setex(globalCountUrl, 3600, JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
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
	});
	
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
		    res.send(JSON.stringify(response.data));
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
		    res.send(JSON.stringify(response.data));
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
});

// get press release from https://heoc.mohp.gov.np/
router.get('/np/pressrelease', (req, res) => {
  	const resultKeys = ["sn", "published_date", "title", "size", "download_url"];
  console.log("fetching data");
   axios.get(siteUrl)
      .then(function (response) {
        // handle success
        // console.log(response.data);
        const $ = cheerio.load(response.data);
        $('#health-emergency tr').each((index, element) => {
          var j = 0;
          var objectResponse = {};
          $(element).find('td').each((index, element) => {
            if(j == 4) {
              objectResponse[resultKeys[j]] = $(element).find('a').attr('href');
            } else {
              objectResponse[resultKeys[j]] = $(element).text();
            }
            j++;
          });
          data.push(objectResponse);
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        res.send(error);
      })
      .finally(function () {
        // always executed
        console.log(data);
        console.log("fetch completed");
        data.shift();
        res.send(JSON.stringify(data));
      });
});

// all countries
router.get('/stat', (req, res) => {
	   covid.getCountry({sort: 'recovered'}).then((data) => {
	   	 console.log(data);
	   	 res.send(JSON.stringify(data));
	   });
	 // res.send("success");
});

// get by country name
router.get('/country', (req, res) => {
	try {
		if (req.query == {} || !req.query.name) {
			res.send(JSON.stringify({'message': 'key name missing in request'}));
		} else {
			console.log(req.query.name);
			covid.getCountry({country: req.query.name}).then((data) => {
			res.send(JSON.stringify(data));
		});	
		}
		
	} catch(e) {
		console.log(e);
	}
	
});


// app.listen(8019, () => {
//   console.log('Covid api listening on port 8019!')
// });

module.exports = router;


