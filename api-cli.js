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
		if(await this._initialize() === false) {
			return false;
		}
		
		var option = "temperature"

		this._getParser(option).then((returnval) => {
			console.log('temp', returnval.temperature.current);
		});
	}

	/**
	 * 
	 */
	async getCpu() {
		if(await this._initialize() === false) {
			return false;
		}

		var option = "cpus"

		this._getParser(option).then((returnval) => {
			console.log('cpus', returnval.cpus);
		});
	}

	/**
	 * 
	 */
	async getRam() {
		if(await this._initialize() === false) {
			return false;
		}

		var option = "ram"

		this._getParser(option).then((returnval) => {
			console.log('ram', returnval.ram);
		});
	}

	/**
	 * 
	 */
	async	getDisk() {
		if(await this._initialize() === false) {
			return false;
		}

		var option = "disks"

		this._getParser(option).then((returnval) => {
			console.log('disks', returnval.disks);
		});
	}

	/**
	 * 
	 */
	async getVolume() {
		if(await this._initialize() === false) {
			return false;
		}

		var option = ['audio.device','audio.volume','audio.bgmusic']

		this._grepParser(option).then((returnval) => {
			console.log('Volume :', returnval['audio.volume'].value);
		});
	}

	async saveVolume(volume) {
		if(await this._initialize() === false) {
			return false;
		}

		var option = {
			'audio.volume': volume
		}

		this._postSave(option).then((returnval) => {
			console.log('saveVolume', returnval);
		});
	}

	async saveKodi() {
		if(await this._initialize() === false) {
			return false;
		}

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
		if(await this._initialize() === false) {
			return false;
		}

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
		if(await this._initialize() === false) {
			return false;
		}

		var action = "takeScreenshot"

		this._postAction(action).then((returnval) => {
				console.log('actionTakeScreen', returnval.data);
		});
	}

	async delScreen(file) {
		if(await this._initialize() === false) {
			return false;
		}

		var action = "deleteScreenshot"

		var option = {
			"file": file
		}

		this._postAction(action, option).then((returnval) => {
			console.log(returnval);
		});
	}

	async getScreen() {
		if(await this._initialize() === false) {
			return false;
		}

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
		if(await this._initialize() === false) {
			return false;
		}

		var option = "ESStatus"

		this._getParser(option).then((returnval) => {
			console.log(returnval.ESStatus);
		});
	}

	async rebootES(action) {
		if(await this._initialize() === false) {
			return false;
		}

		var action = "reboot-es"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async shutdownES(action) {
		if(await this._initialize() === false) {
			return false;
		}

		var action = "shutdown-es"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async startES(action) {
		if(await this._initialize() === false) {
			return false;
		}

		var action = "start-es"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async rebootOS(action) {
		if(await this._initialize() === false) {
			return false;
		}
		var action = "reboot-os"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async shutdownOS(action) {
		if(await this._initialize() === false) {
			return false;
		}
		var action = "shutdown-os"

		this._postAction(action).then((returnval) => {
			console.log(returnval);
		});
	}

	async getCookie() {
		if(await this._initialize() === false) {
			return false;
		}
		
		console.log('cookie : ', this.cookie);
	}

}

module.exports = {
   Api   : Api,
   Recal : Recal
}