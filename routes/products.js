var DB = require("./DB");
var express = require("express");
var router = express.Router();

var url = require("url");
var querystring = require("querystring");
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", function(req, res){

	var menu = [
		{
			id: 1,
			link: "/products/reset",
			text: "Resert table"
		},
		{
			id: 2,
			link: "/products/add",
			text: "Add product"
		},
		{
			id: 3,
			link: "/products/search",
			text: "Search product by code"
		},
		{
			id: 4,
			link: "/products/show-all",
			text: "Show all"
		},
	];

	res.render("products/index", {title: "Menú Products", menu: menu});

});


router.get('/reset', function(req, res) {

	try {


		var db = new DB.DataBase();
		var cnn = db.openConnection();
		var msj = null;

		var sqlQuery = "DROP TABLE IF EXISTS products;";
		cnn.query(sqlQuery, function(err, rows, fields){

			if (!err) {
				sqlQuery = "CREATE TABLE products(" +
								"clave int(6) not null auto_increment," +
								"description varchar(45) not null," +
								"price decimal(6,2) not null," +
								"primary key(clave)" +
							");";

				cnn.query(sqlQuery, function(err, rows, fields){
					if (!err) {

						msj = {
							title: "Reset table Success",
							error: false,
							message: "Table products is empty"
						};

						db.closeConnection(cnn);
						res.render("products/complete", { result: msj });


					} else {
						msj = {
							title: "Error reset table",
							error: true,
							message: "Error create table products"
						};
						console.log("Error reset, ", err);
					}

					res.render("products/complete", { result: msj });

				});

			} else {
				msj = {
					title: "Error drop table",
					error: true,
					message: "Error try reset table"
				};

				console.log("Error drop table, ", err);
				res.render("products/complete", { result : msj });
			}

		});


	}catch(err){
		console.log("Error model,", err);
		msj = {
			title: "Error drop table",
			error: true,
			message: "Model reset table"
		};

		res.render("products/complete", { result : msj });
	}

});

router.get("/add", function(req, res){

	var data = {
		title: "Add new product",
		inputs: [
			/*
			{
				id: "clave",
				name: "clave",
				label:{
					for: "clave",
					text: "Clave"
				}
			},
			*/
			{
				id: "description",
				name: "description",
				label:{
					for: "description",
					text: "Description"
				}
			},
			{
				id: "price",
				name: "price",
				label:{
					for: "price",
					text: "Price"
				}
			}
		],
		button: {
			id: "btnSave",
			class: "btn",
			value: "Save"
		}
	};

	res.render("products/add", { form: data });

});

router.post("/add", function(req, res){

	var product = {
		clave: 0,
		description: req.body.description,
		price: req.body.price
	}


	var msg = null;
	try {

		var db = new DB.DataBase();
		var cnn = db.openConnection();

		var sqlQuery = cnn.query("INSERT INTO products SET ?", product, function(err, result){

			if (err) {
				throw "Error add product. "	+ err;
			} else {
				msg = {
					title: "New product add success",
					error: false,
					message: "Change is complicated, but, Do it!"
				};
				res.render("products/complete", { "result": msg });
				db.closeConnection(cnn);
			}


		});

	}catch(err) {
		msg = {
			title: "Error add product",
			error: true,
			message: err
		};
		res.render("products/complete", { "result": msg });
		console.log(err);
	}

});


router.get("/show-all", function(req, res){

	var db = new DB.DataBase();
	var cnn = db.openConnection();
	var sqlQuery = "SELECT ?? FROM products";
	var columns = ["clave", "description", "price"];
	var msg = null;

	try{

		cnn.query(sqlQuery, [columns], function(err, results){

			if (err) {
				console.log("Error:", err);
				throw "Error select all products. " + err;
			}

			res.render("products/list", {
				title: "List products",
				teaser: "select product for detail",
				products: results
			});

			db.closeConnection(cnn);
		});

	}catch(err){

		msg = {
			title: "Error show products",
			error: true,
			message: "Contact admin"
		};

		console.log("Error [show-all]:", err);
	}

});


router.get("/show", function(req, res){

	var db = new DB.DataBase();
	var cnn = null;
	var sqlQuery = "SELECT ?? FROM products WHERE clave=?";

	var clave = url.parse(req.url, true).query.clave;
	console.log(req.url);

	var msg;
	var query;

	try{
		cnn = db.openConnection();


		query = cnn.query(sqlQuery, [["clave", "description", "price"], clave], function(err, results){

			if (err) {
				throw "Error show product" + err;
			}

			res.render("products/list", {
				title: "Detail product",
				teaser: "Show detail for edit or delete",
				products: results
			});

		});

		console.log(query.sql);

	}catch(err){
		console.log("Error [show]:", err);
		msg = {
			title: "Error show product",
			error: true,
			message: "Contact admin"
		};
	}

});

module.exports = router;
