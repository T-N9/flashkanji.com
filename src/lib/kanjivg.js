// The URL of the repository
// const github = "https://github.com/KanjiVG/kanjivg/blob/master/kanji/";

var debug = true;

export function msg(s) {
	if (! debug) {
		return;
	}
	// console.log(s);
}

export function githubURL(kanji) {
	return "https://github.com/KanjiVG/kanjivg/blob/master/kanji/" + kanjiToHex(kanji) + ".svg";
}

// Convert kanji into a hexadecimal
export function kanjiToHex(kanji) {
	var kcode = kanji.codePointAt(0);
	var hex = kcode.toString(16);
	var zeros = 5 - hex.length;
	hex = "0".repeat(zeros) + hex;
	return hex;
}

function fileToKanjiVG(file) {
	return 'https://raw.githubusercontent.com/KanjiVG/kanjivg/93934ee1e4a0e37cda6f19ac111208d5327b1d9e/kanji/' + file;
}

const fileToKanjiRe = /^([0-9a-f]+).*/;

function fileToKanji(file) {
	var match = fileToKanjiRe.exec(file);
	var hex = parseInt(match[0], 16);
	var kanji = String.fromCharCode(hex);
	return kanji;
}

// Returns the github URL of a kanji specified by a string. Only the
// first kanji in the string is used.
export function kanjiURL(kanji) {
	var hex = kanjiToHex(kanji); 
	return fileToKanjiVG(hex + '.svg');
}

var index;

export function loadIndex() {
	msg("Loading index");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kvg-index.json", false);
	xhr.onload = function (e) {
		if (this.readyState == 4 && this.status == 200) {
			try {
				index = JSON.parse(xhr.responseText);
				msg("Index loaded OK " + index["感"]);
			} catch {
				console.log("Failed to parse JSON");
			}
		}
	}
	xhr.send("");
}

function urldecode(str) {
	return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}

// Return the variables in the URL
export function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = urldecode(hash[1]);
	}
	return vars;
}

// Return a random kanji
function randomKanji() {
	var keys = Object.keys(index);
	var n = keys.length;
	var k = Math.random() * n
	var r = keys[Math.floor(k)];
	return r;
}
