const helpers = {
    createCORSRequest(method, url) {
        var xhr = new window.XMLHttpRequest();
        if ("withCredentials" in xhr) {

            xhr.open(method, url, true);

        } else if (typeof XDomainRequest != "undefined") {


            xhr = new window.XDomainRequest();
            xhr.open(method, url);

        } else {
            xhr = null;

        }
        return xhr;
    },
    key: {
        n(e) {
            for (var t = 0, i = 0; i < e.length; i++)
                t += e.charCodeAt(i) % 16;
            return (t % 16).toString(16).toUpperCase()
        },
        o() {
            var e = Math.ceil(100 * Math.random());
            return e <= 40 ? String.fromCharCode(Math.floor(26 * Math.random()) + 65) : e <= 80 ? String.fromCharCode(Math.floor(26 * Math.random()) + 97) : String.fromCharCode(Math.floor(10 * Math.random()) + 48)
        },
        a() {
            for (var e = "", t = 0; t < 20; t++)
                e += helpers.key.o();
            return e + helpers.key.n(e)
        }
    },
    n(e, session) {
        if (!session)
            return helpers.log("red", "Cannot make URL sticky (no session ID has been set):" + e)
        e;
        var t = e.indexOf("?") === -1 ? "?" : "&";
        return e + "/primus/" + "?" + "STICKER" + "=" + encodeURIComponent(session)
    },
    xmhr(callback, method, address, data = null, headers = false) {

        var request = helpers.createCORSRequest(method, address)
        if (headers)
            for (let header of headers)
            {
                request.setRequestHeader(header['name'], header['data']);
            }

        request.setRequestHeader("Accept", "application/json");


        request.send(data);
        request.onload = function() {
            callback(JSON.parse(request.responseText))
        }
    },
    xmhr2(callback, method, address, data = null, headers = false) {

        $.ajax({
            type: method, 
            url: address,
            contentType: "application/json",
            data : data,
            beforeSend: function(xhr, settings){
                if (headers)
                {
                    for (let header of headers)
                    {
                        xhr.setRequestHeader(header['name'], header['data']);
                    }
                }
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Accept-Language", "fr");
                //xhr.setRequestHeader("origin", "*");
                xhr.setRequestHeader("Content-Type", "");
            },
            success: function(data){
                callback(data)
            },
            error: function(data){
                callback(data)
            }
        });
    },
    toUrl(data) {
        return Object.keys(data).map((i) => i + '=' + data[i]).join('&')
    },
    addBotInGui(idPlayer = "myIdPlayer") {
        // ADD ROW TABLEAU PRINCIPALE
        var tempTr = document.createElement('tr');
        tempTr.id ="tableLigne_" + idPlayer
        //tempTr.innerHTML = '<td id="tableCollone_1">'+idPlayer+'</td>';
        for (i = 0; i < $("#tableauGuiThead tr > th").length - 1; i++) {
            tempTr.innerHTML = tempTr.innerHTML + '<td id="tableCollone_'+(i+1)+'"></td>';
        }
        document.getElementById('tableauGui').insertBefore(tempTr, document.getElementById('tableauGui').lastChild);


        // ADD ROW TABLEAU FIREWALL/PORT
        for (var portIndex = 0; portIndex < 3; portIndex++) {
            //portIndex
            ///portToLetter[portIndex];
            var tempTr = document.createElement('tr');
            tempTr.id ="tableLigne_ourFirewall_" + portIndex
            //tempTr.innerHTML = '<td id="tableCollone_1">'+idPlayer+'</td>';
            for (i = 0; i < $("#tableauGuiThead_ourFirewall tr > th").length - 1; i++) {
                if(i == 0) tempTr.innerHTML = tempTr.innerHTML + '<td style="text-align:center;" id="tableCollone_ourFirewall_'+(i+1)+'">' + portToLetter[portIndex] + '</td>';
                else tempTr.innerHTML = tempTr.innerHTML + '<td id="tableCollone_ourFirewall_'+(i+1)+'"></td>';
            }
            document.getElementById('tableauGui_ourFirewall').insertBefore(tempTr, document.getElementById('tableauGui_ourFirewall').lastChild);
        }

        // ADD ROW TABLEAU MINER
        var tempTr = document.createElement('tr');
        tempTr.id ="tableLigne_ourMiner_" + idPlayer
        //tempTr.innerHTML = '<td id="tableCollone_1">'+idPlayer+'</td>';
        for (i = 0; i < $("#tableauGuiThead_ourMiner tr > th").length - 1; i++) {
            tempTr.innerHTML = tempTr.innerHTML + '<td id="tableCollone_ourMiner_'+(i+1)+'"></td>';
        }
        document.getElementById('tableauGui_ourMiner').insertBefore(tempTr, document.getElementById('tableauGui_ourMiner').lastChild);
        helpers.initLineOfTableau_ourMiner();
    },
    setTableauGuiValue(idPlayer = "myIdPlayer", idCollone, newvalue) {
        $('#tableauGui #tableLigne_'+idPlayer+' #tableCollone_'+idCollone).html(newvalue);
    },
    getTableauGuiValue(idPlayer = "myIdPlayer", idCollone) {
        return $('#tableauGui #tableLigne_'+idPlayer+' #tableCollone_'+idCollone).html();
    },
    updateLineOfTableau(idPlayer = "myIdPlayer") {
        // rank 1
        if(helpers.getTableauGuiValue(idPlayer, 1) != window.myBot.player.rank) 
            helpers.setTableauGuiValue(idPlayer, 1, window.myBot.player.rank)

        // name 2
        if(helpers.getTableauGuiValue(idPlayer, 2) != window.myBot.player.name) 
            helpers.setTableauGuiValue(idPlayer, 2, window.myBot.player.name)

        // Level 3
        if(helpers.getTableauGuiValue(idPlayer, 3) != window.myBot.player.level) 
            helpers.setTableauGuiValue(idPlayer, 3, window.myBot.player.level)

        // PORT A B C = 4 5 6
        for (var portIndex = 4; portIndex < 7; portIndex++) {
            var currentRealIndex = portIndex - 4;
            var currentFirewall = window.myBot.firewall[currentRealIndex];

            var newtxt = currentFirewall.charges + '/' + currentFirewall.max_charges + ' ('+Math.round(currentFirewall.charges / currentFirewall.max_charges * 100)+'%)';

            if(helpers.getTableauGuiValue(idPlayer, portIndex) != newtxt) 
                helpers.setTableauGuiValue(idPlayer, portIndex, newtxt)

        }

        // BTC 7
        var btcVal = helpers.roundDecimal(window.myBot.coins.value, 4);
        
        if(helpers.getTableauGuiValue(idPlayer, 7) != btcVal) 
            helpers.setTableauGuiValue(idPlayer, 7, btcVal)

        // BTC/s 8
        var btcsVal = window.myBot.getBtcPerSecond() + ' BTC/s';
        
        if(helpers.getTableauGuiValue(idPlayer, 8) != btcsVal) 
            helpers.setTableauGuiValue(idPlayer, 8, btcsVal)
    },
    setTableauGuiValue_ourFirewall(portIndex, idCollone, newvalue) {
        $('#tableauGui_ourFirewall #tableLigne_ourFirewall_'+portIndex+' #tableCollone_ourFirewall_'+idCollone).html(newvalue);
    },
    getTableauGuiValue_ourFirewall(portIndex, idCollone) {
        return $('#tableauGui_ourFirewall #tableLigne_ourFirewall_'+portIndex+' #tableCollone_ourFirewall_'+idCollone).html();
    },
    updateLineOfTableau_ourFirewall() {
        for (var portIndex = 0; portIndex < 3; portIndex++) {
            // FiveCharge 2
            var delayFirewall = window.myBot.delayToNextTrenteSecBuyFiveCharge(portIndex);
            var newTxt = (delayFirewall <= 0) ? 'Disponible' : 'Attente : ' + Math.ceil(delayFirewall) + 's';
            if(helpers.getTableauGuiValue_ourFirewall(portIndex, 2) != newTxt) 
                helpers.setTableauGuiValue_ourFirewall(portIndex, 2, newTxt)

            // MaxChargePlusFive 3
            var priceFirewall = window.myBot.calculerPrixUpgradeFirewall(portIndex, firewallUpgrade_buyMaxChargePlusFive);
            priceFirewall = (priceFirewall > 0) ? ' (next: '+Math.ceil(priceFirewall)+' btc)' : ' (maxed)';
            var newTxt = window.myBot.firewall[portIndex].upgrades[firewallUpgrade_buyMaxChargePlusFive].amount + '/' + firewallUpgrade_buyMaxChargePlusFive_MAXlvl + priceFirewall;
            if(helpers.getTableauGuiValue_ourFirewall(portIndex, 3) != newTxt) 
                helpers.setTableauGuiValue_ourFirewall(portIndex, 3, newTxt)

            // Strength 4
            var priceFirewall = window.myBot.calculerPrixUpgradeFirewall(portIndex, firewallUpgrade_buyUpgradeStrengh);
            priceFirewall = (priceFirewall > 0) ? ' (next: '+Math.ceil(priceFirewall)+' btc)' : ' (maxed)';
            var newTxt = window.myBot.firewall[portIndex].upgrades[firewallUpgrade_buyUpgradeStrengh].amount + '/' + firewallUpgrade_buyUpgradeStrengh_MAXlvl + priceFirewall;
            if(helpers.getTableauGuiValue_ourFirewall(portIndex, 4) != newTxt) 
                helpers.setTableauGuiValue_ourFirewall(portIndex, 4, newTxt)

            // Regeneration 5
            var priceFirewall = window.myBot.calculerPrixUpgradeFirewall(portIndex, firewallUpgrade_buyIncreaseRegen);
            priceFirewall = (priceFirewall > 0) ? ' (next: '+Math.ceil(priceFirewall)+' btc)' : ' (maxed)';
            var newTxt = window.myBot.firewall[portIndex].upgrades[firewallUpgrade_buyIncreaseRegen].amount + '/' + firewallUpgrade_buyIncreaseRegen_MAXlvl + priceFirewall;
            if(helpers.getTableauGuiValue_ourFirewall(portIndex, 5) != newTxt) 
                helpers.setTableauGuiValue_ourFirewall(portIndex, 5, newTxt)
        }
    },
    setTableauGuiValue_ourMiner(idPlayer = "myIdPlayer", idCollone, newvalue) {
        $('#tableauGui_ourMiner #tableLigne_ourMiner_'+idPlayer+' #tableCollone_ourMiner_'+idCollone).html(newvalue);
    },
    getTableauGuiValue_ourMiner(idPlayer = "myIdPlayer", idCollone) {
        return $('#tableauGui_ourMiner #tableLigne_ourMiner_'+idPlayer+' #tableCollone_ourMiner_'+idCollone).html();
    },
    updateLineOfTableau_ourMiner(idPlayer = "myIdPlayer") {
        // BasicMiner 1
        var priceNextMiner = window.myBot.calculerPrixMiner(minerUpgrade_BasicMiner);
        priceNextMiner = (priceNextMiner > 0) ? ' (next: '+helpers.roundDecimal(priceNextMiner, 4)+' btc)' : ' (maxed)';
        priceNextMiner = window.myBot.market[minerUpgrade_BasicMiner].amount + priceNextMiner;
        if(helpers.getTableauGuiValue_ourMiner(idPlayer, 1) != priceNextMiner) 
            helpers.setTableauGuiValue_ourMiner(idPlayer, 1, priceNextMiner)

        // AdvancedMiner 2
        var priceNextMiner = window.myBot.calculerPrixMiner(minerUpgrade_AdvancedMiner);
        priceNextMiner = (priceNextMiner > 0) ? ' (next: '+helpers.roundDecimal(priceNextMiner, 4)+' btc)' : ' (maxed)';
        priceNextMiner = window.myBot.market[minerUpgrade_AdvancedMiner].amount + priceNextMiner;
        if(helpers.getTableauGuiValue_ourMiner(idPlayer, 2) != priceNextMiner) 
            helpers.setTableauGuiValue_ourMiner(idPlayer, 2, priceNextMiner)

        // MiningDrill 3
        var priceNextMiner = window.myBot.calculerPrixMiner(minerUpgrade_MiningDrill);
        priceNextMiner = (priceNextMiner > 0) ? ' (next: '+helpers.roundDecimal(priceNextMiner, 4)+' btc)' : ' (maxed)';
        priceNextMiner = window.myBot.market[minerUpgrade_MiningDrill].amount + priceNextMiner;
        if(helpers.getTableauGuiValue_ourMiner(idPlayer, 3) != priceNextMiner) 
            helpers.setTableauGuiValue_ourMiner(idPlayer, 3, priceNextMiner)

        // DataCenter 4
        var priceNextMiner = window.myBot.calculerPrixMiner(minerUpgrade_DataCenter);
        priceNextMiner = (priceNextMiner > 0) ? ' (next: '+helpers.roundDecimal(priceNextMiner, 4)+' btc)' : ' (maxed)';
        priceNextMiner = window.myBot.market[minerUpgrade_DataCenter].amount + priceNextMiner;
        if(helpers.getTableauGuiValue_ourMiner(idPlayer, 4) != priceNextMiner) 
            helpers.setTableauGuiValue_ourMiner(idPlayer, 4, priceNextMiner)

        // Botnet 5
        var priceNextMiner = window.myBot.calculerPrixMiner(minerUpgrade_Botnet);
        priceNextMiner = (priceNextMiner > 0) ? ' (next: '+helpers.roundDecimal(priceNextMiner, 4)+' btc)' : ' (maxed)';
        priceNextMiner = window.myBot.market[minerUpgrade_Botnet].amount + priceNextMiner;
        if(helpers.getTableauGuiValue_ourMiner(idPlayer, 5) != priceNextMiner) 
            helpers.setTableauGuiValue_ourMiner(idPlayer, 5, priceNextMiner)

        // QuantumServer 6
        var priceNextMiner = window.myBot.calculerPrixMiner(minerUpgrade_QuantumServer);
        priceNextMiner = (priceNextMiner > 0) ? ' (next: '+helpers.roundDecimal(priceNextMiner, 4)+' btc)' : ' (maxed)';
        priceNextMiner = window.myBot.market[minerUpgrade_QuantumServer].amount + priceNextMiner;
        if(helpers.getTableauGuiValue_ourMiner(idPlayer, 6) != priceNextMiner) 
            helpers.setTableauGuiValue_ourMiner(idPlayer, 6, priceNextMiner)
    },
    initLineOfTableau_ourMiner(idPlayer = "myIdPlayer") {
        // BasicMiner 1
        helpers.setTableauGuiValue_ourMiner(idPlayer, 1, 1)
        // AdvancedMiner 2
        helpers.setTableauGuiValue_ourMiner(idPlayer, 2, 0)
        // MiningDrill 3
        helpers.setTableauGuiValue_ourMiner(idPlayer, 3, 0)
        // DataCenter 4
        helpers.setTableauGuiValue_ourMiner(idPlayer, 4, 0)
        // Botnet 5
        helpers.setTableauGuiValue_ourMiner(idPlayer, 5, 0)
        // QuantumServer 6
        helpers.setTableauGuiValue_ourMiner(idPlayer, 6, 0)
    },
    roundDecimal(nombre, precision) {
        var precision = precision || 2;
        var tmp = Math.pow(10, precision);
        return Math.round( nombre*tmp )/tmp;
    },  
    log(color, label, description = "", nameOfConsole = "console") {
        var tempLi = document.createElement('li');

        var date = new Date();
        var date_str = (date.getHours()<10?'0':'')+date.getHours();
        date_str += ':'+(date.getMinutes()<10?'0':'')+date.getMinutes();
        date_str += ':'+(date.getSeconds()<10?'0':'')+date.getSeconds();
        tempLi.innerHTML = '<div class="ui label"><i class="time icon"></i> ' + date_str + '</div>';

        if(description == "") tempLi.innerHTML = tempLi.innerHTML + '&nbsp;<div class="ui '+ color + ' label" style="font-family:verdana;">' + label + '</div>'
        else tempLi.innerHTML = tempLi.innerHTML + '&nbsp;<div class="ui '+ color + ' label" style="font-family:verdana;">' + label + '</div> '  + description

        document.getElementById(nameOfConsole + '_All').insertBefore(tempLi, document.getElementById(nameOfConsole + '_All').firstChild) 
        if($('#' + nameOfConsole + '_All li').length >= 500 && nameOfConsole != LOG_.security) $('#' + nameOfConsole + '_All li:last-child').remove();

    }
}

helpers.log("grey", "Bienvenue sur Bot s0urce.io by sNapz")
