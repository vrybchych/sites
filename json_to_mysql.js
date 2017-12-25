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

var arr = require('./domains');

// console.log(Math.round(+new Date()/1000));
for (var i = 0; i < arr.length; i++) {
	var time = Math.round(+new Date()/1000);
	var data = {domain: arr[i]['Referring Domain'], status: 0, update_time: time};
	connection.query('INSERT INTO domains SET ?', data, function (error, results, fields) {
		  if (error) throw error;
		  // Neat!
		});
  	console.log(arr[i]['Referring Domain']);
}
connection.end();