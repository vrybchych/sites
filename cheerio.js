var request = require('request');
var cheerio = require('cheerio');

var url = 'http://ain.ua';
request(url, function(err, resp, body){
  $ = cheerio.load(body);
  links = $('a'); //jquery get all hyperlinks
  $(links).each(function(i, link){
  	if($(link).attr('href') !== undefined && !($(link).attr('href').search(/http/i)))
    	console.log($(link).attr('href'));
  });
});