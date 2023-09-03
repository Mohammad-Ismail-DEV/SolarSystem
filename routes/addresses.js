var express = require("express")
var router = express.Router()
var connection = require("../database.js")

//router functions

router.post("/", function (req, res) {
	connection.query(
		`Select * from addresses where uid='${req.body.user_id}'`,
		function (error, results) {
			var result = {
				...result,
				addresses: JSON.parse(JSON.stringify(results))
			}
			res.send(result)
		}
	)
})

router.post("/add_address", function (req, res) {
	connection.query(
		`Update addresses set active = 0 where uid = req.body.user_id ;Insert into addresses (country, city, road, building, floor, active, uid), 
		values('${req.body.country}','${req.body.city}','${req.body.road}', '${req.body.building}','${req.body.floor}', 1, ${req.body.user_id})`,
		function (error, results) {
			if (!error) {
				res.send("Success")
			} else {
				res.send("Something Went Wrong! Try Again Later")
			}
		}
	)
})

router.post("/set_active", function (req, res) {
	connection.query(
		`Update addresses set active = 0 where uid = req.body.user_id ;Update addresses set active = 1 where id=${req.body.id}`,
		function (error, result) {
			if (!error) {
				res.send("Success")
			} else {
				res.send("Something Went Wrong! Try Agaian Later")
			}
		}
	)
})

module.exports = router
