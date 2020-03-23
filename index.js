// @description: Covid 19 api
// @author: Yubaraj Poudel

const covid = require('novelcovid');
const express = require('express')
const app = express();

app.get('/', (req, res) => {
	res.send("api working");
});

// only counts
app.get('/count', (req, res) => {
  (async () => {
    let all = await covid.getAll();
    var responseData = { Cases: all.cases, Deaths: all.deaths, Recovered: all.recovered};
    console.log(responseData);
    res.send(JSON.stringify(responseData));
})()
});

// all countries
app.get('/stat', (req, res) => {
	   covid.getCountry({sort: 'recovered'}).then((data) => {
	   	 console.log(data);
	   	 res.send(JSON.stringify(data));
	   });
	 // res.send("success");
});

// get by country name
app.get('/country', (req, res) => {
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

app.listen(8019, () => {
  console.log('Covid api listening on port 8019!')
});
