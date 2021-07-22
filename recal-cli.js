const axios         = require('axios');
const inquirer      = require('inquirer')
const chalk         = require('chalk')

const url = "http://192.168.1.25"

const user = {
	login : "",
	password : ""
}

class Recal {

	recal;
	cookie = null;
	baseAxio =	{
		baseURL: url,
		timeout: 10000,
	}

	constructor() {
		this.recal = axios.create(this.baseAxio);
	}

	async login() {

		if (this.cookie === null) {

			return await this._getParser("needAuth").then( async (returnval) => {

				if(returnval.needAuth === true) {

					if ( user.login === "" || user.password === "") {

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
							console.log (answers.login)
							console.log (answers.password)

							user.login    = answers.login;
							user.password = answers.password;

							this.login();
						});

					} else {

						let option = {
							"login": user.login,
							"password": user.password
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

	/**
	 * 
	 */
	getTemp() {
		var option = "temperature"

		this._getParser(option).then((returnval) => {
			console.log('temp', returnval.temperature.current);
		});
	}

	/**
	 * 
	 */
	getCpu() {
		var option = "cpus"

		this._getParser(option).then((returnval) => {
			console.log('cpus', returnval.cpus);
		});
	}

	/**
	 * 
	 */
	getRam() {
		var option = "ram"

		this._getParser(option).then((returnval) => {
			console.log('ram', returnval.ram);
		});
	}

	/**
	 * 
	 */
	getDisk() {
		var option = "disks"

		this._getParser(option).then((returnval) => {
			console.log('disks', returnval.disks);
		});
	}

	/**
	 * 
	 */
	 getVolume() {
		var option = ['audio.device','audio.volume','audio.bgmusic']

		this._grepParser(option).then((returnval) => {
			console.log('Volume :', returnval['audio.volume'].value);
		});
	}

	saveVolume(volume) {
		var option = {
			'audio.volume': volume
		}

		this._postSave(option).then((returnval) => {
			console.log('saveVolume', returnval);
		});
	}

	saveKodi() {
		var option = {
			"kodi.enabled": "0",
			"kodi.atstartup": "0",
			"kodi.xbutton": "0"
		}

		this._postSave(option).then((returnval) => {
			console.log(returnval);
		});
	}

	saveWifi(enabled, ssid, pass) {

		let passw = pass.replace('#', '\#');

		var option = {
			"wifi.enabled": enabled,
			"wifi.ssid": ssid,
			"wifi.pass": passw
		}

		this._postSave(option).then((returnval) => {
			console.log(returnval);
		});
	}

	takeScreen() {
		var action = "takeScreenshot"

		this._postAction(action).then((returnval) => {
				console.log('actionTakeScreen', returnval.data);
		});
	}

	delScreen(file) {
		var action = "deleteScreenshot"

		var option = {
			"file": file
		}

		this._postAction(action, option).then((returnval) => {
			console.log(returnval);
		});
	}

	getScreen() {
		var action = "screenshotsList"

		this._getParser(action).then((returnval) => {
			console.log(returnval.screenshotsList);
		});
	}

	/**
	 * @return ok or ko
	 */
	getStatusES() {
		var option = "ESStatus"

		this._getParser(option).then((returnval) => {
			console.log(chalk.yellow('Status de ES : ') + chalk.green(returnval.ESStatus));
		});
	}

	rebootES(action) {
		var action = "reboot-es"

		this._postAction(action).then(() => {
			console.log(chalk.yellow('Reboot ES en cours'));
		});
	}

	shutdownES(action) {
		var action = "shutdown-es"

		this._postAction(action).then(() => {
			console.log(chalk.yellow('Extinction ES en cours'));
		});
	}

	startES(action) {
		var action = "start-es"

		this._postAction(action).then(() => {
			console.log(chalk.yellow('Demarage ES en cours'));
		});
	}

	rebootOS(action) {
		var action = "reboot-os"

		this._postAction(action).then(() => {
			console.log(chalk.yellow('Reboot en cours'));
		});
	}

	shutdownOS(action) {
		var action = "shutdown-os"

		this._postAction(action).then(() => {
			console.log(chalk.yellow('Extinction en cours'));
		});
	}

	getCookie() {
		return this.cookie;
	}

}

var api = new Recal();

api.login().then( () => {

	inquirer.prompt([
		{
			type: 'list',
			name: 'type',
			message: 'Quel action voulez-vous réaliser ?',
			choices: ['Action rapide', 'Voir la temperature', 'Voir le volume', 'Prendre un Screen'],
			default: 'Action rapide'
		},
	]).then(answers => {

		switch (answers.type) {
			case 'Action rapide':
				
				inquirer.prompt([
					{
						type: 'list',
						name: 'type',
						message: 'Quel action rapide voulez-vous réaliser ?',
						choices: ['Restart ES', 'Stop ES', 'Status de ES', 'Reboot Recalbox', 'Shutdown Recalbox'],
						default: 'Restart ES'
					},
				]).then(answers2 => {
					
					switch (answers2.type) {
						case 'Status de ES':
							api.getStatusES();
							break;
						case 'Restart ES':
							api.rebootES(true);
							break;
						case 'Stop ES':
							api.shutdownES(true);
							break;
						case 'Reboot Recalbox':
							api.rebootOS(true);
							break;
						case 'Shutdown Recalbox':
							api.shutdownOS(true);
							break;
					}
				});

				break;

			case 'Voir la temperature':
				api.getTemp();
				break;
			case 'Voir le volume':
				api.getVolume();
				break;
			case 'Prendre un Screen':
				api.takeScreen();
				break;
			default:
				console.log('Action non supportée');
		}

	});

});
