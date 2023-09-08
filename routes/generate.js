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
		`Select * from products where info>=${panelCap} && category_id=2 Order By info asc; Select * from products where info>=${req.body.day} && category_id=1 Order By info asc`,
		function (error, results) {
			var result = {}
			console.log("results", results)
			if (results[0].length == 0) {
				result = {
					...result,
					panel: "Insuffecient Number of Panels",
					inverter: JSON.parse(JSON.stringify(results[1][0])).name,
					batteries: nbBattery
				}
				res.send(result)
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
