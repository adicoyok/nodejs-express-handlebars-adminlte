var express 		= 	require('express');
var app 			= 	express();
var fs 				= 	require('fs');
var hb 				= 	require('handlebars');
var exphbs 			= 	require('express3-handlebars');
var bodyParser 		= 	require('body-parser');
var base_path 		= 	 __dirname;
var dataMahasiswa 	= 	[];
var dataParsed		= 	[];
var dataToSend		=	[];
var dataToEdit		=	[];
var idToEdit		=	"";
var mahasiswa 		= 	function (nama, npm) {
						    this.nama = nama;
						    this.npm = npm;
						};
//like a helpers
app.engine("handlebars", exphbs(
	{
		defaultLayout:"main",
	}
));

app.set("view engine","handlebars");

//get posted var
app.use(bodyParser());

app.use('/static',express.static(__dirname + '/views/layouts'));
app.use('/getdata',express.static(__dirname + '/tmp'));

//index
app.get('/', function (req, res) {
	res.render("index");
});

app.get('/ubah/:id', function (req, res) {

	var filteredMahasiswa = [];
    for (var i = 0; i < dataToSend.length; i++) {
        if (dataToSend[i].npm.toUpperCase() === req.params.id.toUpperCase()) {
            filteredMahasiswa.push(dataToSend[i]);
            idToEdit = i;
        }
    }

    filteredMahasiswa = JSON.parse(JSON.stringify(filteredMahasiswa));

	res.render("edit", {
		nama : filteredMahasiswa != '' ? filteredMahasiswa[0].nama : "",
		npm : filteredMahasiswa != '' ? filteredMahasiswa[0].npm : "",
		id : idToEdit
	});
});

app.get('/hapus/:id', function (req, res) {

	var filteredMahasiswa = [];
    for (var i = 0; i < dataToSend.length; i++) {
        if (dataToSend[i].npm.toUpperCase() === req.params.id.toUpperCase()) {
            idToEdit = i;
        }
    }

    if(idToEdit != ""){
	    var dataToDelete = dataToSend.indexOf(idToEdit);
	    dataToDelete.splice(dataToSend, idToEdit);
    }

    res.redirect('/success');
});

app.get('/success', function (req, res) {
	res.render("success", {
		listDataMhs : dataToSend
	});
});

//get the posted value
app.post('/', function(request, response){
    dataMahasiswa.push( new mahasiswa( request.body.nama, request.body.npm ));

	dataParsed["data"] = JSON.parse(JSON.stringify(dataMahasiswa));
	dataToSend = dataParsed["data"];
    // console.log(dataParsed);

    response.redirect('/success');
});

app.post('/ubah/:id', function(request, response){
    dataToSend[request.body.id].nama = request.body.nama;
    dataToSend[request.body.id].npm = request.body.npm;

    response.redirect('/success');

});

//setting connection
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});