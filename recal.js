const axios         = require('axios');

const core          = require('./api.js').Recal
const recall        = require('./api.js').Api

var url = "http://recalbox"

var user = {
	login : "",
	password : ""
}

var api = new recall(url, user);

api.getCookie();

