function showPage(pageNum, show) {
	var pages  = ["profileBox", "trainingBox", "competitionBox", "topListBox", "settingsBox"];
	var buttons= ["headerUsername", "headerUserFunctionsTrain", "headerUserFunctionsCompete", "headerUserFunctionsTopList", "headerUserFunctionsSettings"];
	var i;
	var m= pages.length;

	page= document.getElementById(pages[pageNum]);
	if((show == -1 && page.style.display != "block") || (isNaN(show) == false && show == 1)) {
		for(i=0; i < m; i++) {
			if(i != pageNum) {
				document.getElementById(pages[i]).style.display= "none";
				document.getElementById(pages[i]).style.opacity= "0";
				document.getElementById(buttons[i]).style.color= "#333";
			}
		}
		page.style.display= "block";
		page.style.opacity= "0.97";
		document.getElementById(buttons[pageNum]).style.color= "#F03";
	}
	else if((show == -1 && page.style.display == "block") || (isNaN(show) == false && show == 0)) {
		page.style.display= "none";
		page.style.opacity= "0";
		document.getElementById(buttons[pageNum]).style.color= "#333";
	}
}



function fillCompetitionInfo() {
	/*
	document.getElementById('competitionInfoEvent').innerHTML= sessionStorage.getItem('competitionEvent');
	document.getElementById('competitionInfoWind').innerHTML = sessionStorage.getItem('competitionWind') + "m/s";
	var i;
	for(i=1; i <= 12; i++) {
		document.getElementById('competitionOpponent'+i+'Name').innerHTML= sessionStorage.getItem('competitionOpponent'+i+'Name');
		document.getElementById('competitionOpponent'+i+'Country').innerHTML= "<img src='images/flags/small/Hungary.png' title='Hungary' style='width:40px;' />" + sessionStorage.getItem('competitionOpponent'+i+'Country');
		document.getElementById('competitionOpponent'+i+'Result').innerHTML= sessionStorage.getItem('competitionOpponent'+i+'Result');
	}
		for(i=1; i <= 6; i++)
		document.getElementById('competitionOwnResult'+i).innerHTML= sessionStorage.getItem('competitionOwnResult'+i);
	 */
}

function exitCompetition() {
	if(confirm('Would you really want to exit the competition?')) {
		clearInterval(game.interval);
		game= null;
		javelin= null;
		athlete= null;
		showPage(2, 0);
		ajaxRequest("ajax.php", "function=showCompetitionChooser", "competitionBox", "");
		clearCanvas();
		document.getElementById("gameCanvas").style.background= "url('images/stadium.jpg')";
		document.getElementById("gameCanvas").style.backgroundPosition= "center";
		document.getElementById("gameCanvas").style.backgroundRepeat= "no-repeat";
		initializePage();
	}
}

function restartCompetition() {
	if(confirm('Would you really want to restart the competition?')) {
		window.location.href= 'index.php';
		//clearCanvas();
		//ajaxRequest("ajax.php", "function=showCompetitionChooser", "competitionBox", "compete();");
	}
}

function train() {
	var selected = 0;
	for(var i=0; i < 5; i++)
		if(document.getElementById("trainingTableExercise"+i).style.fontWeight == "600") {
			selected= i;
			break;
		}
	ajaxRequest("ajax.php", "function=train&type="+selected, "trainingResult", "");
}


function compete() {
	var selected = 0;
	var level    = document.getElementById("competitionChooserTableLevel").value;
	for(var i=0; i < 4; i++)
		if(document.getElementById("competitionChooserTableEvent"+i).style.fontWeight == "600")
			selected= i;
	showPage(2, 0);
	ajaxRequest("ajax.php", "function=compete&type="+selected+"&level="+level, "log", "");
	setTimeout("initializeGame(); playJavelinThrow(); showPage(2, 1);", 1200);
	document.getElementById("gameCanvas").style.background= "#FFFFFF";
	if(document.getElementById('audioPlayer').paused == false) {
		document.getElementById("audioPlayer").src= 'audio/track'+(Math.floor(Math.random() * 4) + 2)+'.mp3';
		document.getElementById("audioPlayer").play();
	}
	else {
		document.getElementById("audioPlayer").src= 'audio/track'+(Math.floor(Math.random() * 4) + 2)+'.mp3';
		document.getElementById("audioPlayer").pause();
	}
}

function buildPage() {
	var video= document.getElementById('videoPlayer');
	video.style.display= "none";
	video.pause();
	if(readCookie("audio") == null)
		createCookie("audio","true","60");
	document.getElementById("skipIntro").style.display= "none";
	document.getElementById("headerInfo").style.display= "block";
	document.getElementById("headerInfo").style.opacity= "1.0";
	document.getElementById('gameCanvas').style.display= 'block';
	document.getElementById("gameCanvas").style.opacity= "1.0";
	document.getElementById("audioPlayer").src= "audio/track"+(Math.floor(Math.random() * 2))+".mp3";
	if(readCookie("audio") != "false")
		document.getElementById('audioPlayer').play();
	else {
		document.getElementById('headerAudioControlImage').src= "images/volume-none.png";
	}
}


function initializePage() {
	var video= document.getElementById('videoPlayer');
	if(video != null)
		video.onended= function() {
			buildPage();
		};
	if(!window.sessionStorage || !window.localStorage || !isCanvasSupported)
		document.getElementById("log").innerHTML= "<span style='color: red; font-weight: 600; background: white;'>Your browser seems to be incompatible. Consider using a modern browser like Google Chrome or Opera!</span>";
	
	if(readCookie("audio") == null) {
		document.getElementById("headerInfo").style.display= "none";
		document.getElementById("headerInfo").style.opacity= "0";
        document.getElementById('gameCanvas').style.display= 'none';
		video.style.display= 'block';
		video.play();
	}
	else
		buildPage();
	
	mediumTermTiming();
	longTermTiming();
}

var mediumTermTiming= function() {
	//setInterval(function() {ajaxRequest("ajax.php", "function=printTrainingTime", "trainingTime", "");}, 20000);
};

var longTermTiming= function() {
	setInterval(function() {ajaxRequest("ajax.php", "function=refreshTopList", "topListBox", "");
	ajaxRequest("ajax.php", "function=refreshProfile", "profileBox", ""); ajaxRequest("ajax.php", "function=printTrainingTime", "trainingTime", "");}, 500000);
};

function selectExercise(exercise) {
	for(var i=0; i < 5; i++)
		document.getElementById("trainingTableExercise"+i).style.fontWeight= "500";
	exercise.style.fontWeight= "600";
}

function selectGame(game) {
	for(var i=0; i < 5; i++)
		document.getElementById("competitionChooserTableEvent"+i).style.fontWeight= "500";
	game.style.fontWeight= "600";
}

function createXmlHttp() {
   var ajax = null;
   var browser = navigator.appName;
   if(browser == "Microsoft Internet Explorer")
     ajax = new ActiveXObject("Microsoft.XMLHTTP");
   else
     ajax = new XMLHttpRequest();
   return ajax;
 }

 function ajaxRequest(requestedPage, parameters, resultDestination, afterMethod) {
   var ajax= createXmlHttp();
   if(ajax) {
     ajax.open("POST", requestedPage, true);
     ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
     ajax.send(parameters);
     ajax.onreadystatechange = function() {
       if(ajax.readyState == 4) {
		 result= ajax.responseText;
		 if(document.getElementById(resultDestination) && resultDestination) {
		   document.getElementById(resultDestination).innerHTML= result;
           atScripts_init(resultDestination);
		 }
	     if(afterMethod) eval(afterMethod);
	   }
     };
   }
   return ajax;
 }
 
 function login() {
   loginEmail    = document.getElementById("loginEmail").value; 
   loginPassword = document.getElementById("loginPassword").value;
   loginAutoLogin= document.getElementById("loginAutoLogin").value;
   ajaxRequest("ajax.php", "function=login&loginEmail="+loginEmail+"&loginPassword="+loginPassword+"&loginAutoLogin="+loginAutoLogin, "loginResult", "//window.location.href= 'index.php'");
 }
 
 function logout() {
   ajaxRequest("ajax.php", "function=logout", "loginResult", "window.location.href= 'index.php'"); 
 }
 
 function register() {
   registerEmail      = document.getElementById("registerEmail").value; 
   registerPassword   = document.getElementById("registerPassword").value;
   registerFirstname  = document.getElementById("registerFirstname").value;
	 registerSurname    = document.getElementById("registerSurname").value;
	 registerCountry    = document.getElementById("registerCountry").value;
	 registerHeight     = document.getElementById("registerHeight").value;
	 registerWeight     = document.getElementById("registerWeight").value;
	 registerStrength   = document.getElementById("registerStrength").value;
	 registerSpeed      = document.getElementById("registerSpeed").value;
	 registerEndurance  = document.getElementById("registerEndurance").value;
	 registerFlexibility= document.getElementById("registerFlexibility").value;
	 registerTechnique  = document.getElementById("registerTechnique").value;
   ajaxRequest("ajax.php", "function=register&registerEmail="+registerEmail+"&registerPassword="+registerPassword+
	 													"&registerFirstname="+registerFirstname+"&registerSurname="+registerSurname+"&registerCountry="+registerCountry+
														"&registerHeight="+registerHeight+"&registerWeight="+registerWeight+"&registerStrength="+registerStrength+
														"&registerSpeed="+registerSpeed+"&registerEndurance="+registerEndurance+"&registerFlexibility="+registerFlexibility+
														"&registerTechnique="+registerTechnique, "registerResult", "");
 }
 
 
 function superviseSkills(member) {
 		var value= parseInt(document.getElementById("registerStrength").value, 10) + parseInt(document.getElementById("registerSpeed").value, 10) + parseInt(document.getElementById("registerEndurance").value, 10) + parseInt(document.getElementById("registerFlexibility").value, 10) + parseInt(document.getElementById("registerTechnique").value, 10);
 		document.getElementById(member+"Number").value= document.getElementById(member).value;
		if(value > 250) {
			var difference= (value - 250) / 4;
			if(member != registerStrength) {
				document.getElementById("registerStrength").value-= difference;
				document.getElementById("registerStrengthNumber").value= document.getElementById("registerStrength").value;
			}
			if(member != registerSpeed) {
				document.getElementById("registerSpeed").value-= difference;
				document.getElementById("registerSpeedNumber").value= document.getElementById("registerSpeed").value;
			}
			if(member != registerEndurance) {
				document.getElementById("registerEndurance").value-= difference;
				document.getElementById("registerEnduranceNumber").value= document.getElementById("registerEndurance").value;
			}
			if(member != registerFlexibility) {
				document.getElementById("registerFlexibility").value-= difference;
				document.getElementById("registerFlexibilityNumber").value= document.getElementById("registerFlexibility").value;
			}
			if(member != registerTechnique) {
				document.getElementById("registerTechnique").value-= difference;
				document.getElementById("registerTechniqueNumber").value= document.getElementById("registerTechnique").value;
			}
		}
 }
 
 function controlAudio() {
		var audioElement= document.getElementById('audioPlayer');
		if(audioElement.paused) {
			audioElement.play();
			document.getElementById("headerAudioControlImage").src= "images/volume-full.png";
			createCookie("audio", "true", 30);
		}
		else {
			audioElement.pause();
			document.getElementById("headerAudioControlImage").src= "images/volume-none.png";
			createCookie("audio", "false", 30);
		}
 }
 
function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"", -1);
}

function showLoginBox() {
	if(document.getElementById("loginBox").style.display != "block") {
		document.getElementById("loginBox").style.display= "block";
		document.getElementById("loginBox").style.opacity= "0.97";
		document.getElementById("registerBox").style.display= "none";
		document.getElementById("registerBox").style.opacity= "0";
		document.getElementById("headerLoginButton").style.fontWeight= "600";
		document.getElementById("headerRegisterButton").style.fontWeight= "500";
	}
	else {
	  document.getElementById("loginBox").style.display= "none";
		document.getElementById("loginBox").style.opacity= "0";
		document.getElementById("headerLoginButton").style.fontWeight= "500";
	}
}

function showRegisterBox() {
	if(document.getElementById("registerBox").style.display != "block") {
	  document.getElementById("registerBox").style.display= "block";
		document.getElementById("registerBox").style.opacity= "0.97";
	  document.getElementById("loginBox").style.display= "none";
		document.getElementById("loginBox").style.opacity= "0";
		document.getElementById("headerLoginButton").style.fontWeight= "500";
		document.getElementById("headerRegisterButton").style.fontWeight= "600";
	}
	else {
	  	document.getElementById("registerBox").style.display= "none";
			document.getElementById("registerBox").style.opacity= "0";
		document.getElementById("headerRegisterButton").style.fontWeight= "500";
	}
}

/*
http://remysharp.com/2010/07/21/throttling-function-calls/
*/
function throttle(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}


//------------------------------------------------------------------ Weblap -------------------------------------------------------------
 
function atGetObject(ob) {
if (typeof(ob)=='object') {
return ob;
} else {
return document.getElementById(ob);
}
}


function atGetElementsByTagName(tag, parentNode) {
parentNode = atGetObject(parentNode);
if (parentNode==null) {
parentNode = document;
}
ret = new Array();
try {
ret = parentNode.getElementsByTagName(tag);
} catch(ex) {
ret = document.getElementsByTagName(tag);
}
return ret;
}


var atScriptsHTTPR = null;
var atScriptsLinkStack = new Array();
var atScripts_container = '';

function atScripts_execute(src) {
if (src!='') {
try {
eval(src);
} catch (ex) {
alert('atScripts_execute() - '+atScriptsHTTPR.url+'\n\n'+ex);
}
}
}
 
function atScripts_push(url) {
atScriptsLinkStack.push(url);
}

function atScripts_pop() {
atScriptsHTTPR = null;
try {
if (atScriptsLinkStack.length>0) {
try {
url = atScriptsLinkStack.pop();
atScriptsHTTPR = new atHTTPRequest(url, 'GET');
atScriptsHTTPR.open();
atScriptsHTTPR.setHandler(atScripts_download);
atScriptsHTTPR.send(null);
} catch (ex) {
atScriptsHTTPR = null;
setTimeout('atScripts_download()', 10);
}
} else {
atScripts_parse_source();
}
} catch (ex2) {
// alert('debug: atScripts_pop()\n\n'+ex2);
}
}

function atScripts_download(e) {
try {
if (atScriptsHTTPR.isReady()) {
src = atScriptsHTTPR.getResponseText();
atScripts_execute(src);
atScripts_pop();
}
} catch (ex) {
atScripts_pop();
}
}

function atScripts_parse_links() {
items = atGetElementsByTagName('script', atScripts_container);
for (i in items) {
src = '';
try {
src = ''+items[i].getAttribute('src');
} catch (ex) {
src = ''+items[i].src;
}
if (src!='') {
atScripts_push(src);
}
}
atScripts_download(null);
}

function atScripts_parse_source() {
items = atGetElementsByTagName('script', atScripts_container);
for (i in items) {
src = ''+items[i].innerHTML;
if (src!='') {
atScripts_execute(src);
}
}
}

function atScripts_init(container) {
atScripts_container = container;
atScripts_parse_links();
}
