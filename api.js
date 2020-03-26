const curl = new (require( 'curl-request' ))();


module.exports = function() {
	this.districts = function(province) {
		curl.setHeaders([
     		'Origin: https://covidnepal.org'
		])
			.get('https://api-prod.covidnepal.org:5000/districts?province='+province)
			.then(({statusCode, body, headers}) => {
			    console.log(statusCode, body, headers)
			})
			.catch((e) => {
			    console.log(e);
			});
	};
	this.hospitals = function(province, districts) {
		curl.setHeaders([
     		'Origin: https://covidnepal.org'
		])
			.get('https://api-prod.covidnepal.org:5000/districts?province='+province)
			.then(({statusCode, body, headers}) => {
			    console.log(statusCode, body, headers)
			})
			.catch((e) => {
			    console.log(e);
			});
	};
}