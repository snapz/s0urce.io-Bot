const portToLetter = ['A','B','C'];
const difficultyNumberToName = ['e','m','h'];
const myBot_helpers = {
    getRandomArbitrary(min, max) {
    	return Math.random() * (max - min) + min;
    }
};

// Firewall upgrade
const firewallUpgrade_buyFiveCharge = 0;
const firewallUpgrade_buyMaxChargePlusFive = 1;
const firewallUpgrade_buyUpgradeStrengh = 2;
const firewallUpgrade_buyIncreaseRegen = 3;

const firewallUpgrade_buyMaxChargePlusFive_MAXlvl = 4;
const firewallUpgrade_buyUpgradeStrengh_MAXlvl = 4;
const firewallUpgrade_buyIncreaseRegen_MAXlvl = 10;

// Miner
const minerUpgrade_BasicMiner = 0;
const minerUpgrade_AdvancedMiner = 1;
const minerUpgrade_MiningDrill = 2;
const minerUpgrade_DataCenter = 3;
const minerUpgrade_Botnet = 4;
const minerUpgrade_QuantumServer = 5;

const TASK_STREAM_PACKAGE = 2010;
const TASK_UPDATE_LEADERBOARD = 2008;
const TASK_UPDATE_PLAYER = 2009;
const TASK_CHAT_RECEIVE = 2006;
const TASK_ATTACK_STARTED = 2002;
const TASK_UPDATE_WORD_LIST = 2001;
const TASK_ATTACK_UPDATE = 2004;
const TASK_ATTACK_SUCCESS = 2003;
const TASK_UPDATE_TARGET = 2007;
const TASK_UPDATE_FIREWALL = 2005;
const TASK_LOG = 2000;
const TASK_UPDATE_RANK = 3001;

const TASK_WORD_GET = 333;
 
//Client messages
const TASK_ATTACK = 100;
const TASK_WORD_SEND = 777;
const TASK_SHOP_FIREWALL = 102;
const TASK_SHOP_MINER = 103;
const TASK_UPDATE_QUOTE = 104;
const TASK_SIGNATURE = 106;
const TASK_CHAT_SEND = 300;
const TASK_SET_TARGET = 105;


function myBot(objectOfWord = {}) {
	this.socket = io.connect('ws://s0urce.io');

	this.coins = null;
	this.firewall = null;
	this.firewall = null;
	this.market = null;
	this.whitelist = {};
	this.difficultyWord = {};
	this.currentDf = 0;
	this.isOnline = false;

	this.difficultyWord = objectOfWord;
	this.actualWord = null;

	this.player = new player();
	this.target  = new player();
	this.leaderboard = [];
	this.attack_progress = 0;
	this.attack_state = 0;
	this.looking_for_target = false;
	this.delay_upgradeTrenteSeconde = [0,0,0];
	this.lastTimeFirewallUpgrade = 0;

	this.actualNameWeAttack = null;

    this.socket.on('prepareClient', this._on_prepareClient)
    this.socket.on('mainPackage', this._on_mainPackage)

	helpers.log('purple', 'INSTANCIATION', 'Instanciation de la classe <b>myBot</b> avec succès en attente de connexion...');
}

/*****************************************************/
/* FONCTION APPELER DANS SOCKET ON = THIS MARCHE PAS */
/*****************************************************/
myBot.prototype._on_prepareClient = function(message) {
    window.myBot.player.id = message.id
	window.myBot.isOnline = true;
};

myBot.prototype._on_mainPackage = function(message) {
	Object.keys(message.unique).map(function(objectKey, index) {
		var unique = message.unique[objectKey];
	    var task = unique.task;
        if (task == TASK_STREAM_PACKAGE)
        	window.myBot.__proto__._on_task_stream_package(unique["data"])
        else if(task == TASK_UPDATE_LEADERBOARD)
            window.myBot.__proto__._on_task_update_leaderboard(unique["data"])
        else if(task == TASK_UPDATE_PLAYER)
            window.myBot.__proto__._on_task_update_player(unique["content"])
        else if(task == TASK_CHAT_RECEIVE)
            window.myBot.__proto__._on_task_chat_receive(unique)
        else if(task == TASK_ATTACK_STARTED)
            window.myBot.__proto__._on_task_attack_started(unique)
        else if(task == TASK_UPDATE_WORD_LIST)
            window.myBot.__proto__._on_task_update_word_list(unique["words"])
        else if(task == TASK_ATTACK_UPDATE)
            window.myBot.__proto__._on_task_attack_update(unique["state"])
        else if(task == TASK_ATTACK_SUCCESS)
            window.myBot.__proto__._on_task_attack_success(unique)
        else if(task == TASK_UPDATE_TARGET)
            window.myBot.__proto__._on_task_update_target(unique["data"])
        else if(task == TASK_UPDATE_FIREWALL)
        	window.myBot.__proto__._on_task_update_firewall(unique["data"])
        else if(task == TASK_LOG)
            window.myBot.__proto__._on_task_log(unique["data"])
        else if(task == TASK_UPDATE_RANK)
            window.myBot.__proto__._on_task_update_rank(unique["rank"])
        else if(task == TASK_WORD_GET) window.myBot.__proto__._on_task_word_get(unique)
        else
            helpers.log('red', 'ERROR', '_on_mainPackage task inconnue = ' + task + " !");
	});
};

myBot.prototype._on_task_word_get = function(data) {
	console.log("_on_task_word_get")
	// Wrong word
	if(data.opt === 0)
	{
		helpers.log('red', 'WORD', 'Erreur mot send incorrect !');
		window.setTimeout(function() {
			window.myBot.__proto__.send_word();
		}, 1000);
	}
	// Good word
	else if(data.opt === 2)
	{
		helpers.log('green', 'WORD', 'Mot send correct !');
	}
	// Challenge word
	else if(data.opt === 1)
	{
		window.myBot.actualWord = window.myBot.difficultyWord[data.url.t][data.url.i]
		helpers.log('orange', 'WORD', 'Le mot demandé est : ' + data.url.t + ' ' + data.url.i + ' ('+ window.myBot.actualWord +')');
	}
};

myBot.prototype._on_task_stream_package = function(data) {
    window.myBot.coins = data.coins;
    window.myBot.market = data.market;
    var forcePacket = false;

    if(window.myBot.firewall != null && window.myBot.firewall != undefined)
    {
	    for (var portIndex = 0; portIndex < 3; portIndex++) {
		    if(data.firewall[portIndex].charges < data.firewall[portIndex].max_charges)
		    {
			    window.myBot.__proto__.send_TASK_SHOP_FIREWALL(portIndex, firewallUpgrade_buyFiveCharge);
		    }
	    }
    }

    window.myBot.firewall = data.firewall;
    helpers.updateLineOfTableau();
    helpers.updateLineOfTableau_ourFirewall();
    helpers.updateLineOfTableau_ourMiner();
};

myBot.prototype._on_task_update_leaderboard = function(data) {
	var tempLeaderboard = [];
	Object.keys(data).map(function(objectKey, index) {
		var dataPlayer = data[objectKey];

		if(window.myBot.player.id != dataPlayer.id)
		{
			var playerTemp = new player();
			playerTemp.update(dataPlayer);
			tempLeaderboard.push(playerTemp);
		}
		else
		{
			window.myBot.player.update(dataPlayer);
			helpers.updateLineOfTableau();
		}
	});
	window.myBot.leaderboard = tempLeaderboard;
};

myBot.prototype._on_task_update_player = function(content) {
	window.myBot.player.update(content);
	helpers.updateLineOfTableau();
};

myBot.prototype._on_task_chat_receive = function(chat) {
	var messaged = chat.message.replace('<', '[')
	messaged = messaged.replace('>', ']');
	helpers.log('green', 'MP de : ' + chat.name + ' (id : <a onclick=\'setMpId("'+chat.id+'")\'>' + chat.id + '</a>)', messaged, LOG_.mp);
	//window.myBot.__proto__.chat_send(chat.id, "Auto asnwer ? :D")
};

myBot.prototype._on_task_attack_started = function(unique) {
	console.log("_on_task_attack_started")
	window.myBot.attack_progress = 0;
	window.myBot.attack_state = 1;

	window.myBot.currentDf = unique.df;

	
	window.setTimeout(function() {
		window.myBot.__proto__.send_word();
	}, 500);
};


myBot.prototype._on_task_update_word_list = function(words) {
	console.log("_on_task_update_word_list " + JSON.stringify(words))
	var request = [];
	Object.keys(words).map(function(objectKey, index) {
		request.push({"task": TASK_WORD_SEND, "word": words[objectKey][0]})
	});
	window.myBot.__proto__._player_request(request);
};

myBot.prototype._on_task_attack_update = function(state) {
	console.log("_on_task_attack_update")
	window.myBot.attack_progress = 100 - Math.round(state.charges / state.max_charges * 100);
	if(state.charges > 0){
		helpers.log('orange', 'ATTACK', 'Charges restantes de <b>'+window.myBot.actualNameWeAttack+'</b> : ' + state.charges + '/' + state.max_charges + ' ('+ (100 - window.myBot.attack_progress) +'%)');
		window.setTimeout(function() {
			window.myBot.__proto__.send_word();
		}, 500);
	}

};

myBot.prototype._on_task_attack_success = function(unique) {
	console.log("_on_task_attack_success")
	window.myBot.attack_state = 2;
	helpers.log('green', 'ATTACK', 'Fin du hack de <b>'+window.myBot.actualNameWeAttack+'</b> victoire !');
	window.myBot.__proto__.signature(mySignature);
	window.myBot.__proto__.askUpdateFirewall();
	window.myBot.__proto__.launch_attack_process();
/*
"This port has been closed. Try another"
"Target is disconnected from the Server."
"<br>Hacking successful. Reward: 0.012 BT<br><br> Select a new Port."
*/
};
myBot.prototype.askUpdateFirewall = function() {
	if(!window.myBot.__proto__.ourFirewallIsFullUpgraded())
	{
		for (var portIndex = 0; portIndex < 3; portIndex++) {
			if(window.myBot.firewall[portIndex].upgrades[firewallUpgrade_buyMaxChargePlusFive].amount < firewallUpgrade_buyMaxChargePlusFive_MAXlvl)
				window.myBot.__proto__.send_TASK_SHOP_FIREWALL(portIndex, firewallUpgrade_buyMaxChargePlusFive);

			if(window.myBot.firewall[portIndex].upgrades[firewallUpgrade_buyUpgradeStrengh].amount < firewallUpgrade_buyUpgradeStrengh_MAXlvl)
				window.myBot.__proto__.send_TASK_SHOP_FIREWALL(portIndex, firewallUpgrade_buyUpgradeStrengh);

			if(window.myBot.firewall[portIndex].upgrades[firewallUpgrade_buyIncreaseRegen].amount < firewallUpgrade_buyIncreaseRegen_MAXlvl)
			{
				window.myBot.__proto__.send_TASK_SHOP_FIREWALL(portIndex, firewallUpgrade_buyIncreaseRegen);
				window.myBot.__proto__.send_TASK_SHOP_FIREWALL(portIndex, firewallUpgrade_buyIncreaseRegen);
			}
		}
	}
	// Sinon ont go upgrade les miners
	else window.myBot.__proto__.tryUpdateMiner();
};

myBot.prototype._on_task_update_target = function(data) {
	console.log("_on_task_update_target")
    window.myBot.target.update(data);
    window.myBot.looking_for_target = false;
};

myBot.prototype._on_task_update_firewall = function(data) {
	console.log("_on_task_update_firewall")
    var colorUse = (data.hacked) ? 'red' : 'green';
    var yesOrNo = (data.hacked) ? 'Oui' : 'Finis';
    helpers.log(colorUse, 'HACK', 'Port <b>'+portToLetter[data.port]+'</b> hack en cours : <b>' + yesOrNo + '</b>', LOG_.firewall);
};

myBot.prototype._on_task_log = function(data) {
	console.log("_on_task_log")
	if(data.type == 2) window.myBot.attack_state = 3;
    helpers.log('red', 'HACK', 'Tentative de hack du port <b>'+portToLetter[data.port]+'</b> par <b>'+data.name + '</b> ('+data.id+')', LOG_.event);
};

myBot.prototype._on_task_update_rank = function(rank) {
	console.log("_on_task_update_target")
    window.myBot.player.rank = rank;
};




/********************/
/* CALL DES BOUTON */
/******************/
myBot.prototype.signIn = function(name) {

	helpers.log('green', 'LOGIN', 'Connexion avec le pseudo : <b>' + name + '</b> veuillez patientez 3 secondes...');
	this.socket.emit("signIn", {name: name});
	setTimeout(function(){ 
		window.myBot.__proto__.update_quote(myQuote)
		helpers.log('orange', 'QUOTE', 'La quote <b>' + myQuote + '</b> est assigné !');
	}, 3000);
};

/********************/
/* FUNCTION CLIENTS */
/********************/

myBot.prototype._player_request = function(request) {
	Object.keys(request).map(function(objectKey, index) {
		window.myBot.socket.emit("playerRequest", request[objectKey]);
	});
};

myBot.prototype.update_quote = function(description) {
	this._player_request([{
        "task": TASK_UPDATE_QUOTE,
        "desc": description
    }]);
};

myBot.prototype.signature = function(message) {
	this._player_request([{
        "task": TASK_SIGNATURE,
        "text": message
    }]);
};

myBot.prototype.chat_send = function(target_id, message) {
	this._player_request([{
        "task": TASK_CHAT_SEND,
        "id": target_id,
        "message": message
    }]);
	helpers.log('purple', 'MP à <a onclick=\'setMpId("'+target_id+'")\'>' + target_id + '</a>', message, LOG_.mp);
};

myBot.prototype.send_word = function() {

	this._player_request([{
        "task": TASK_WORD_SEND,
        "word": window.myBot.actualWord
    }]);

    helpers.log('orange', 'WORD', 'On send le mot ' + window.myBot.actualWord);
};

myBot.prototype.send_TASK_SHOP_FIREWALL = function(target_port, functionId) {
	var prix = window.myBot.__proto__.calculerPrixUpgradeFirewall(target_port, functionId);
	if(prix <= 0) return;

	if(window.myBot.coins.value >= prix)
	{
		var dateCompare = new Date().getTime() / 1000;
		if(functionId == firewallUpgrade_buyFiveCharge)
		{
			if(window.myBot.__proto__.delayToNextTrenteSecBuyFiveCharge(target_port) > 0) return;
		}
		this._player_request([{
		    "task": TASK_SHOP_FIREWALL,
		    "id": functionId,
		    "fid": target_port
		}]);
		if(functionId == firewallUpgrade_buyFiveCharge) window.myBot.delay_upgradeTrenteSeconde[target_port] = new Date().getTime() / 1000;
		window.myBot.lastTimeFirewallUpgrade = new Date().getTime() / 1000;
	}
};

myBot.prototype.send_TASK_SHOP_MINER = function(idMiner) {
	this._player_request([{
        "task": TASK_SHOP_MINER,
        "id": idMiner
    }]);
};

myBot.prototype.delayToNextTrenteSecBuyFiveCharge = function(target_port) {
	var dataActuel = new Date().getTime() / 1000;
	var calculDate = window.myBot.delay_upgradeTrenteSeconde[target_port] - (dataActuel - 34);
	if(calculDate <= 0) return -1;
	else return calculDate;
};

myBot.prototype.calculerPrixUpgradeFirewall = function(target_port, functionId) {

	var multiPlicateur = 0;
	if(functionId == firewallUpgrade_buyFiveCharge) multiPlicateur = 20;
	if(functionId == firewallUpgrade_buyMaxChargePlusFive) multiPlicateur = 30000;
	if(functionId == firewallUpgrade_buyUpgradeStrengh) multiPlicateur = 50000;
	if(functionId == firewallUpgrade_buyIncreaseRegen) multiPlicateur = 15000;
	// On recupere le prix via les rates
	var prix = window.myBot.coins.rate * multiPlicateur;

	if(functionId != firewallUpgrade_buyFiveCharge)
	{
		var maxLevel = 0;
		if(functionId == firewallUpgrade_buyMaxChargePlusFive) maxLevel = firewallUpgrade_buyMaxChargePlusFive_MAXlvl;
		if(functionId == firewallUpgrade_buyUpgradeStrengh) maxLevel = firewallUpgrade_buyUpgradeStrengh_MAXlvl;
		if(functionId == firewallUpgrade_buyIncreaseRegen) maxLevel = firewallUpgrade_buyIncreaseRegen_MAXlvl;

		// Si deja max lvl on passe
		if(window.myBot.firewall[target_port].upgrades[functionId].amount >= maxLevel) return -1;

		// On multiplie le prix par le level
		multiPlicateur = window.myBot.firewall[target_port].upgrades[functionId].amount;
		if(multiPlicateur > 0) prix = prix * multiPlicateur;
	}

	return prix;
};

/* TEST ATTACK */

myBot.prototype.launch_attack_process = function() {
	if(!window.BOT_IS_ACTIVE) return;

	var idToAttack = window.myBot.__proto__.get_random_target_to_attack();
	var portToAttack = window.myBot.__proto__.generer_random_port();
	if(idToAttack == null)
	{
		setTimeout(function(){ window.myBot.__proto__.launch_attack_process(); }, 1000);
		return;
	}
	window.myBot.actualNameWeAttack = idToAttack.name;
	helpers.log('orange', 'ATTACK', 'On va attaquer <b>' + idToAttack.name + '</b> sur le port <b>'+ portToLetter[portToAttack] +'</b>');
	window.myBot.__proto__.attack(idToAttack.id, portToAttack);
};

myBot.prototype.attack = function(target_id, port) {
	if(!window.myBot.__proto__.can_attack())
	{
		helpers.log('red', 'ATTACK', 'Vous n\'avez pas assez de btc pour attaquer');
		setTimeout(function(){ window.myBot.__proto__.launch_attack_process(); }, 1000);
		return;
	}
	window.myBot.attack_state = 0;
	//# self.set_target(target_id) # Don't need to set the target.
	window.myBot.__proto__._player_request([{
        "task": TASK_ATTACK,
        "id": target_id,
        "port": port
    }]);
};

myBot.prototype.can_attack = function() {
	if(window.myBot.coins == null) return false;
	return window.myBot.coins.value >= window.myBot.coins.rate * 5;
};


/************************/
/* UTILS */
/************************/
myBot.prototype.get_random_target_to_attack = function() {
	if(window.myBot.leaderboard.length == 0) return null;
	return window.myBot.leaderboard[Math.floor(Math.random() * window.myBot.leaderboard.length)];
};

myBot.prototype.generer_random_port = function() {
	return Math.floor(Math.random() * (2 - 0 + 1)) + 0;
};

myBot.prototype.getCurrentArrayOfWordByDifficulty = function(df = -1) {
	/*
	if(df < 0) df = window.myBot.currentDf;
	if(df < 0 || df == undefined) df = 0;
	*/
	df = 0;
	return window.myBot.difficultyWord[difficultyNumberToName[df]];
};

myBot.prototype.ourFirewallIsFullUpgraded = function() {
	for (var portIndex = 0; portIndex < 3; portIndex++) {

		if(window.myBot.firewall[portIndex].upgrades[firewallUpgrade_buyMaxChargePlusFive].amount < firewallUpgrade_buyMaxChargePlusFive_MAXlvl)
			return false;

		if(window.myBot.firewall[portIndex].upgrades[firewallUpgrade_buyUpgradeStrengh].amount < firewallUpgrade_buyUpgradeStrengh_MAXlvl)
			return false;

		if(window.myBot.firewall[portIndex].upgrades[firewallUpgrade_buyIncreaseRegen].amount < firewallUpgrade_buyIncreaseRegen_MAXlvl)
			return false;
	}
	return true;
};

myBot.prototype.getBtcPerSecond = function() {
	var btcs = 0;
	for (var minerIndex = 0; minerIndex < 6; minerIndex++) {
		btcs += window.myBot.market[minerIndex].amount * window.myBot.market[minerIndex].rate;
	}

	btcs = btcs - window.myBot.market[minerUpgrade_BasicMiner].rate;
	return ""+helpers.roundDecimal(btcs, 4);
};

myBot.prototype.calculerPrixMiner = function(minerIndex) {
	var price = window.myBot.market[minerIndex].f_cost;
	price = (price > 0) ? price : -1;
	return "" + price;
};


myBot.prototype.tryUpdateMiner = function() {
	setTimeout(function()
	{
		var myCash = helpers.roundDecimal(window.myBot.coins.value, 4);
		for (var minerIndex = 5; minerIndex >= 0; minerIndex--) {
			var multiPlicateur = (minerIndex == 0) ? 1.225 : 1.1;
			var priceNext = window.myBot.__proto__.calculerPrixMiner(minerIndex);
			// Si on a la tune pour acheter au moins la prochaine upgrade
			if(priceNext > 0 && priceNext < (window.myBot.coins.value - (window.myBot.coins.rate * 5 * 20) ))
			{
				// On va la buy & voir pour en buy plusieur
				do
				{
					// On buy
					window.myBot.send_TASK_SHOP_MINER(minerIndex)
					// On enleve le prix
					window.myBot.coins.value -= priceNext;
					// On update le next prix
					priceNext = priceNext * multiPlicateur;

				} while ((window.myBot.coins.value - (window.myBot.coins.rate * 5 * 20) ) > priceNext);
			}
		}
		
	}, 500);
};