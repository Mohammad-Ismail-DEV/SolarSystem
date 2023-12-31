var express = require("express")
var router = express.Router()
var connection = require("../database.js")

router.post("/", function (req, res, next) {
	if (req.body.category_id) {
		connection.query(
			`SELECT * FROM products WHERE category_id='${req.body.category_id}'`,
			function (error, results, fields) {
				var result = {
					...result,
					products: JSON.parse(JSON.stringify(results))
				}
				res.send(result)
			}
		)
	} else {
		connection.query(
			`SELECT * FROM products`,
			function (error, results, fields) {
				var result = {
					...result,
					products: JSON.parse(JSON.stringify(results))
				}
				res.send(result)
			}
		)
	}
})

router.post("/add_product", function (req, res, next) {
	console.log(req.body)
	if (req.body.name && req.body.price && req.body.info && req.body.category) {
		connection.query(
			`Select id FROM categories WHERE name='${req.body.category}'`,
			function (error, results, feilds) {
				var result = {
					...result,
					result: JSON.parse(JSON.stringify(results))
				}
				if (result.result.length > 0) {
					connection.query(
						`INSERT INTO products (name,price,info,photo_url,category_id)
					      values('${req.body.name}','${req.body.price}','${req.body.info}','','${result.result[0].id}')`,
						function (error, results, fields) {
							if (!error) {
								res.send("Success")
							} else {
								res.send(
									"Something Went Wrong! Try Again Later"
								)
							}
						}
					)
				} else {
					res.send("Invalid category")
				}
			}
		)
	} else {
		res.send("Missing Feilds")
	}
})

router.post("/edit_product", function (req, res, next) {
	var e = false
	Object.keys(req.body).forEach((k) => {
		if (k != "id") {
			connection.query(
				`UPDATE products SET ${k}='${req.body[k]}' WHERE id=${req.body.id}`,
				function (error, results, feilds) {
					if (error) {
						e = true
					}
				}
			)
		}
	})
	if (e == false) {
		res.send("Success")
	} else {
		res.send("Something Went Wrong! Try Again Later")
	}
})

router.post("/delete_product", function (req, res, next) {
	connection.query(
		`DELETE FROM products WHERE id=${req.body.id}`,
		function (error, results, feilds) {
			if (!error) {
				res.send("Success")
			} else {
				res.send("Failed To Delete! Try Again Later")
			}
		}
	)
})

router.post("/by_name", function (req, res, next) {
	connection.query(
		`SELECT * FROM products where name='${req.body.name}'`,
		function (error, results, fields) {
			var result = {
				...JSON.parse(JSON.stringify(results))[0]
			}
			
			res.send(result)
		}
	)
})

module.exports = router
