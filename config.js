module.exports = {
	App: {
		port: process.env.HAPINES_PORT || 8080
	}, 
	db: {
	    user     : process.env.SR_DB_USER || 'happyadmin', 
	    password : process.env.SR_DB_PSWD || 'adminpass', 
	    database : process.env.SR_DB_NAME || 'hapines', 
	    port	 : process.env.SR_DB_PORT || 3306
	}
}