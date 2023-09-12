var express = require("express")
var router = express.Router()
var connection = require("../database.js")

//router functions
router.post("/", function (req, res) {
	
let panelRecommendation = "";
let inverterRecommendation = "";
let batteryRecommendation = "";
let numberOfBatteries = "";

// Calculate total daily electricity intake
const totalDayAmps = req.body.day;
const totalNightAmps = req.body.night;
const totalDailyAmps = totalDayAmps + totalNightAmps;


// Make recommendations based on the total daily electricity intake
if (totalDayAmps >= 15 && totalNightAmps >= 5) {

  panelRecommendation = "20 or more solar panels";

  inverterRecommendation = "Large inverter (e.g., 4000W)";

  batteryRecommendation = "Large battery options";
  
  numberOfBatteries = "Acid-based: 4 or more / Lithium-based: 2 or more";


} else if (totalDayAmps >= 20 && totalNightAmps >= 10) {

  panelRecommendation = "10-15 solar panels";

  inverterRecommendation = "Medium inverter (e.g., 2000W)";

  batteryRecommendation = "Medium battery options";

  numberOfBatteries = "Acid-based: 2-3 / Lithium-based: 1 or more";


} else if (totalDayAmps >= 10 && totalNightAmps >= 5) {

  panelRecommendation = "5-10 solar panels";

  inverterRecommendation = "Small inverter (e.g., 1000W)";

  batteryRecommendation = "Small battery options";

  numberOfBatteries = "Acid-based: 1 / Lithium-based: 1";


} else {
  panelRecommendation = "30 or more solar panels";

  inverterRecommendation = "Extra-large inverter (e.g., 6000W)";

  batteryRecommendation = "Extra-large battery options";

  numberOfBatteries = "Acid-based: 5 or more / Lithium-based: 3 or more";
}
var result = {
	"panel" : panelRecommendation,
	"inverter" : inverterRecommendation,
	"batteries" : numberOfBatteries
}
res.send(result)
})

module.exports = router
