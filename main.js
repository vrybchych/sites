var scrape = require('website-scraper');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'qwerty',
  database : 'sites'
});

connection.connect(function(err) {
  if (err) throw err;
      console.log("Connected!");
});

// START forech----------------
var url = 'https://dribbble.com/';
var options = {
  urls: [url],
  directory: './TEST',
  recursive: true,
  domain: require('url').parse(url).hostname,
  connection: connection,
  // maxDepth: 1,
    sources: [
    // {selector: 'img', attr: 'src'},
    // {selector: 'link[rel="stylesheet"]', attr: 'href'},
    // {selector: 'script', attr: 'src'}
  ]
};

scrape(options).then((result) => {
    console.log('SUCCES');
    connection.end();
}).catch((err) => {
    console.log('FAIL');
    connection.end();
});
// END forech