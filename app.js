// module.exports = app;

var http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    js2xmlparser = require('js2xmlparser'),
    libxslt = require('libxslt');

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'views')));
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// GET request to dislay index.html located inside /views folder
router.get('/', function(req, res) {
  res.render('index');
});

// HTML produced by XSL Transformation
router.get('/get/html', function(req, res) {
  
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    var docSource = fs.readFileSync('AirportLister.xml', 'utf8');
    var stylesheetSource = fs.readFileSync('AirportLister.xsl', 'utf8');
    
    var doc = libxslt.libxmljs.parseXml(docSource);
    var stylesheet = libxslt.parse(stylesheetSource);
    
    var result = stylesheet.apply(doc);
    
    res.end(result.toString());
  
});

// POST request to add to JSON & XML files
router.post('/post/json', function(req, res) {

// Function to read in a JSON file, add to it & convert to XML
   function appendJSON(obj) {

// Read in a JSON file
    var JSONfile = fs.readFileSync('Airports.json', 'utf8');

// Parse the JSON file in order to be able to edit it 
    var JSONparsed = JSON.parse(JSONfile);

// Add a new record into country array within the JSON file    
    JSONparsed.Airport.push(obj);

// Beautify the resulting JSON file
    var JSONformated = JSON.stringify(JSONparsed, null, 4);

// Write the updated JSON file back to the system 
    fs.writeFileSync('Airports.json', JSONformated);

// Convert the updated JSON file to XML     
    var XMLformated = js2xmlparser.parse("AirportCodes", JSON.parse(JSONformated));

// Write the resulting XML back to the system
    fs.writeFileSync('AirportLister.xml', XMLformated);

   }

// Call appendJSON function and pass in body of the current POST request
  //console.log(req.body);
  appendJSON(req.body);
  
// Re-direct the browser back to the page, where the POST request came from
   res.redirect('back');

});

// POST request to add to JSON & XML files


router.post('/delete/json', function(req, res) {
  
  // Function to read in a JSON file, add to it & convert to XML
  function deleteEntryJSON(obj) {

    // Read in a JSON file
    var JSONfile = fs.readFileSync('Airports.json', 'utf8');

    // Parse the JSON file in order to be able to edit it 
    var JSONparsed = JSON.parse(JSONfile);
    
  //  JSONparsed.person.splice(JSONparsed.person.length-1, 1);
    
  //Removing a record from parsed json file using splice() 
  // (Geoghegan, 2016) NCI computing student 2nd year part time
  var index = -1; 
    for(var i = 0; i != JSONparsed.Airport.length; i++){
      if(JSONparsed.Airport[i].Code === obj.Code){
        index = i;
      }
   }
   if(index != -1){
    JSONparsed.Airport.splice(index, 1);
   }
    
    
 // Beautify the resulting JSON file
    var JSONformated = JSON.stringify(JSONparsed, null, 4);

// Write the updated JSON file back to the system 
    fs.writeFileSync('Airports.json', JSONformated);

// Convert the updated JSON file to XML     
    var XMLformated = js2xmlparser.parse("AirportCodes", JSON.parse(JSONformated));

// Write the resulting XML back to the system
    fs.writeFileSync('AirportLister.xml', XMLformated);
    
  }
  
  // Call appendJSON function and pass in body of the current POST request
  //console.log(req.body);
  deleteEntryJSON(req.body);
  
// Re-direct the browser back to the page, where the POST request came from
   res.redirect('back');
  
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});