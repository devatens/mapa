// Cargamos módulos Node
var express = require('express');
var http = require('http');
var mysql = require('mysql');

// Creamos aplicación, servidor y sockets
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Configuramos la aplicación, ver http://expressjs.com/api.html
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
});



//Conexion a la BD
var connectionDB = mysql.createConnection({
  //propiedades de la base de datos
  host: "localhost",
  user: "geo",
  password: "Lxb8~a44",
  database: "localizacion"
});

connectionDB.connect(function(error){
   if(!!error){
      console.log('Error');
   }else{
      console.log('Conexion correcta.');
   }
});


// Routing
app.get('/', function(req, res) {
    connectionDB.query("SELECT * FROM posicion", function(error,rows,fields){
      if(!!error){
        console.log('Error in the query');
      }else{
        console.log('Succes!\n');
        console.log(rows);
      }
    });
      
    res.render('layout', {
      title: 'Mapa en tiempo real',
      description: 'Mi primer mapa'
    });
});

io.sockets.on('connection', function (socket){
	socket.on('coords:me', function (data){
		console.log(data);
    var userInfo = data.latlng;
    var latitude = userInfo.lat;
    var longitude = userInfo.lng;
    var hora = new Date();
    
    var userDB = { 
      nombre: 'deyvi',
      lon: longitude,
      lat: latitude,
      hora: hora
    };

    var query = connectionDB.query('INSERT INTO posicion SET ?', userDB, function(error, result, fields){
      if(!!error){
        console.log(error);
      }else{
        console.log('Insercion correcta');
      }
    });

    console.log('esta es la información');

    console.log(userDB);

		socket.broadcast.emit('coords:user', data);
	});
});


//Iniciamos servidor
server.listen(3000);

console.log('Servidor funcionando en http://localhost:3000');