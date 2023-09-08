var express = require("express")
var router = express.Router()
var connection = require("../database.js")

//router functions

router.post("/get_cart", function (req, res) {
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
				cart_base: results[0].total,
				cart_taxes: results[0].total * 0.1,
				cart_total: Math.floor(results[0].total * 1.1),
				products: products
			}
			res.send(result)
		}
	)
})

router.post("/add_cart", function (req, res) {
	var total = 0
	req.body.products.forEach((element) => {
		total = total + element.price * element.quantity
	})
	connection.query(
		`Select id from cart where uid=${req.body.user_id}`,
		function (error, results) {
			if (JSON.parse(JSON.stringify(results)).length != 0) {
				if (!error) {
					var f = false
					console.log(
						"JSON.parse(JSON.stringify(results)).id",
						JSON.parse(JSON.stringify(results))[0].id
					)
					req.body.products.forEach((element) => {
						connection.query(
							`Update cart set total=total+${total}; Insert into cartItems (cart_id, product_id, quantity, price) values(${
								JSON.parse(JSON.stringify(results))[0].id
							}, ${element.id}, ${element.quantity}, ${
								element.price
							})`,
							function (e) {
								if (e) {
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
			} else {
				connection.query(
					`Insert into cart (uid,total) values ('${req.body.user_id}',  ${total})`,
					function (error, results) {
						if (!error) {
							var f = false
							req.body.products.forEach((element) => {
								connection.query(
									`Insert into cartItems (cart_id, product_id, quantity, price) values(${results.insertId}, ${element.id}, ${element.quantity}, ${element.price})`,
									function (e) {
										if (e) {
											console.log("e", e)
											f = true
										}
									}
								)
							})
							if (f) {
								res.send(
									"Something Went Wrong! Try Again Later"
								)
							} else {
								res.send("Success")
							}
						} else {
							res.send("Something Went Wrong! Try Again Later")
						}
					}
				)
			}
		}
	)
})

router.post("/clear_cart", function (req, res) {
	connection.query(
		`Delete from cartItems Where cart_id=${req.body.cart_id}; Delete from cart Where id=${req.body.cart_id}`,
		function (error, results) {
			console.log("error", error)
			console.log("results", results)
			if (!error) {
				res.send("success")
			} else {
				res.send("fail")
			}
		}
	)
})

module.exports = router
