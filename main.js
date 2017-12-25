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

connection.query('SELECT * FROM domains', function (error, results, fields) {
  if (error) throw error;
  // START forech
  for (var i = 0; i < results.length; i++) {
    var url = 'https://' + results[i]['domain'];
    var options = {
      urls: [url],
      directory: './TEST',
      recursive: true,
      domain: results[i]['domain'],
      connection: connection,
      domain_id: results[i]['id'],
      // maxDepth: 1,
        sources: [
        // {selector: 'img', attr: 'src'},
        // {selector: 'link[rel="stylesheet"]', attr: 'href'},
        // {selector: 'script', attr: 'src'}
      ]
    };

    scrape(options).then((result) => {
        console.log('SUCCES');
        // connection.end();
    }).catch((err) => {
        console.log('FAIL');
        // connection.end();
    });
  }
//END forech
});

// connection.end();