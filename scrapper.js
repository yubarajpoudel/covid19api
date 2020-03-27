const axios = require("axios");
const cheerio = require("cheerio");
const siteUrl = "https://heoc.mohp.gov.np/";
const data = [];

const fetchData = async () => {
   const response = await axios.get(siteUrl);
   return cheerio.load(response.data);
}

const getResults = async () => {
  try {
       const resultKeys = ["sn", "published_date", "title", "size", "download_url"];
       console.log("fetching data");
       // const $ = cheerio.load(response.data);
       const $ = await fetchData();
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
       // console.log(objectResponse);
       data.push(objectResponse);
    });
       return data;
    }
  catch(error) {
    return error;
  }
}

// const getResults = () => {
//   const resultKeys = ["sn", "published_date", "title", "size", "download_url"];
//   console.log("fetching data");
//    axios.get(siteUrl)
//       .then(function (response) {
//         // handle success
//         // console.log(response.data);
//         const $ = cheerio.load(response.data);
//         $('#health-emergency tr').each((index, element) => {
//           var j = 0;
//           var objectResponse = {};
//           $(element).find('td').each((index, element) => {
//             if(j == 4) {
//               objectResponse[resultKeys[j]] = $(element).find('a').attr('href');
//             } else {
//               objectResponse[resultKeys[j]] = $(element).text();
//             }
//             j++;
//           });
//           console.log(objectResponse);
//           data.push(objectResponse);
//         });
//       })
//       .catch(function (error) {
//         // handle error
//         console.log(error);
//         return error;
//       })
//       .finally(function () {
//         // always executed
//         console.log(data);
//         console.log("fetch completed");
//         return JSON.stringify(data);
//       });
//   }

module.exports = getResults;