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

module.exports = router
