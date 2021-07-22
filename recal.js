const axios = require('axios');

const url = "http://recalbox"

const user = {
	login : "",
	password : ""
}

class Recal {

	recal;
	response;
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

				console.log('test si besoin auth');

				if(returnval.needAuth === true) {

					console.log('need auth', returnval.needAuth);

					if ( user.login === "" || user.password === "") {
						console.log("login or password empty");
						return;
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
							
							console.log('login ok');

							this.recal = axios.create(this.baseAxio);

							return 'logged';

						});

					}
				} else {
					console.log('no need auth');
				}
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

api.getStatusES();
api.takeScreen();
