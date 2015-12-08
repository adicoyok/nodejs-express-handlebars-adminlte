var express 		= 	require('express');
var app 			= 	express();
var fs 				= 	require('fs');
var hb 				= 	require('handlebars');
var exphbs 			= 	require('express3-handlebars');
var bodyParser 		= 	require('body-parser');
var base_path 		= 	 __dirname;
var dataMahasiswa 	= 	[];
var mahasiswa 		= 	function (nama, npm) {
						    this.nama = nama;
						    this.npm = npm;
						};

app.engine("handlebars", exphbs(
	{
		defaultLayout:"main",
	}
));

app.set("view engine","handlebars");

app.use(bodyParser());

app.use('/static',express.static(__dirname + '/views/layouts'));

app.get('/', function (req, res) {
	res.render("index", function(request, response){
		res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(response);
        res.end();
	});
});


app.post('/', function(request, response){
	var createMahasiswa = function (response, callback) {
	    dataMahasiswa.push( new mahasiswa( request.body.nama, request.body.npm ));
	    
	    if (dataMahasiswa.length != 0)
	        callback(null, response);
	    else {
	        callback(invalidOperationException());
	    }
	};

	// data = JSON.parse(JSON.stringify(dataMahasiswa));
    console.log(dataMahasiswa);

    response.redirect('/success');
});

app.get('/success', function (req, res) {
	res.render("success", {
		listDataMhs : dataMahasiswa
	});
    console.log(mahasiswa);

});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});