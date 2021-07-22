const axios         = require('axios');
const inquirer      = require('inquirer')
const chalk         = require('chalk')
const Recal         = require('./core-cli.js');

class Api extends Recal {

   constructor(url, user){
      super(url, user);
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

module.exports = {
   Api   : Api,
   Recal : Recal
}