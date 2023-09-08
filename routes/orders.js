var express = require("express")
var router = express.Router()
var connection = require("../database.js")

//router functions

router.post("/", function (req, res) {
	if (req.body.user_name && req.body.user_name != "") {
		connection.query(
			`Select * from orders Where uid=(Select id from users Where display_name='${req.body.user_name.toLowerCase()}')`,
			function (error, results) {
				var result = {
					...result,
					orders: results
				}
				res.send(result)
			}
		)
	} else {
		connection.query(
			`Select orders.id, status, uid, total, date_created, users.display_name from orders join users on users.id=uid`,
			function (error, results) {
				var result = {
					...result,
					orders: results
				}
				res.send(result)
			}
		)
	}
})

router.post("/get_order", function (req, res) {
	connection.query(
		`SELECT users.display_name, product_id, products.name, quantity, order_price, order_id, orders.status, orders.total, uid from users,orderproducts, products  JOIN orders on orders.id =${req.body.order_id} WHERE order_id=${req.body.order_id} && users.id = uid && products.id=product_id`,
		function (error, results) {
			var products = []
			results.forEach((element) => {
				products.push({
					name: element.name,
					quantity: element.quantity,
					price: element.order_price
				})
			})
			var result = {
				...result,
				user_name: results[0].display_name,
				order_status: results[0].status,
				order_id: results[0].order_id,
				order_total: results[0].total,
				date_created: results[0].date_created,
				products: products
			}
			res.send(result)
		}
	)
})

router.post("/create_order", function (req, res) {
	var total = 0
	req.body.products.forEach((element) => {
		total = total + element.order_price * element.quantity
	})
	connection.query(
		`Insert into orders (uid, status,total) values ('${req.body.user_id}', 'pending', ${total})`,
		function (error, results) {
			console.log("error", error)
			if (!error) {
				var f = false
				req.body.products.forEach((element) => {
					connection.query(
						`Insert into orderproducts (order_id, product_id, quantity, order_price) values(${results.insertId}, ${element.id}, ${element.quantity}, ${element.price}); UPDATE products SET stock=stock-${element.quantity} Where id=${element.id}`,
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
					console.log("success")
					res.send("Success")
				}
			} else {
				res.send("Something Went Wrong! Try Again Later")
			}
		}
	)
})

router.post("/set_status", function (req, res) {
	if (req.body.status == "rejected" || "cancelled") {
		connection.query(
			`Select product_id, quantity from orderproducts where order_id = ${req.body.id}`,
			function (error, results) {
				results.forEach((element) => {
					connection.query(
						`Update products set stock=stock+${element.quantity} where id=${element.product_id} `
					)
				})
			}
		)
	}
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
