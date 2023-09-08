var express = require("express")
var router = express.Router()
var connection = require("../database.js")

//router functions
router.post("/", function (req, res) {
	var panelCap = req.body.day / req.body.panels
	var batteryCap = 1
	if (req.body.battery.toLowerCase() === "acid") {
		batteryCap = 3000
	} else {
		batteryCap = 4000
	}
	var nbBattery = Math.ceil(req.body.night / batteryCap)
	connection.query(
		`Select * from products where info>=${panelCap} && category_id=2; Select * from products where info>=${req.body.day} && category_id=1`,
		function (error, results) {
			console.log("results", results)
			var result = {}
			if (results[0].length == 0) {
				res.send("Insuffecient Number of Panels")
			} else {
				result = {
					...result,
					panel: JSON.parse(JSON.stringify(results[0][0])).name,
					inverter: JSON.parse(JSON.stringify(results[1][0])).name,
					batteries: nbBattery
				}
				res.send(result)
			}
		}
	)
})

module.exports = router
