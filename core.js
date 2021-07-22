const axios         = require('axios');

class Recal {

	recal;
	cookie = null;
	url;
	user = {
		login: "",
		password: "",
	}
	baseAxio =	{
		baseURL: "http://recalbox",
		timeout: 10000,
	}

	constructor(url, user) {
		this.url  				 = url;
		this.user 				 = user;
		this.baseAxio.baseURL = this.url;

		this.recal = axios.create(this.baseAxio);
	}

	async _login() {
		if (this.cookie === null) {

			return await this._getParser("needAuth").then( async (returnval) => {

				console.log('test si besoin auth');

				if(returnval.needAuth === true) {

					console.log('need auth', returnval.needAuth);

					if ( this.user.login === "" || this.user.password === "") {
						console.log("login or password empty");

						return false;
					} else {

						let option = {
							"login": this.user.login,
							"password": this.user.password
						};

						return await this._postAction("login", option).then( async (returnval) => {

							let cookie1s = returnval.headers['set-cookie'][0].split(';')
							let cookie2s = returnval.headers['set-cookie'][1].split(';')
							
							this.cookie = cookie1s[0] + '; ' + cookie2s[0]

							this.baseAxio.headers = {
								'Cookie': this.cookie
							}
							
							console.log('login ok');

							this.recal = axios.create(this.baseAxio);

						});

					}
				} else {
					console.log('no need auth');
				}
			}).catch((error) => {
				console.error('sortie du login', error);
			});
		} else {
			console.log('deja log');
		}
	}

	async _initialize() {
		// prevent concurrent calls firing initialization more than once
		if (!this.initializationPromise) {
		  this.initializationPromise = this._login();
		}
		return this.initializationPromise;
	}

	_getParser(option) {
		return this.recal.get('/get?option=' + option)
			.then(function (response) {
				return response.data.data;
			})
	}

	_grepParser(option) {
		return this.recal.get('/grep?keys=' + option.join("|"))
			.then(function (response) {
				return response.data.data;
			})
	}

	_postSave(option) {
		let payload = option;
		return this.recal.post('/save', payload)
			.then(function (response) {
				return response.data.data;
			})
	}

	_postAction(option, payload = {}) {
		return this.recal.post('/post?action=' + option, payload)
			.then(function (response) {
				return response;
			})
			.catch(function (error) {
			  console.log('erreur', error);
			})
	}

}

module.exports = Recal;