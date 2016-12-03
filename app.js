// var http = require('http'),
//   fs = require('fs');

// function render(path, contentType, fn) {
//   fs.readFile(__dirname + '/' + path, 'utf-8', function (err, str) {
//     fn(err, str, contentType);
//   });
// }

// var app = http.createServer(function (req, res) {
//   var httpHandler = function (err, str, contentType) {
//     if (err) {
//       res.writeHead(500, { 'Content-Type': 'text/plain' });
//       res.end('An error has occured: ' + err.message);
//     } else {
//       res.writeHead(200, { 'Content-Type': contentType });
//       res.end(str);
//     }
//   };
//   if (req.url.indexOf('/scripts/') >= 0) {
//     render(req.url.slice(1), 'application/javascript', httpHandler);
//   } else if (req.headers['x-requested-with'] === 'XMLHttpRequest' && req.headers['x-vanillaajaxwithoutjquery-version'] === '1.0') {
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ message: 'Hello World!' }));
//   } else if(req.url.indexOf('/airportlister.html') >= 0){
//  /* might not be needed as httpHandler call back does it
//     res.writeHead(200, {'Content-Type': 'text/html'});*/
//     render(req.url.slice(1), 'text/html', httpHandler);
//   } else {
//     render('views/index.html', 'text/html', httpHandler);
//   }
// });

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

//   // Function to read in a JSON file, add to it & convert to XML
//   function appendJSON(obj) {

//     // Read in a JSON file
//     var JSONfile = fs.readFileSync('Countries.json', 'utf8');

//     // Parse the JSON file in order to be able to edit it 
//     var JSONparsed = JSON.parse(JSONfile);

//     // Add a new record into country array within the JSON file    
//     JSONparsed.country.push(obj);

//     // Beautify the resulting JSON file
//     var JSONformated = JSON.stringify(JSONparsed, null, 4);

//     // Write the updated JSON file back to the system 
//     fs.writeFileSync('Countries.json', JSONformated);

//     // Convert the updated JSON file to XML     
//     var XMLformated = js2xmlparser.parse("countries", JSON.parse(JSONformated));

//     // Write the resulting XML back to the system
//     fs.writeFileSync('Countries.xml', XMLformated);

//   }

//   // Call appendJSON function and pass in body of the current POST request
//   appendJSON(req.body);
  
//   // Re-direct the browser back to the page, where the POST request came from
//   res.redirect('back');

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});