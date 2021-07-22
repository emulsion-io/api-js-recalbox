const axios = require('axios');

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

	async login() {

		if (this.cookie === null) {

			return await this._getParser("needAuth").then( async (returnval) => {

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
			console.log(returnval.ESStatus);
		});
	}

	rebootES(action) {
		var action = "reboot-es"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	shutdownES(action) {
		var action = "shutdown-es"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	startES(action) {
		var action = "start-es"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	rebootOS(action) {
		var action = "reboot-os"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	shutdownOS(action) {
		var action = "shutdown-os"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	getCookie() {
		return this.cookie;
	}

}

var api = new Recal();

api.login().then(() => {
		api.takeScreen()
		//api.getTemp()
		//api.getCookie()
	}
);
