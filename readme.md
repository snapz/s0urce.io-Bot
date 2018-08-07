# s0urce.io bot by sNapz

This is a old custom bot for the game s0urce.io made some month ago just for fun. Some friend asked me to share it for do their own bot, so i've updated it with the new system of word and updated packetId.

## How to use ?
Install ***socket.io** with the command **npm install** in your cmd prompt.

Edit **config.js** for change your *username, quote *and* signature*.
Launch **index.html** and push the button **connecter**, wait some seconds and push the button **activer le bot**.

## Some infos about the way to generate config_words.js

The file **config_words.js** contains an object of all word used on the game.

The folder **generer_array_word_without_ocr** will download all picture and generate an object with all ID and you have to write all text manually.

The folder **generer_array_word_with_ocr** will download all picture and generate an object with all word.
It use an ocr method to get these word from picture but its not fully accurate at the moment, but i share it if you want to use it.

For the ocr method i use https://github.com/thiagoalessio/tesseract-ocr-for-php for get text from word image.
So you **need to install** on your computer :
https://github.com/tesseract-ocr/tesseract

