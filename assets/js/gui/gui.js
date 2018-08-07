/****************************************************************
/ ** BOUTON CONNECTER
*****************************************************************/
document.getElementById('connecter').addEventListener('click', function() {

  if(!window.myBot.isOnline) window.myBot.signIn(myBotName);

});


/****************************************************************
/ ** BOUTON VIDER CONSOLE
*****************************************************************/
document.getElementById('viderConsole').addEventListener('click', function() {

  $('#tabOfConsole .active > .console').empty();

});


document.getElementById('mp_send').addEventListener('click', function() {

  var mp_ID = document.getElementById('mp_id').value;
  var mp_TEXT = document.getElementById('mp_text').value;
  if(mp_ID == "") { alert("Veuillez remplir le champ ID pour envoyer un MP !"); return; }
  if(!window.myBot.isOnline) { alert("Veuillez connecter le bot pour envoyer un MP !"); return; }
  window.myBot.chat_send(mp_ID, mp_TEXT)
  document.getElementById('mp_text').value = '';
  document.getElementById('mp_text').focus();
});

/****************************************************************
/ ** BOUTON OnOff Le bot
*****************************************************************/
document.getElementById('OnOfBot').addEventListener('click', function() {


  if(window.BOT_IS_ACTIVE == false)
  {
    window.BOT_IS_ACTIVE = true;
    updateButtonCssBotOnOff()
    window.myBot.launch_attack_process();
  }
  else
  {
    window.BOT_IS_ACTIVE = false;
    for (idBot in window.BOTS)
    {
      window.BOTS[idBot].config.BOT_IS_ACTIVE = false;
    }
    updateButtonCssBotOnOff()
  }

});


var updateButtonCssBotOnOff = function() {
  if(window.BOT_IS_ACTIVE == false)
  {
    $('#OnOfBot').text("Activer le bot");
    $('#OnOfBot').addClass("green");
    $('#OnOfBot').removeClass("red");
    helpers.log('red', 'ETAT', 'Bot <strong>désactivée</strong> !');
  }
  else
  {
    $('#OnOfBot').text("Désactiver le bot");
    $('#OnOfBot').addClass("red");
    $('#OnOfBot').removeClass("green");
    helpers.log('green', 'ETAT', 'Bot <strong>activée</strong> !');
  }
}
