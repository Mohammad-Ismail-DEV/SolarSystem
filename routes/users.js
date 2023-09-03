var express = require("express")
var router = express.Router()
var connection = require("../database.js")

router.get("/", function (req, res, next) {
	connection.query(
		"SELECT * FROM `users`",
		function (error, results, fields) {
			var result = {
				...result,
				users: JSON.parse(JSON.stringify(results))
			}
			res.send(result)
		}
	)
})
router.post("/login", function (req, res, next) {
	connection.query(
		`SELECT email, display_name, id, photo_url, admin, phone_prefix, phone_number FROM users 
  WHERE email='${req.body.email}' && password='${req.body.password}'`,
		function (error, results, fields) {
			var result = {
				...result,
				status: 1,
				user: JSON.parse(JSON.stringify(results))
			}
			if (result.user.length == 0) {
				res.send("Wrong Email or Password")
			} else {
				res.send(result)
			}
		}
	)
})
router.post("/signup", function (req, res, next) {
	if (
		req.body.email &&
		req.body.password &&
		req.body.display_name &&
		req.body.phone_number &&
		req.body.phone_prefix
	) {
		connection.query(
			`SELECT * FROM users WHERE email='${req.body.email}'`,
			function (error, results, fields) {
				var result = {
					...result,
					result: JSON.parse(JSON.stringify(results))
				}
				if (result.result.length == 0) {
					connection.query(
						`INSERT Into users (email, password,display_name,phone_number,phone_prefix) values 
        ('${req.body.email}', '${req.body.password}', '${req.body.display_name}', '${req.body.phone_number}', '${req.body.phone_prefix}')`,
						function (error, results, fields) {
							if (!error)
								connection.query(
									`SELECT * FROM users WHERE email='${req.body.email}' && password='${req.body.password}'`,
									function (error, results, fields) {
										var result = {
											...result,
											result: JSON.parse(
												JSON.stringify(results)
											)
										}
										res.send(result)
									}
								)
						}
					)
				} else res.send("Email already exixts")
			}
		)
	} else res.send("Missing Feilds")
})

module.exports = router
