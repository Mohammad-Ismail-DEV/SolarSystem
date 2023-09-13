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
	connection.query(
		`SELECT cart.id as cid, cart.total, product_id, quantity, cartItems.price, products.name FROM cart,cartitems JOIN products on products.id WHERE cart.uid=${req.body.user_id} && cart_id=cart.id && products.id = product_id`,
		function (error, results) {
			var products = []
			results.forEach((element) => {
				products.push({
					name: element.name,
					quantity: element.quantity,
					price: element.price
				})
			})

			var result = {
				...result,
				cart_id: results[0].cid,
				cart_total: results[0].total,
				products: products
			}
			connection.query(
				`Insert Into orders (uid, status) values (${req.body.user_id}, 'pending')`,
				function (error, results) {
					var e = false
					result.products.forEach((element) => {
						connection.query(
							`Insert into orderProducts (order_id, product_id, quantity, order_price) values (${results.insertId}, ${element.product_id}, ${element.quantity}, ${element.price})`,
							function (error, results) {
								if (!error) {
									connection.query(
										`Delete from cartItems Where cart_id=${req.body.cart_id}; Delete from cart Where id=${req.body.cart_id}`,
										function (error, results) {
											if (error) {
												e = true
											}
										}
									)
								} else {
									console.log("error", error)
								}
							}
						)
					})
					if (e == false) {
						res.send({ id: results.insertId })
					}
				}
			)
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
