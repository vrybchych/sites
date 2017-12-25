 xlsxj = require("xlsx-to-json");
  xlsxj({
    input: "domains.xlsx", 
    output: "domains.json"
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
      console.log(result);
    }
  });
