const axios         = require('axios');
const inquirer      = require('inquirer')
const chalk         = require('chalk')

const url = "http://recalbox"

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

	async _login() {

		if (this.cookie === null) {

			await this._getParser("needAuth").then( async (returnval) => {

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
							user.login    = answers.login;
							user.password = answers.password;

							this._login();
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

	/**
	 * 
	 */
	 async getTemp() {
		await this._initialize();

		var option = "temperature"

		this._getParser(option).then((returnval) => {
			console.log('temp', returnval.temperature.current);
		});
	}

	/**
	 * 
	 */
	async getCpu() {
		await this._initialize();

		var option = "cpus"

		this._getParser(option).then((returnval) => {
			console.log('cpus', returnval.cpus);
		});
	}

	/**
	 * 
	 */
	async getRam() {
		await this._initialize();

		var option = "ram"

		this._getParser(option).then((returnval) => {
			console.log('ram', returnval.ram);
		});
	}

	/**
	 * 
	 */
	async	getDisk() {
		await this._initialize();

		var option = "disks"

		this._getParser(option).then((returnval) => {
			console.log('disks', returnval.disks);
		});
	}

	/**
	 * 
	 */
	async getVolume() {
		await this._initialize();

		var option = ['audio.device','audio.volume','audio.bgmusic']

		this._grepParser(option).then((returnval) => {
			console.log('Volume :', returnval['audio.volume'].value);
		});
	}

	async saveVolume(volume) {
		await this._initialize();

		var option = {
			'audio.volume': volume
		}

		this._postSave(option).then((returnval) => {
			console.log('saveVolume', returnval);
		});
	}

	async saveKodi() {
		await this._initialize();

		var option = {
			"kodi.enabled": "0",
			"kodi.atstartup": "0",
			"kodi.xbutton": "0"
		}

		this._postSave(option).then((returnval) => {
			console.log(returnval);
		});
	}

	async saveWifi(enabled, ssid, pass) {
		await this._initialize();

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

	async takeScreen() {
		await this._initialize();

		var action = "takeScreenshot"

		this._postAction(action).then((returnval) => {
				console.log('actionTakeScreen', returnval.data);
		});
	}

	async delScreen(file) {
		await this._initialize();

		var action = "deleteScreenshot"

		var option = {
			"file": file
		}

		this._postAction(action, option).then((returnval) => {
			console.log(returnval);
		});
	}

	async getScreen() {
		await this._initialize();

		var action = "screenshotsList"

		this._getParser(action).then((returnval) => {
			console.log(returnval.screenshotsList);
		});
	}

	/**
	 * Retourne le status actuel de EmulationStation
	 * 
	 * @return ok or ko
	 */
	async getStatusES() {
		await  this._initialize();

		var option = "ESStatus"

		this._getParser(option).then((returnval) => {
			console.log(returnval.ESStatus);
		});
	}

	async rebootES(action) {
		await this._initialize();

		var action = "reboot-es"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async shutdownES(action) {
		await this._initialize();

		var action = "shutdown-es"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async startES(action) {
		await this._initialize();

		var action = "start-es"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async rebootOS(action) {
		await this._initialize();

		var action = "reboot-os"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async shutdownOS(action) {
		await this._initialize();

		var action = "shutdown-os"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async getCookie() {
		await this._initialize();
		
		return this.cookie;
	}

}

var api = new Recal();

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

