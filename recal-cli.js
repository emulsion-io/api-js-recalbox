const axios         = require('axios')
const inquirer      = require('inquirer')
const chalk         = require('chalk')

const core          = require('./api-cli.js').Recal
const recall        = require('./api-cli.js').Api

var url = "http://recalbox"

var user = {
	login : "",
	password : ""
}

var api = new recall(url, user);

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

