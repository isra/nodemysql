var mysql = require("mysql");

var DB = function() {


	var getConnection = function() {

		var cnn = null;

		try {

			cnn = mysql.createConnection({
				"host": "localhost",
				"user": "root",
				"password": "",
				"database": "nodejs"
			});

			cnn.connect(function(err){
				if (err) {
					 return function(){
					 	throw("Crear conexion conectar, " + err);
					 }();
				}
			});

			return cnn;


		} catch(err) {

			console.log("Error,", err);

			return function(){
				 	throw("Error, " + err);
				 }();



		}


	};


	var close = function(cnn) {
		cnn.end();
	};


	return {
		openConnection: getConnection,
		closeConnection: close
	}

}


exports.DataBase = DB;