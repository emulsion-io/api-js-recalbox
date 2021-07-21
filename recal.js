const axios = require('axios');

const url = "http://192.168.1.25"

const user = {
	login : "fabrice",
	password : "test"
}

class Recal {

	cookie = false;
	recal;
	baseAxio =	{
		baseURL: url,
		timeout: 10000,
	}

	constructor() {
		this.recal = axios.create(this.baseAxio);
	}

	getParser(option) {
		return this.recal.get('/get?option=' + option)
			.then(function (response) {
				return response.data.data;
			})
	}

	grepParser(option) {
		return this.recal.get('/grep?keys=' + option.join("|"))
			.then(function (response) {
				return response.data.data;
			})
	}

	postSave(option) {
		let payload = option;
		return this.recal.post('/save', payload)
			.then(function (response) {
				
				return response.data.data;
			})
	}

	postAction(option, payload = {}) {
		return this.recal.post('/post?action=' + option, payload)
			.then(function (response) {
				return response;
			})
			.catch(function (error) {
			  console.log(error);
			})
	}

	/**
	 * 
	 */
	getTemp() {
		var option = "temperature"

		this.getParser(option).then((returnval) => {
			console.log(returnval.temperature.current);
		});
	}

	/**
	 * 
	 */
	getCpu() {
		var option = "cpus"

		this.getParser(option).then((returnval) => {
			console.log(returnval.cpus);
		});
	}

	/**
	 * 
	 */
	getRam() {
		var option = "ram"

		this.getParser(option).then((returnval) => {
			console.log(returnval.ram);
		});
	}

	/**
	 * 
	 */
	getDisk() {
		var option = "disks"

		this.getParser(option).then((returnval) => {
			console.log(returnval.disks);
		});
	}

	/**
	 * 
	 */
	 getVolume() {
		var option = ['audio.device','audio.volume','audio.bgmusic']

		this.grepParser(option).then((returnval) => {
			console.log(returnval);
		});
	}

	saveVolume(volume) {
		var option = {
			'audio.volume': volume
		}

		this.postSave(option).then((returnval) => {
			console.log(returnval);
		});
	}

	saveKodi() {
		var option = {
			"kodi.enabled": "0",
			"kodi.atstartup": "0",
			"kodi.xbutton": "0"
		}

		this.postSave(option).then((returnval) => {
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

		this.postSave(option).then((returnval) => {
			console.log(returnval);
		});
	}

	actionTakeScreen() {
		var action = "takeScreenshot"

		this.actionNeedAuth().then(() => {

			this.postAction(action).then((returnval) => {
				console.log(returnval);
			});

		});
		
	}

	actionDelScreen(file) {
		var action = "deleteScreenshot"

		var option = {
			"file": file
		}

		this.postAction(action, option).then((returnval) => {
			console.log(returnval);
		});
	}

	getScreen() {
		var action = "screenshotsList"

		this.getParser(action).then((returnval) => {
			console.log(returnval.screenshotsList);
		});
	}

	/**
	 * @return ok or ko
	 */
	getStatusES() {
		var option = "ESStatus"

		this.getParser(option).then((returnval) => {
			console.log(returnval.ESStatus);
		});
	}

	actionRebootES(action) {
		var action = "reboot-es"

		this.postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	actionShutdownES(action) {
		var action = "shutdown-es"

		this.postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	actionStartES(action) {
		var action = "start-es"

		this.postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	actionRebootOS(action) {
		var action = "reboot-os"

		this.postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	actionShutdownOS(action) {
		var action = "shutdown-os"

		this.postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async actionLogin() {
		var action = "login"

		let option = {
			"login": user.login,
			"password": user.password
		};

		return await this.postAction(action, option).then((returnval) => {

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

	async actionNeedAuth() {
		var option = "needAuth"

		await this.getParser(option).then((returnval) => {

			if(returnval.needAuth === true) {
				this.actionLogin();
				console.log('need auth', returnval.needAuth);
			}

		});
	}

	getCookie() {
		console.log('retour de mon cookies apres login', this.cookie);
	}

}

var api = new Recal();

//api.getStatusES();
//api.actionNeedAuth()

api.actionTakeScreen()


//api.actionTakeScreen();
