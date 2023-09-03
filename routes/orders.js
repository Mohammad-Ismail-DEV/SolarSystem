var express = require("express")
var router = express.Router()
var connection = require("../database.js")

//router functions

router.post("/", function (req, res) {
	if (req.body.user_name) {
		connection.query(
			`Select * from orders Where uid=(Select id from users Where display_name=${req.body.user_name})`,
			function (error, results) {
				var result = {
					...result,
					orders: JSON.parse(JSON.stringify(results))
				}
				res.send(result)
			}
		)
	} else {
		connection.query(`Select * from orders`, function (error, results) {
			var result = {
				...result,
				orders: JSON.parse(JSON.stringify(results))
			}
			res.send(result)
		})
	}
})

router.post("/create_order", function (req, res) {
	connection.query(
		`Insert into orders (uid, status) values ('${req.body.user_id}', 'pending')`,
		function (error, results) {
			console.log("error", error)
			if (!error) {
				var f = false
				req.body.products.forEach((element) => {
					connection.query(
						`Insert into orderproducts (order_id, product_id, quantity, order_price) 
						values('${JSON.parse(JSON.stringify(results)).insertId}', ${element.id}, ${
							element.quantity
						}, ${element.price}) `,
						function (e) {
							if (e) {
								console.log("e", e)
								f = true
							}
						}
					)
				})
				if (f) {
					res.send("Something Went Wrong! Try Again Later")
				} else {
					res.send("Success")
				}
			} else {
				res.send("Something Went Wrong! Try Again Later")
			}
		}
	)
})

router.post("/set_status", function (req, res) {
	connection.query(
		`Update orders set status = '${req.body.status}' where id=${req.body.id}`,
		function (error, results) {
			if (!error) {
				res.send("Success")
			} else {
				res.send("Failed To Update! Try Again Later")
			}
		}
	)
})

module.exports = router
