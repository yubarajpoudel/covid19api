const axios = require("axios");
const cheerio = require("cheerio");
const siteUrl = "https://heoc.mohp.gov.np/";
let siteName = "";
const publishedDate = new Set();
const title = new Set();
const size = new Set();
const download = new Set();
const data = [];
// const fetchData = async () => {
  
// };
const getResults = () => {
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
            console.log($(element));
            if(j == 4) {
              objectResponse[resultKeys[j]] = $(element).find('a').attr('href');
            } else {
              objectResponse[resultKeys[j]] = $(element).text();
            }
            
            j++;
          });
          console.log(objectResponse);
          data.push(objectResponse);
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        console.log(data);
        return {
            // positions: [...positions].sort(),
            // tags: [...tags].sort(),
            // locations: [...locations].sort(),
            // categories: [...categories].sort(),
            // siteName,
            test: "working"
        };
        console.log("fetch completed");
      });
  }

 
  // siteName = $('.table > .table-hover > .fixed_header > .m-0').text();
  // $(".tags .tag").each((index, element) => {
  //   tags.add($(element).text());
  // // });
  // $("#health-emergency .small").each((index, element) => {
  //   console.log($(element).text());
  //   respFroomServer = $(element).text();
  //  // publishedDate.add($(element).text());

  // });
 //  $("div.nav p").each((index, element) => {
 //   categories.add($(element).text());
 //  });

 // $('.company_and_position [itemprop="title"]')
 //  .each((index, element) => {
 //  positions.add($(element).text());
 // });
//Convert to an array so that we can sort the results.

module.exports = getResults;