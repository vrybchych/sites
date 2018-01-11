var mysql = require('mysql');
var fs = require('fs');
var cheerio = require('cheerio');

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

function updatePageStatus(status, id) {
  connection.query(
          'UPDATE pages SET status = ? WHERE id = ?',
          [status, id],
          function (error, results, fields) {});
}

function addLink(domain, link, page_id) {
  let data  = {domain: domain, link: link, page_id: page_id};
  connection.query('INSERT INTO links SET ?', data, function (error, results, fields) {
    // if (error) throw error;
  });
}

function go() {
  connection.query('SELECT * FROM pages WHERE status=0', function (error, results, fields) {
    if (error) throw error;

    let page = results[0];
    console.log(page.id);//TEST
    updatePageStatus(1, page.id);
    go(); //call function after status update
    let buff = new Buffer(page.html, 'base64');
    let text = buff.toString('ascii');
    if (text.indexOf("nofollow") != -1) {
      console.log("NOFOLLOW");
      return ;
    }
    $ = cheerio.load(text);
    let links = $('a'); //jquery get all hyperlinks
    $(links).each(function(i, link){
      //ll - current link
      let ll = $(link).attr('href');
      if (ll && ll.indexOf("http") == 0) {
        let hostname = require('url').parse(ll).hostname;
        //if it's link to another site
        if (hostname) {
          addLink(hostname, ll, page.id);
          console.log(hostname + ':');
          console.log(ll + '\n');
        }
      }
    });
  });
}
go();

// connection.end();
