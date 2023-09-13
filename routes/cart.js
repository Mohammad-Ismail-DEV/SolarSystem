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
	console.log(req.body)
	var total = req.body.product.price * req.body.quantity
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
					connection.query(
						`Update cart set total=total+${total}; Insert into cartItems (cart_id, product_id, quantity, price) values(${
							JSON.parse(JSON.stringify(results))[0].id
						}, ${req.body.product.id}, ${req.body.quantity} , ${
							req.body.product.price
						})`,
						function (e) {
							if (e) {
								f = true
							}
						}
					)
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
							connection.query(
								`Insert into cartItems (cart_id, product_id, quantity, price) values(${results.insertId}, ${req.body.product.id}, ${req.body.quantity} , ${req.body.product.price})`,
								function (e) {
									if (e) {
										console.log("e", e)
										f = true
									}
								}
							)
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

router.post("/change_quantity", function (req, res) {
	connection.query(
		`Select quantity, price from cartItems where id=${req.body.id}`,
		function (error, results) {
			var remove = results[0].quantity * results[0].price
			var add = results[0].price * req.body.quantity
			connection.query(
				`Update cart set total=total-${remove}+${add} where id=${req.body.cart_id}`,
				function (error, results) {
					connection.query(
						`Update cartItems set quantity=${req.body.quantity} where id =${req.body.id}`,
						function (error, results) {
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
										cart_total: Math.floor(
											results[0].total * 1.1
										),
										products: products
									}
									res.send(result)
								}
							)
						}
					)
				}
			)
		}
	)
})

router.post("/remove", function (req, res) {
	connection.query(
		`Select quantity, price from cartItems where id=${req.body.id}`,
		function (error, results) {
			var remove = results[0].quantity * results[0].price
			connection.query(
				`Update cart set total=total-${remove} where id=${req.body.cart_id}; Delete from cartItems where id=${req.body.id}`,
				function (error, results) {
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
				}
			)
		}
	)
})

router.post("/clear_cart", function (req, res) {
	connection.query(
		`Delete from cartItems Where cart_id=${req.body.cart_id}; Delete from cart Where id=${req.body.cart_id}`,
		function (error, results) {
			if (!error) {
				res.send("success")
			} else {
				res.send("fail")
			}
		}
	)
})

module.exports = router
