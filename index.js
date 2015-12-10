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
var dataNotToDelete	=	[];
var idToEdit		=	"";
var idToDelete		=	"";
var ErrorNama		= 	"";		
var ErrorNpm		= 	"";		
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
	res.render("index", {
		breadcrumbs : "Tambah Data",
	});
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
		breadcrumbs : "Ubah Data"+ filteredMahasiswa[0].nama,
		id : idToEdit
	});
});

app.get('/hapus/:id', function (req, res) {

	var filteredMahasiswa = [];
    for (var i = 0; i < dataToSend.length; i++) {
        if (dataToSend[i].npm.toUpperCase() != req.params.id.toUpperCase()) {
    		dataNotToDelete.push( new mahasiswa( dataToSend[i].nama, dataToSend[i].npm ));
        }else{
            idToDelete = i;
        }
    }

    if( idToDelete != "" || idToDelete == 0) {
    	dataToSend = [];
    	dataMahasiswa = [];

    	for (var i = 0; i < dataNotToDelete.length; i++) {
    		dataMahasiswa.push( new mahasiswa( dataNotToDelete[i].nama, dataNotToDelete[i].npm ));
    	}

    	dataToSend = JSON.parse(JSON.stringify(dataMahasiswa));
    	dataNotToDelete = [];
    }

    res.redirect('/success');
});

app.get('/success', function (req, res) {
	res.render("success", {
		listDataMhs : dataToSend,
		breadcrumbs : "Daftar Data"
	});
});

//get the posted value
app.post('/', function(request, response){

	if ( request.body.nama !== '' && request.body.npm !== '' ){ //validasi form
    	dataMahasiswa.push( new mahasiswa( request.body.nama, request.body.npm ));
		dataToSend = JSON.parse(JSON.stringify(dataMahasiswa));
    	response.redirect('/success');
	} else {
		if ( request.body.nama === ''){ //validasi textbox nama
			ErrorNama = 'Nama Tidak Boleh Kosong';
		}
		if ( request.body.npm === ''){ //validasi textbox npm
			ErrorNpm = 'Npm Tidak Boleh Kosong';
		}

		response.render("index", {
			ErrorNama : ErrorNama,
			ErrorNpm : ErrorNpm,
			nama : request.body.nama,
			npm : request.body.npm
		});
	}
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