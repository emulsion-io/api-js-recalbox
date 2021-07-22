const axios         = require('axios');
const inquirer      = require('inquirer')
const chalk         = require('chalk')

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

			await this._getParser("needAuth").then( async (returnval) => {

				if(returnval.needAuth === true) {

					if ( this.user.login === "" || this.user.password === "") {

						await inquirer.prompt([
							{
								type: 'string',
								name: 'login',
								message: 'Login du manager recalbox :'
							},
							{
								type: 'input',
								name: 'password',
								message: 'Mot de passe du manager recalbox :'
							},
						]).then(answers => {
							this.user.login    = answers.login;
							this.user.password = answers.password;

							this._login();
						});

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
							
							this.recal = axios.create(this.baseAxio);

						});

					}
				}
			});
		}
	}

	async _initialize() {
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