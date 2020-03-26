const axios = require("axios");
const cheerio = require("cheerio");
const siteUrl = "https://heoc.mohp.gov.np/";
let siteName = "";
const publishedDate = new Set();
const title = new Set();
const size = new Set();
const download = new Set();


const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const getResults = async () => {
  const $ = await fetchData();

  // siteName = $('.table > .table-hover > .fixed_header > .m-0').text();
  // $(".tags .tag").each((index, element) => {
  //   tags.add($(element).text());
  // });
  $(".table .table-hover .fixed_header .m-0 tbody .small").each((index, element) => {
    console.log($(element).text());
   // publishedDate.add($(element).text());

  });
 //  $("div.nav p").each((index, element) => {
 //   categories.add($(element).text());
 //  });

 // $('.company_and_position [itemprop="title"]')
 //  .each((index, element) => {
 //  positions.add($(element).text());
 // });
//Convert to an array so that we can sort the results.
return {
  positions: [...positions].sort(),
  tags: [...tags].sort(),
  locations: [...locations].sort(),
  categories: [...categories].sort(),
  siteName,
 };
};

module.exports = getResults;