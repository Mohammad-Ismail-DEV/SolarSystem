var express = require("express")
var router = express.Router()
var connection = require("../database.js")

router.post("/", function (req, res, next) {
	connection.query(
		"SELECT * FROM `users` where email!='admin'",
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
  WHERE email='${req.body.email.toLowerCase()}' && password='${
			req.body.password
		}'`,
		function (error, results, fields) {
			console.log(error)
		
			if (JSON.parse(JSON.stringify(results)).length == 0) {
				res.send("Wrong Email or Password")
			} else {
				results[0].admin = results[0].admin == 1
				var result = {
					...result,
					status: 1,
					user: JSON.parse(JSON.stringify(results))[0]
				}
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
						`INSERT Into users (email, password,display_name,phone_number,phone_prefix,photo_url) values 
        ('${req.body.email.toLowerCase()}', '${req.body.password}', '${
							req.body.display_name
						}', '${req.body.phone_number}', '${
							req.body.phone_prefix
						}','https://images.unsplash.com/photo-1518977081765-9b1b0c2538e2?w=1280&h=720')`,
						function (error, results, fields) {
							if (!error)
								connection.query(
									`SELECT * FROM users WHERE email='${req.body.email}' && password='${req.body.password}'`,
									function (error, results, fields) {
										var result = {
											...result,
											status: 1,
											user: JSON.parse(
												JSON.stringify(results)
											)[0]
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
router.post("/update_user", function (req, res) {
	var e = false
	Object.keys(req.body).forEach((k) => {
		if (k != "id" || "new_password" || "old_password" || "admin" || "") {
			connection.query(
				`UPDATE users SET ${k}='${req.body[k]}' WHERE id=${req.body.id}`,
				function (error, results, feilds) {
					if (error) {
						e = true
					}
				}
			)
		}
	})
	if (e == false) {
		connection.query(
			`SELECT email, display_name, id, photo_url, admin, phone_prefix, phone_number FROM users 
		WHERE id='${req.body.id}'`,
			function (error, results, fields) {
				var result = {
					...result,
					status: 1,
					user: JSON.parse(JSON.stringify(results))[0]
				}
				if (result.user.length == 0) {
					res.send("Wrong Email or Password")
				} else {
					res.send(result)
				}
			}
		)
	} else {
		res.send("Something Went Wrong! Try Again Later")
	}
})

module.exports = router
