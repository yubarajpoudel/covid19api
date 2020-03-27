Covid-19 api
---
Dependency
 - node 
 - Express
 - Redis
 - [novelcovid](https://www.npmjs.com/package/novelcovid)

[Redis](https://redis.io/topics/quickstart) Installation
===
Mac os 
   - ```brew install redis```
Ubuntu Linux
   - ```$sudo apt update```
   - ```$sudo apt install redis-server```

Check redis installed or not
  ``` redis-server ```


Setup Process
 - clone repository
 - get inside the project folder and run `npm install`
 - Run project in development `nodemon index.js` or in release `pm2 start index.js -i max`
 
API URLs
- 127.0.0.1:8000 - shows status of api
- 127.0.0.1:8000/count - shows total count
 > ```{"Cases":341696,"Deaths":14753,"Recovered":99041}```
- 127.0.0.1:8000/stat -  Total stat by case sorted by recovered
> ```[{"country":"China","cases":81093,"todayCases":39,"deaths":3270,"todayDeaths":9,"recovered":72703,"active":5120,"critical":1749,"casesPerOneMillion":56},{"country":"Iran","cases":21638,"todayCases":0,"deaths":1685,"todayDeaths":0,"recovered":7913,"active":12040,"critical":0,"casesPerOneMillion":258},{"country":"Italy","cases":59138,"todayCases":0,"deaths":5476,"todayDeaths":0,"recovered":7024,"active":46638,"critical":3000,"casesPerOneMillion":978},{"country":"S. Korea","cases":8961,"todayCases":64,"deaths":111,"todayDeaths":7,"recovered":3166,"active":5684,"critical":59,"casesPerOneMillion":175},
> ........]```

- 127.0.0.1:8000/country?name=<country-name>
  >http://127.0.0.1:8000/country?name=us
```{"country":"USA","cases":35070,"todayCases":1524,"deaths":458,"todayDeaths":39,"recovered":178,"active":34434,"critical":795,"casesPerOneMillion":106}```

- 127.0.0.1/np/pressrelease [Nepal press release data](https://heoc.mohp.gov.np/)
  ```
  [{"sn":"1","published_date":"22 Feb 2019","title":"Kavre, Panchkhal Food Poisoning – Press Release #4","size":" ","download_url":"https://drive.google.com/open?id=1c7Pl9132zgkOfua8Ukk6qoc9CvN2FjcX"},{"sn":"2","published_date":"22 Feb 2019","title":"Kavre, Panchkhal Food Poisoning – Press Release #3","size":" ","download_url":"https://drive.google.com/open?id=19zQpZORamL2WRwdZFVZlTBvTt4Q1SNKG"},{"sn":"3","published_date":"22 Feb 2019","title":"Kavre, Panchkhal Food Poisoning – Press Release #2","size":" ","download_url":"https://drive.google.com/open?id=1QRmjtlUZwQvRrqm87AOa6DVor3E5_brA"}, ...]
  
  ```

Thats all .

@Stay safe and help others. 