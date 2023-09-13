var mysql = require("mysql")
var connection = mysql.createConnection({
	multipleStatements: true,
	host: "localhost",
	user: "root",
	password: "",
	database: "solarsystem",
	port: 3308
})
connection.connect((err) => {
	if (err) {
		console.log(err)
		return
	}
	console.log("Database connected")
})
module.exports = connection
