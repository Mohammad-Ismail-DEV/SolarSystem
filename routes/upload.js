var express = require("express")
var router = express.Router()
var connection = require("../database.js")

//router functions

router.post("/image",function(req,res){
    console.log(req.body)
})

module.exports = router
