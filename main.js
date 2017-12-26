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
    //update status
    go(results, i);
  }
//END foreach
});

function go(results, i) {
    connection.query( 'UPDATE domains SET update_time = ?, status = ? WHERE id = ?',
                      [Math.round(+new Date()/1000), '1', results[i]['id']],
                      function (error, res, fields) {});
    var url = 'http://' + results[i]['domain'];
    var additional = {
      domain: results[i]['domain'],
      connection: connection,
      domain_id: results[i]['id'],
    };
    var options = {
      urls: [url],
      directory: './TEST',
      recursive: true,
      additional: additional,
      // maxDepth: 1,
        sources: [
        // {selector: 'img', attr: 'src'},
        // {selector: 'link[rel="stylesheet"]', attr: 'href'},
        // {selector: 'script', attr: 'src'}
      ]
    };
    scrape(options).then((result) => {
        //SET STATUS 2
        console.log('TEST: ' + result);
        connection.query(
          'UPDATE domains SET update_time = ?, status = ? WHERE id = ?',
          [Math.round(+new Date()/1000), '2', results[i][domain_id]],
          function (error, res, fields) {});
        console.log('SUCCES');
    }).catch((err) => {
        console.log('FAIL');
    });
}

// connection.end();