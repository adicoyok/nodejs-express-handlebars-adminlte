const express = require('express')
const app = express()
const fs = require('fs')
const hb = require('handlebars')
const exphbs = require('express3-handlebars')
const bodyParser = require('body-parser')
let dataMahasiswa = []
let dataToSend = []

//like a helpers
app.engine("handlebars", exphbs( { defaultLayout:"main", } ))
app.set("view engine","handlebars")

//get posted var
app.use(bodyParser())

app.use('/static', express.static(__dirname + '/views/assets'))

//index
app.get('/', function (req, res) {
	res.render("list", {
		listDataMhs : dataToSend,
		breadcrumbs : "List Data"
	})
})

app.get('/ubah/:id', function (req, res) {
	let idToEdit =	""
	let filteredMahasiswa = []
    for (var i = 0; i < dataToSend.length; i++) {
        if (dataToSend[i].npm.toUpperCase() === req.params.id.toUpperCase()) {
            filteredMahasiswa.push(dataToSend[i])
            idToEdit = i
        }
    }

    filteredMahasiswa = JSON.parse(JSON.stringify(filteredMahasiswa))

	res.render("edit", {
		nama : filteredMahasiswa != '' ? filteredMahasiswa[0].nama : "",
		npm : filteredMahasiswa != '' ? filteredMahasiswa[0].npm : "",
		breadcrumbs : "Ubah Data"+ filteredMahasiswa[0].nama,
		id : idToEdit
	})
})

app.get('/hapus/:id', (req, res) => {
	let idToDelete		=	""
	let filteredMahasiswa = []
	let dataNotToDelete = []

    for (var i = 0; i < dataToSend.length; i++) {
        if (dataToSend[i].npm.toUpperCase() != req.params.id.toUpperCase()) {
    		dataNotToDelete.push( { nama : dataToSend[i].nama, npm : dataToSend[i].npm })
        }else{
            idToDelete = i
        }
    }

    if( idToDelete != "" || idToDelete == 0) {
    	dataToSend = []
    	dataMahasiswa = []

    	for (var i = 0; i < dataNotToDelete.length; i++) {
    		dataMahasiswa.push( { nama : dataNotToDelete[i].nama, npm : dataNotToDelete[i].npm })
    	}

    	dataToSend = JSON.parse(JSON.stringify(dataMahasiswa))
    	dataNotToDelete = []
    }

    res.redirect('/')
});

app.get('/add', (req, res) => {
	res.render("add", {
		breadcrumbs : "Add Data"
	});
});

//get the posted value
app.post('/add', (request, response) => {
	let nama = request.body.nama
	let npm = request.body.npm
	let ErrorNama, ErrorNpm = ""		
	
	if ( nama.length > 0 && npm.length > 0 ){ //validasi form
		let ifExist = dataMahasiswa.findIndex( (e) => { return e.npm === npm })
		
		if( ifExist > -1 ){
			ErrorNpm = 'Npm sudah dipakai'
		}else{
			dataMahasiswa.push({nama : nama, npm : npm })
			dataToSend = JSON.parse(JSON.stringify(dataMahasiswa))
			response.redirect('/')
		}

	} else {
		if( nama.length == 0 ){ //validasi textbox nama
			ErrorNama = 'Nama Tidak Boleh Kosong'
		}
		if( npm.length == 0 ){ //validasi textbox npm
			ErrorNpm = 'Npm Tidak Boleh Kosong'
		}
	}

	response.render("add", {
		ErrorNama : ErrorNama,
		ErrorNpm : ErrorNpm,
		nama : nama,
		npm : npm
	})
})

app.post('/ubah/:id', (request, response) => {
	let id = request.body.id
	let nama = request.body.nama
	let npm = request.body.npm
	let ErrorNama, ErrorNpm = ""	

	if( nama.length > 0 && npm.length > 0 ){ //validasi form
		
		let ifExist = dataMahasiswa.findIndex( (e) => { return e.npm === npm })
		
		if( ifExist > -1 && ifExist != id ){
			ErrorNpm = 'Npm sudah dipakai'
		}else{
			dataToSend[id].nama = request.body.nama
			dataToSend[id].npm = request.body.npm
			response.redirect('/')
		}

	}else{
		if ( nama.length == 0 ){ //validasi textbox nama
			ErrorNama = 'Nama Tidak Boleh Kosong'
		}
		if ( npm.length == 0 ){ //validasi textbox npm
			ErrorNpm = 'Npm Tidak Boleh Kosong'
		}
	}
	
	response.render("edit", {
		ErrorNama : ErrorNama,
		ErrorNpm : ErrorNpm,
		nama : nama,
		npm : npm,
		id : id
	})
})


//setting connection
var server = app.listen(3000, () => {
	var host = server.address().address
	var port = server.address().port

	console.log('Example app listening at http://%s:%s', host, port)
})