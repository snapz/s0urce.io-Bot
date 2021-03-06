<?php
set_time_limit(0);
require_once 'vendor/autoload.php';

use thiagoalessio\TesseractOCR\TesseractOCR;
//echo (new TesseractOCR('./words/h/25.png'))->whitelist(range('a', 'z'))->run();

$arrayDifficulty = ["e", "m", "h"];
$arrayToReturn = ['e' => array(), 'm' => array(), 'h' => array()];


$currentDifficultyToCheck = 0;
// Boucle 3 diffiulté
while($currentDifficultyToCheck <= 2)
{
	$idToCheck = 0;
	$continueHttpGet = true; 
	// Boucle sur les url de la difficulté
	while($continueHttpGet)
	{
		$distPath = 'http://s0urce.io/client/img/word/'.$arrayDifficulty[$currentDifficultyToCheck].'/'.$idToCheck;
		$localPath = './words/'.$arrayDifficulty[$currentDifficultyToCheck].'/'.$idToCheck.'.png';
		$continueHttpGet = save_image($distPath, $localPath);

		if($continueHttpGet)
		{
			$textOcr = (new TesseractOCR($localPath))->whitelist(range('a', 'z'))->psm(100)->run();
			//$textOcr = (new TesseractOCR($localPath))->whitelist(range('a', 'z'))->psm(100)->oem(1)->run();
			array_push($arrayToReturn[$arrayDifficulty[$currentDifficultyToCheck]], $textOcr);
		}
		$idToCheck++;
	}

	$currentDifficultyToCheck++;
}

$arrayToReturn = json_encode($arrayToReturn, true);
print_r($arrayToReturn);

function save_image($img,$fullpath){
	$ch = curl_init ($img);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_BINARYTRANSFER,1);
	curl_setopt($ch, CURLOPT_TIMEOUT, 2);
	$rawdata=curl_exec($ch);
	curl_close ($ch);
	if(file_exists($fullpath)){
		unlink($fullpath);
	}
	if(strlen($rawdata) >= 1)
	{
		$fp = fopen($fullpath,'x');
		fwrite($fp, $rawdata);
		fclose($fp);
	}

	if(file_exists($fullpath)) return true;
	else return false;
}
?>