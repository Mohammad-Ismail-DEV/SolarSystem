var express = require("express")
var router = express.Router()
var connection = require("../database.js")

//router functions
router.post("/", function (req, res) {
	connection.query(
		`Select * from categories`,
		function (error, results, feilds) {
			var result = {
				...result,
				categories: JSON.parse(JSON.stringify(results))
			}
			res.send(result)
		}
	)
})

router.post("/add_category", function (req, res) {
	connection.query(
		`Insert into categories (name) values('${req.body.name}')`,
		function (error, results) {
			if (!error) {
				res.send("Success")
			} else {
				res.send("Something Went Wrong! Try Again Later")
			}
		}
	)
})

module.exports = router
