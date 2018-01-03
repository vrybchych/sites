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

function updateStatus(id, status) {
  var time = Math.round(+new Date()/1000);

  connection.query(
          'UPDATE domains SET update_time = ?, status = ? WHERE id = ? AND status != 2',
          [time, status, id],
          function (error, results, fields) {});
}

//ADD: domains ONLY with status 0/1 and last update date!!!!!!!!!!!
function getFreeDomainsAndGo() {
  connection.query('SELECT * FROM domains WHERE status = 0', function (error, results, fields) {
    if (error) throw error;
    go(results[0]);    
  });
}
getFreeDomainsAndGo();

function go(domain) {
    setInterval(updateStatus.bind(null, domain['id'], 1), 3000);
    var url = 'http://' + domain['domain'];
    var additional = {
      domain: domain['domain'],
      connection: connection,
      domain_id: domain['id'],
    };
    var options = {
      urls: [url],
      directory: './TEST',
      recursive: true,
      additional: additional,
      urlFilter: function(url){
        return url.indexOf(domain['domain']) != -1;
      },
      maxDepth: 5,
        sources: [ ]
    };
    scrape(options, (error, result) => {
        if (error) {          
          console.log('FAIL');
        }
        else {
          //SET STATUS 2
          updateStatus(domain['id'], 2);
          console.log('domain[id]: ', domain['id']);
          console.log('SUCCES');
        }
        getFreeDomainsAndGo();
    });

    /*
    ** PROMISES
    */

    // scrape(options).then((result) => {
    //     //SET STATUS 2
    //     updateStatus(domain['id'], 2);
    //     getFreeDomainsAndGo();
    //     console.log('SUCCES');
    // }).catch((err) => {
    //      getFreeDomainsAndGo();
    //     console.log('FAIL');
    // });
}

// connection.end();