var w;
var h;
var canvas;
var context;
var strokeStyle;
var lineWidth;

var athlete;
var javelin;
var game;

function Javelin() {
	
	this.status       = 0;
	this.length       = 240;
	this.width        = 2;
	this.lineColor    = "blue";
	this.frameNumber  = 0;
	this.frameChange  = 0;
	
	this.setFrameChange= function(change) {
		this.frameChange= change;
	}
	
	this.setStatus= function(status) {
		if(this.frameNumber >= this.frameChange) {
			this.status= status == null? this.status+1 : position;
			this.frameNumber= 0;
		}
		else
			this.frameNumber++;
	}
}

function Game() {
	this.playerId           = 1;
	this.interval           = null;
	this.roundNumber        = 1;				//A fordukó neve
	this.lastSpeedComboTime = 0;				//Mikor gyorsított utoljára az atléta
	this.distanceToLine     = 0;
	this.maximalSpeedTime   = 0;				//Mióta megy 95%-os maximális sebességgel az atléta
	this.optimalThrowingTime= 0;				//A kidobás megkezdésének optimális ideje
	this.throwingTime       = 0;				//Kidobás megnyomásának ideje
	this.releaseTime        = 0;				//A kidobás gombjának felengedésének ideje
	this.field              = null;
	this.fieldX             = -70;
	this.fieldY             = 0;
	this.lineX              = -5750;
	
	this.startCompetition= function() {
		var i,j,k,l;
		var x=[0,0,0,0,0,0,0,0,0,0,0,0,0];
		var names= ["Vítezslav Veselý", "Vadims Vasilevskis", "Stuart Farquhar", "Oleksandr Pyatnytsya", "Fatih Avan",
								"Ivan Zaytsev","Pawel Rakoczy","Antti Ruuskanen","Tero Pitkämäki","Andreas Thorkildsen","Ari Mannio",
								"Roderick Genki Dean","Zigismunds Sirmais","Lassi Etelätalo","Yukifumi Murakami","Bartosz Osewski",
								"Ainars Kovals","Teemu Wirkkala","Jarrod Bannister","Sergey Makarov","Valeriy Iordan","Spirídon Lebésis",
								"Uladzimir Kazlou","Keshorn Walcott","Dmitri Tarabin","Sean Furey","Guillermo Martínez",
								"Igor Janik","Craig Kinsley","Mervyn Luckwell","Tino Häber","Risto Mätas","Sangjin Jung","Roman Avramenko",
								"Sam Humphreys","Kim Amb","Tim Glover","Oleksandr Nychyporchuk","Matthias de Zordo","Mark Frank",
								"Gabriel Wallin","Tom Goyvaerts","Curtis Moss","Julius Yego","Cyrus Hostetler","Corey White","Andreas Hofmann",
								"Sam Crouser","Thomas Röhler","Qiang Qin","Dayron Márquez","Scott Russell","Arley Ibargüen","Jakub Vadlejch",
								"Petr Frydrych","Marcin Krukowski","Ihab El Sayed","Ken Arai","Braian Toledo","Tanel Laanmäe",
								"Yervásios Filippídis","Lee Doran","Melik Janoyan","Ilya Korotkov","Lars Hamann","Sampo Lehtola","Till Wöschler",
								"Lukasz Grzeszczuk","Hamish Peacock","Xingyu Jiang","Aleksey Tovarnov","Joshua Robinson","Martin Benák",
								"Jonas Lohse","Ioánnis Smaliós","Ahti Peder","Qinggang Zhao","Harri Haatainen","Mihkel Kukk",
								"Björn Lange","Pawel Rozinski","Hubert Chmielak","Jérôme Haeffler","Marcin Plener","Kazuki Yamamoto",
								"Matthew Outzen","Leslie Copeland","Aleksandr Sharygin","Patrik Zenúch","Joonas Verronen","Barry Krammes",
								"Ningbo Wang","Stipe Žunic","Qi Chen","Vedran Samac","Bobur Shokirjonov","Krisztián Török","Dejan Mileusnic",
								"Matija Kranjc","John Robert Oosthuizen","Kyle Nielsen","Mikalai Vasiltsou","Juan José Méndez","Sean Keller",
								"Jayson Henning","Igor Sukhomlinov","Mika Aalto","Ryohei Arai","Norbert Bonvecchio","Diego Moraga","Rohit Kumar",
								"Aliaksandr Ashomka","Chao-Tsun Cheng","Rinat Tarzumanov","Noraldo Palacios","Giacomo Puccini","Mustafa Tan",
								"Eriks Rags","Morné Moolman","Yoshihiro Nakajima","Mike Hazle","Rajender Singh","Brian Chaput","Shoya Inui",
								"Jaka Muhar","Bernhard Seifert","Matthias Treff","Dawid Kosciów","Rolands Štrobinders","Peter Esenwein",
								"Joe Dunderdale","Karol Jakimowicz","Júlio César de Oliveira","Bence Papp","Magnus Kirt","Martins Pildavs",
								"Zoltán Magyari", "Gábor Hernádi", "Norbert R. Tóth"];
		var countries= ["CZE","LAT","NZL","UKR","TUR","UZB","POL","FIN","FIN","NOR","FIN","JPN","LAT","FIN","JPN","POL","LAT","FIN",
										"AUS","RUS","RUS","GRE","BLR","TRI","RUS","USA","CUB","POL","USA","GBR","GER","EST","KOR","UKR","USA","SWE",
										"USA","UKR","GER","GER","SWE","BEL","CAN","KEN","USA","USA","GER","USA","GER","CHN","COL","CAN","COL","CZE",
										"CZE","POL","EGY","JPN","ARG","EST","GRE","GBR","ARM","RUS","GER","FIN","GER","POL","AUS","CHN","RUS","AUS",
										"SVK","SWE","GRE","EST","CHN","FIN","EST","GER","POL","POL","FRA","POL","JPN","AUS","FIJ","RUS","SVK","FIN",
										"USA","CHN","CRO","CHN","SRB","UZB","HUN","BIH","SLO","RSA","CAN","BLR","MEX","USA","RSA","RUS","FIN","JPN",
										"ITA","CHI","IND","BLR","TPE","UZB","COL","ITA","TUR","LAT","RSA","JPN","USA","IND","USA","JPN","SLO","GER",
										"GER","POL","LAT","GER","GBR","POL","BRA","HUN","EST","LAT", "HUN", "HUN", "HUN"]; //138 ember

		sessionStorage.setItem("competitionEvent", "javelin throw");
		sessionStorage.setItem("competitionWind", "");
		k= localStorage.getItem("competitionLevel");
		for(i=1; i <= 6; i++)
			sessionStorage.setItem("competitionOwnResult"+i, "-");
		for(i=1; i <= 11; i++) {
			do {
				l= (5-k)*Math.random()*30;
				j= Math.floor(l + Math.random()*(45)+1);
			}
			while(x.indexOf(j) != -1 || j >= names.length);
			x[i]= j;
			sessionStorage.setItem("competitionOpponent"+i+"Id", "0");
			sessionStorage.setItem("competitionOpponent"+i+"Place", j);
			sessionStorage.setItem("competitionOpponent"+i+"Name", names[j]);
			sessionStorage.setItem("competitionOpponent"+i+"Country", countries[j]);
			sessionStorage.setItem("competitionOpponent"+i+"Result", "-");
		}
		sessionStorage.setItem("competitionOpponent12Id", localStorage.getItem("id"));
		sessionStorage.setItem("competitionOpponent12Place", "0");
		sessionStorage.setItem("competitionOpponent12Name", "<b>"+localStorage.getItem("firstname") + " " + localStorage.getItem("surname")+"</b>");
		sessionStorage.setItem("competitionOpponent12Country", localStorage.getItem("countryCode"));
		sessionStorage.setItem("competitionOpponent12Result", "-");
	}
	
	this.startRound= function(number) {
		var i, j;
		var x, y, z, maxi;
		var result;
		
		game.lastSpeedComboTime = 0;
		game.maximalSpeedTime   = 0;
		game.distanceToLine     = 0;
		game.roundNumber        = number;
		game.optimalThrowingTime= 0;
		game.throwingTime       = 0;
		game.releaseTime        = 0;
		game.fieldX             = -70;
		game.fieldY             = 380;
		athlete.x               = 180;
		athlete.y               = h - athlete.length - 30;
		athlete.momentum        = 0;
		athlete.status       		= 0;
		athlete.legPosition  		= 0;
		athlete.trunkPosition		= 0;
		athlete.armPosition  		= 0;
		athlete.headPosition 		= 0;
		athlete.frameNumber     = 0;
		javelin.frameNumber     = 0;
		
		if(game.roundNumber <= 6) {
			x= parseFloat(sessionStorage.getItem("competitionWind"));
			if(isNaN(x))
				sessionStorage.setItem("competitionWind", y= (Math.random()*8-4).toFixed(1));
			else
				sessionStorage.setItem("competitionWind", y= (x+Math.random()*2.4-1.2).toFixed(1));
			//Ellenfelek eredményeinek feltöltése
			for(i=1; i <= 12; i++) {
				x= parseInt(sessionStorage.getItem("competitionOpponent"+i+"Place"));
				z= parseFloat(sessionStorage.getItem("competitionOpponent"+i+"Result"));
				if(sessionStorage.getItem("competitionOpponent"+i+"Id") == 0) {
					result= Math.random()*6 >= 3.6? ((51-x/4 + Math.random()*16)*(1.39+Math.random()*0.96/10.5) - y/3*Math.log(620/x)*2.5).toFixed(2) : "X"; //Log: 0.522874402 - 2.30103
					if((isNaN(result) == false && isNaN(z) == false && result > z) || isNaN(z) == true)
						sessionStorage.setItem("competitionOpponent"+i+"Result", result + (isNaN(result) == false? " m" : ""));
				}
			}
		}
		//Rendezés eredmény alapján
		for(i=1; i < 12; i++) {
			maxi= i;
			for(j=i+1; j <= 12; j++) {
				x= parseFloat(sessionStorage.getItem("competitionOpponent"+j+"Result"));
				y= parseFloat(sessionStorage.getItem("competitionOpponent"+maxi+"Result"));
				if((isNaN(x) == false && isNaN(y) == false && x > y) || (isNaN(x) == false && isNaN(y) == true))
					maxi= j;
			}
			
			result=	sessionStorage.getItem("competitionOpponent"+i+"Id");
			sessionStorage.setItem("competitionOpponent"+i+"Id", sessionStorage.getItem("competitionOpponent"+maxi+"Id"));
			sessionStorage.setItem("competitionOpponent"+maxi+"Id", result);
					
			result=	sessionStorage.getItem("competitionOpponent"+i+"Place");
			sessionStorage.setItem("competitionOpponent"+i+"Place", sessionStorage.getItem("competitionOpponent"+maxi+"Place"));
			sessionStorage.setItem("competitionOpponent"+maxi+"Place", result);
					
			result=	sessionStorage.getItem("competitionOpponent"+i+"Result");
			sessionStorage.setItem("competitionOpponent"+i+"Result", sessionStorage.getItem("competitionOpponent"+maxi+"Result"));
			sessionStorage.setItem("competitionOpponent"+maxi+"Result", result);
					
			result=	sessionStorage.getItem("competitionOpponent"+i+"Name");
			sessionStorage.setItem("competitionOpponent"+i+"Name", sessionStorage.getItem("competitionOpponent"+maxi+"Name"));
			sessionStorage.setItem("competitionOpponent"+maxi+"Name", result);
					
			result=	sessionStorage.getItem("competitionOpponent"+i+"Country");
			sessionStorage.setItem("competitionOpponent"+i+"Country", sessionStorage.getItem("competitionOpponent"+maxi+"Country"));
			sessionStorage.setItem("competitionOpponent"+maxi+"Country", result);
		}
		ajaxRequest("ajax.php", "function=refreshCompetitionInfo", "competitionBox", "fillCompetitionInfo();");
		
		context.clearRect(0,0,w,h);
		drawEnvironment();
		drawAthlete();
		
		context.fillText("Press 'X' to run, then press SPACE 3 times: to withdraw the javelin, to hop and throw.", 10, 50);
		context.fillText("When your press SPACE third time, hold it for 0.3 seconds to maximize your result!", 10, 61);
	}
	
}

document.onkeydown= function(event) {
		var keyCode= event == null? window.event.keyCode : event.keyCode;
		var i;
		
		switch(keyCode) {
			case 88:
				if(game.roundNumber >= 1 && game.roundNumber <= 6 && game.fieldX > game.lineX) {
					if(athlete.status <= 1)
						athlete.setMomentum(1);
					for(i= 0; i < 5; i++)
						showPage(i, 0);
				}
				break;
			case 32:
				if(game.roundNumber >= 1 && game.roundNumber <= 6 && game.fieldX > game.lineX) {
					if(athlete.status <= 2)
						athlete.setStatus(null);
					if(athlete.status == 3)
						game.throwingTime= new Date().getTime();
				}
				break;
			case 27:
				exitCompetition();
				break;
			default:
				break;
		}
	}
	
	document.onkeyup= function(event) {
		var keyCode= event == null? window.event.keyCode : event.keyCode;
	
		switch(keyCode) {
			case 32:
				if(athlete.status >= 2 && athlete.status <= 4 && athlete.legPosition > 16 && athlete.armPosition < 35 && game.throwingTime != 0 && game.fieldX > game.lineX) { //kidobás befejezése
					game.releaseTime= new Date().getTime();
				}
				break;
			default:
				break;
		}
	}

function playJavelinThrow() {
	var i=0;
	game.startCompetition();
	game.startRound(1);
	
	/*
	var i= 0;
	athlete.x= 30;
	javelin.setStatus(5);
	for(i= 20; i <= 34; i++) {
		athlete.legPosition= i;
		athlete.armPosition= i;
		if(i >= 20) {
			athlete.trunkPosition++;
			javelin.setStatus(null);
		}
		if(i >= 24) {
			drawAthlete();
			athlete.x+= 100;
		}
	}
	*/
	game.fieldY  = 380;
	game.interval= setInterval(javelinThrowTimer, 12);
}

function javelinThrowTimer() {
	var now = new Date().getTime();
	var isChange= false;
	//Sebességcsökkenés----------------------------------------------------------
	if(athlete.momentum != 0 && athlete.status < 1 && game.lastSpeedComboTime != 0 && Math.abs(now - game.lastSpeedComboTime) > athlete.endurance*15 - athlete.momentum*10) {
		athlete.setMomentum(-1);
	}
	if(athlete.momentum <= 0 && (athlete.status < 2 || athlete.status > 4)) {
	 athlete.momentum   = 0;
	 athlete.armPosition= 0;
	 athlete.legPosition= 0;
	 athlete.status     = 0;
	 javelin.status     = 0;
	}
	//Törlés----------------------------------------------------------------------
	clear();
	//Pozícióváltás---------------------------------------------------------------
	athlete.setFrameChange();
	javelin.setFrameChange(athlete.frameChange);
	if((athlete.legPosition <= 16 || (athlete.legPosition >= 25 && athlete.legPosition <= 36)) && athlete.status < 5) {
		if(athlete.x < w/3 && athlete.x < w)
			athlete.x= Math.ceil(athlete.x + athlete.momentum/3);
		else
			game.fieldX= Math.ceil(game.fieldX - athlete.momentum/3);
	}
	if(athlete.status == 2)
		athlete.y+= athlete.legPosition < 13? -1 : athlete.legPosition < 20? 1 : 0;
	//Nekifutás animációja--------------------------------------------------------
	if(athlete.status <= 1 && game.fieldX > game.lineX) {
		if(athlete.momentum > 0 && athlete.legPosition <= 2)
			isChange= athlete.setLegPosition(null);
		else
			isChange= athlete.setLegPosition(athlete.legPosition >= 9 ? 3 : null);
	//Keresztlépés animációja-----------------------------------------------------
		if(athlete.status == 1 && athlete.armPosition < 5) {
			isChange= athlete.setArmPosition(null);
			javelin.setStatus(null);
		}
	}
	//Beszökkenés animációja-------------------------------------------------------
	else if((athlete.status == 2 || athlete.status == 3) && athlete.armPosition < 23 && game.fieldX > game.lineX) {
		isChange= athlete.setLegPosition(null);
		if(athlete.legPosition == 18)
			isChange= athlete.setArmPosition(18);
		else if(athlete.legPosition > 18)
			isChange= athlete.setArmPosition(null);
	}
	//Dobás animációja-------------------------------------------------------------
	else if((athlete.status == 2 || athlete.status == 3) && athlete.armPosition >= 23 && athlete.armPosition <= 26 && game.fieldX > game.lineX) {
			isChange= athlete.setLegPosition(null);
			isChange= athlete.setArmPosition(null);
			isChange= athlete.setTrunkPosition(null);
			javelin.setStatus(null);
	}
	//Megállás animációja----------------------------------------------------------
	else if(athlete.armPosition >= 27 && athlete.armPosition <= 36 && game.fieldX > game.lineX) {
		if(athlete.armPosition == 27 && athlete.status < 4) {
			game.optimalThrowingTime= new Date().getTime();
			game.distanceToLine= game.lineX - game.fieldX <= 0? Math.abs((game.lineX - game.fieldX) / 220) : -1;
			athlete.setStatus(4);
		}
		isChange= athlete.setLegPosition(null);
		isChange= athlete.setArmPosition(null);
		isChange= athlete.setTrunkPosition(null);
		javelin.setStatus(null);
	}
	if((athlete.armPosition >= 37 && athlete.status < 5 && (game.releaseTime != 0 || now-game.throwingTime >= 2000)) || (athlete.status < 5 && game.fieldX < game.lineX)) {
		if(now-game.throwingTime >= 2000)
			game.releaseTime= game.throwingTime+2000;
		if(game.lineX > game.fieldX)
			game.distanceToLine= -1;
		ajaxRequest("ajax.php", "function=registerThrow&level="+localStorage.getItem("competitionLevel")+"&event=1&round="+game.roundNumber+"&wind="+sessionStorage.getItem("competitionWind")+"&momentum="+athlete.momentum+"&distanceToLine="+game.distanceToLine+"&optimalThrowingTime="+game.optimalThrowingTime+"&throwingTime="+game.throwingTime+"&releaseTime="+game.releaseTime, "log");
		athlete.setStatus(5);
		athlete.setMomentum(0);
		clear();
	}
	
	//Kirajzolás
	if(game.roundNumber <= 6) {
		drawEnvironment();
		drawAthlete();
	}
	else
		drawEnvironment();
	if(isChange == false) {
		athlete.frameNumber++;
		javelin.frameNumber++;
	}
	else {
		athlete.frameNumber= 0;
		javelin.frameNumber= 0;
	}
}

function drawLeftArm(armPosition) {
	context.moveTo(athlete.x, athlete.y+4.5*athlete.unit);
	switch(armPosition) {
		case 0:		//Fogja a gerelyt indulás előtt
			context.lineTo(athlete.x+3*athlete.unit, athlete.y+10*athlete.unit);
			break;
		case 1:
			context.lineTo(athlete.x+3.4*athlete.unit, athlete.y+9.2*athlete.unit);
			break;
		case 2:
			context.lineTo(athlete.x+2*athlete.unit, athlete.y+6*athlete.unit);
			context.lineTo(athlete.x+3.6*athlete.unit, athlete.y+8*athlete.unit);
			break;
		case 3:
			context.lineTo(athlete.x+2.5*athlete.unit, athlete.y+5*athlete.unit);
			context.lineTo(athlete.x+4.1*athlete.unit, athlete.y+6.9*athlete.unit);
			break;
		case 4:
			context.lineTo(athlete.x+2.8*athlete.unit, athlete.y+4.3*athlete.unit);
			context.lineTo(athlete.x+4*athlete.unit, athlete.y+7.3*athlete.unit);
			break;
		case 5:
			drawLeftArm(4);
			break;
		case 6:
			context.lineTo(athlete.x+3.4*athlete.unit, athlete.y+3*athlete.unit);
			context.lineTo(athlete.x+2*athlete.unit, athlete.y+5.7*athlete.unit);
			break;
		case 7:
			drawLeftArm(6);
			break;
		case 8:
			drawLeftArm(6);
			break;
		case 9:
			drawLeftArm(6);
			break;
		case 10:
			drawLeftArm(6);
			break;
		case 11:
			drawLeftArm(6);
			break;
		case 12:
			drawLeftArm(6);
			break;
		case 13:
			drawLeftArm(6);
			break;
		case 14:
			drawLeftArm(6);
			break;
		case 15:
			drawLeftArm(6);
			break;
		case 17:
			context.lineTo(athlete.x+3.2*athlete.unit, athlete.y+2.6*athlete.unit);
			context.lineTo(athlete.x+2.2*athlete.unit, athlete.y+6*athlete.unit);
			break;
		case 18:
			context.lineTo(athlete.x+3*athlete.unit, athlete.y+2.4*athlete.unit);
			context.lineTo(athlete.x+2.8*athlete.unit, athlete.y+5.3*athlete.unit);
			break;
		case 19:
			context.lineTo(athlete.x+2.8*athlete.unit, athlete.y+2.2*athlete.unit);
			context.lineTo(athlete.x+3.4*athlete.unit, athlete.y+5*athlete.unit);
			break;
		case 20:
			context.lineTo(athlete.x+2.6*athlete.unit, athlete.y+2.2*athlete.unit);
			context.lineTo(athlete.x+4.8*athlete.unit, athlete.y+2.3*athlete.unit);
			break;
		case 21:
			context.lineTo(athlete.x+1.9*athlete.unit, athlete.y+4.9*athlete.unit);
			context.lineTo(athlete.x+4.1*athlete.unit, athlete.y+4.3*athlete.unit);
			break;
		case 22:
			context.lineTo(athlete.x+0.5*athlete.unit, athlete.y+8*athlete.unit);
			context.lineTo(athlete.x+2*athlete.unit, athlete.y+8*athlete.unit);
			break;
		case 23:
			context.lineTo(athlete.x+0.4*athlete.unit, athlete.y+8.5*athlete.unit);
			context.lineTo(athlete.x+2.2*athlete.unit, athlete.y+9.8*athlete.unit);
			break;
		case 24:
			context.moveTo(athlete.x+0.8*athlete.unit, athlete.y+5.7*athlete.unit);
			context.lineTo(athlete.x+0.3*athlete.unit, athlete.y+9.6*athlete.unit);
			context.lineTo(athlete.x+1.2*athlete.unit, athlete.y+12.5*athlete.unit);
			break;
		case 25:
			context.moveTo(athlete.x+1.1*athlete.unit, athlete.y+6*athlete.unit);
			context.lineTo(athlete.x+0.5*athlete.unit, athlete.y+9.7*athlete.unit);
			context.lineTo(athlete.x+1.4*athlete.unit, athlete.y+12.6*athlete.unit);
			break;
		case 26:
			context.moveTo(athlete.x+1.7*athlete.unit, athlete.y+6.4*athlete.unit);
			context.lineTo(athlete.x+0.9*athlete.unit, athlete.y+11*athlete.unit);
			context.lineTo(athlete.x+1.7*athlete.unit, athlete.y+14.1*athlete.unit);
			break;
		case 27:
			drawLeftArm(22);
			break;
		case 28://megállás része
			break;
			drawLeftArm(19);
			break;
	}
}

function drawRightArm(armPosition) {
	context.moveTo(athlete.x, athlete.y+4.5*athlete.unit);
	switch(armPosition) {
		case 0:		//Fogja a gerelyt a nekifutásnál
			context.lineTo(athlete.x+1.2*athlete.unit, athlete.y+1.2*athlete.unit);
			context.lineTo(athlete.x+0.7*athlete.unit, athlete.y-3.4*athlete.unit);
			break;
		case 1:
			context.lineTo(athlete.x+0.1*athlete.unit, athlete.y+0.1*athlete.unit);
			context.lineTo(athlete.x-1.4*athlete.unit, athlete.y-3.4*athlete.unit);
			break;
		case 2:
			context.lineTo(athlete.x-1.7*athlete.unit, athlete.y+2.7*athlete.unit);
			context.lineTo(athlete.x-1.2*athlete.unit, athlete.y-1.6*athlete.unit);
			break;
		case 3:
			context.lineTo(athlete.x-2.6*athlete.unit, athlete.y+3.6*athlete.unit);
			context.lineTo(athlete.x-1.3*athlete.unit, athlete.y-0.2*athlete.unit);
			break;
		case 4:
			context.lineTo(athlete.x-2.4*athlete.unit, athlete.y+4.2*athlete.unit);
			context.lineTo(athlete.x-4*athlete.unit, athlete.y+1*athlete.unit);
			break;
		case 5:
			context.lineTo(athlete.x-5*athlete.unit, athlete.y+4.2*athlete.unit);
			break;
		case 6:
			drawRightArm(5);
			break;
		case 7:
			drawRightArm(5);
			break;
		case 8:
			drawRightArm(5);
			break;
		case 9:
			drawRightArm(5);
			break;
		case 10:
			drawRightArm(5);
			break;
		case 11:
			drawRightArm(5);
			break;
		case 12:
			drawRightArm(5);
			break;
		case 13:
			drawRightArm(5);
			break;
		case 14:
			drawRightArm(5);
			break;
		case 15:
			drawRightArm(5);
			break;
		case 16:
			drawRightArm(5);
			break;
		case 17:
			drawRightArm(5);
			break;
		case 18:
			context.lineTo(athlete.x-2.4*athlete.unit, athlete.y+4.9*athlete.unit);
			context.lineTo(athlete.x-5.1*athlete.unit, athlete.y+4.6*athlete.unit);
			break;
		case 19:
			context.lineTo(athlete.x-2.2*athlete.unit, athlete.y+5.2*athlete.unit);
			context.lineTo(athlete.x-5.1*athlete.unit, athlete.y+4.4*athlete.unit);
			break;
		case 20:
			context.lineTo(athlete.x-2.2*athlete.unit, athlete.y+5.2*athlete.unit);
			context.lineTo(athlete.x-5.1*athlete.unit, athlete.y+4.4*athlete.unit);
			break;
		case 21:
			drawRightArm(5);
			break;
		case 22:
			context.lineTo(athlete.x-1.8*athlete.unit, athlete.y+3.9*athlete.unit);
			context.lineTo(athlete.x-5.1*athlete.unit, athlete.y+4.4*athlete.unit);
			break;
		case 23:
			context.moveTo(athlete.x+0.7*athlete.unit, athlete.y+5.7*athlete.unit);
			context.lineTo(athlete.x-0.8*athlete.unit, athlete.y+2.3*athlete.unit);
			context.lineTo(athlete.x-3.4*athlete.unit, athlete.y+3.2*athlete.unit);
			break;
		case 24:
			context.moveTo(athlete.x+1*athlete.unit, athlete.y+6*athlete.unit);
			context.lineTo(athlete.x+1.3*athlete.unit, athlete.y+1.4*athlete.unit);
			context.lineTo(athlete.x-1.2*athlete.unit, athlete.y+2.7*athlete.unit);
			break;
		case 25:
			context.moveTo(athlete.x+1.7*athlete.unit, athlete.y+6.5*athlete.unit);
			context.lineTo(athlete.x+2.7*athlete.unit, athlete.y+2.1*athlete.unit);
			context.lineTo(athlete.x-0*athlete.unit, athlete.y+1.0*athlete.unit);
			break;
		case 26:
			context.moveTo(athlete.x+1.7*athlete.unit, athlete.y+6.5*athlete.unit);
			context.lineTo(athlete.x+4*athlete.unit, athlete.y-1.6*athlete.unit);
			break;
		case 27: //megállás része
			context.moveTo(athlete.x+1.7*athlete.unit, athlete.y+6.5*athlete.unit);
			context.lineTo(athlete.x+7*athlete.unit, athlete.y+1.3*athlete.unit);
			break;
		case 28:
			context.moveTo(athlete.x+1.7*athlete.unit, athlete.y+6.5*athlete.unit);
			context.lineTo(athlete.x+6.4*athlete.unit, athlete.y+5*athlete.unit);
			break;
		case 29:
			context.moveTo(athlete.x+1.7*athlete.unit, athlete.y+6.5*athlete.unit);
			context.lineTo(athlete.x+5.1*athlete.unit, athlete.y+10.8*athlete.unit);
			break;
		case 30:
			context.moveTo(athlete.x+1.7*athlete.unit, athlete.y+6.5*athlete.unit);
			context.lineTo(athlete.x+3.4*athlete.unit, athlete.y+13.6*athlete.unit);
			break;
		case 31:
			context.moveTo(athlete.x+1.7*athlete.unit, athlete.y+6.5*athlete.unit);
			context.lineTo(athlete.x+1.7*athlete.unit, athlete.y+14.1*athlete.unit);
			break;
		case 32:
			context.moveTo(athlete.x+1*athlete.unit, athlete.y+6*athlete.unit);
			context.lineTo(athlete.x+1*athlete.unit, athlete.y+13.5*athlete.unit);
			break;
		case 33:
			drawRightArm(29);
			break;
		case 34:
			context.moveTo(athlete.x+1*athlete.unit, athlete.y+6*athlete.unit);
			context.lineTo(athlete.x+0.7*athlete.unit, athlete.y+9*athlete.unit);
			context.lineTo(athlete.x+1.6*athlete.unit, athlete.y+12.9*athlete.unit);
			break;
		case 35:
			context.moveTo(athlete.x+0.6*athlete.unit, athlete.y+6.1*athlete.unit);
			context.lineTo(athlete.x+1*athlete.unit, athlete.y+9.4*athlete.unit);
			context.lineTo(athlete.x+2.3*athlete.unit, athlete.y+12.0*athlete.unit);
			break;
		case 36:
			context.moveTo(athlete.x+0.6*athlete.unit, athlete.y+6.1*athlete.unit);
			context.lineTo(athlete.x+1.5*athlete.unit, athlete.y+9.3*athlete.unit);
			context.lineTo(athlete.x+3.2*athlete.unit, athlete.y+10.2*athlete.unit);
			break;
		case 37:
			context.lineTo(athlete.x+1.3*athlete.unit, athlete.y+8.1*athlete.unit);
			context.lineTo(athlete.x+3.4*athlete.unit, athlete.y+8.2*athlete.unit);
			break;
	}
}

function drawLeftLeg(legPosition) {
	context.moveTo(athlete.x, athlete.y + 11*athlete.unit);
	switch(legPosition) {
		case 0:		//indulás előtt áll, bal láb elöl
			context.lineTo(athlete.x+athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+2*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 1:		//induláskor a testsúlyát elkezdi ráhelyezni
			context.lineTo(athlete.x+0.5*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+1.5*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 2:		//a testsúlyát ráhelyezi
			context.lineTo(athlete.x, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+1*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 3:		//elkezdi a talajt elrúgni
			context.lineTo(athlete.x-1.5*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x-0.5*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 4:		//teljesen hátranyúlik a lába
			context.lineTo(athlete.x-2*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x-1*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 5:		//elkezd előrelendülni a hátsó lába
			context.lineTo(athlete.x-1.1*athlete.unit, athlete.y+16*athlete.unit);
			context.lineTo(athlete.x-3.5*athlete.unit, athlete.y+18*athlete.unit);
			context.lineTo(athlete.x-3*athlete.unit, athlete.y+19.5*athlete.unit);
			break;
		case 6:		//még jobban előrelendül a hátsó lába
			context.lineTo(athlete.x-0.7*athlete.unit, athlete.y+16.2*athlete.unit);
			context.lineTo(athlete.x-3.4*athlete.unit, athlete.y+14.5*athlete.unit);
			context.lineTo(athlete.x-3.6*athlete.unit, athlete.y+16.3*athlete.unit);
			break;
		case 7:		//hátsó, átlendülő comb majdnem a törzs alatt van
			context.lineTo(athlete.x-0.3*athlete.unit, athlete.y+16.4*athlete.unit);
			context.lineTo(athlete.x-2.7*athlete.unit, athlete.y+13.8*athlete.unit);
			context.lineTo(athlete.x-3.5*athlete.unit, athlete.y+15.2*athlete.unit);
			break;
		case 8:		//hátsó, átlendülő comb a törzs előtt van
			context.lineTo(athlete.x+0.3*athlete.unit, athlete.y+16.4*athlete.unit);
			context.lineTo(athlete.x-2.5*athlete.unit, athlete.y+14.4*athlete.unit);
			context.lineTo(athlete.x-2.9*athlete.unit, athlete.y+15.9*athlete.unit);
			break;
		case 9:		//hátsó, átlendülő comb áthalad az első comb előtt
			context.lineTo(athlete.x+1.4*athlete.unit, athlete.y+16.2*athlete.unit);
			context.lineTo(athlete.x-1.8*athlete.unit, athlete.y+16.6*athlete.unit);
			context.lineTo(athlete.x-1.8*athlete.unit, athlete.y+18.3*athlete.unit);
			break;
		case 10:		//keresztlépésnél beszökkenés (HOP), bal láb eltolja a talajt
			context.lineTo(athlete.x-3.3*athlete.unit, athlete.y+18*athlete.unit);
			context.lineTo(athlete.x-2.7*athlete.unit, athlete.y+19.4*athlete.unit);
			break;
		case 11:
			drawLeftLeg(10);
			break;
		case 12:
			drawLeftLeg(10);
			break;
		case 13:		//keresztlépésnél beszökkenés (HOP), bal láb elindul előrefelé
			context.lineTo(athlete.x+0.4*athlete.unit, athlete.y+16*athlete.unit);
			context.lineTo(athlete.x-1.6*athlete.unit, athlete.y+17.7*athlete.unit);
			context.lineTo(athlete.x-0.7*athlete.unit, athlete.y+18.7*athlete.unit);
			break;
		case 14:		//keresztlépésnél beszökkenés (HOP), bal láb felkészül a kitámasztásra
			context.lineTo(athlete.x+2.1*athlete.unit, athlete.y+15.2*athlete.unit);
			context.lineTo(athlete.x+1.8*athlete.unit, athlete.y+19*athlete.unit);
			context.lineTo(athlete.x+2.9*athlete.unit, athlete.y+19.5*athlete.unit);
			break;
		case 15:		//keresztlépésnél beszökkenés (HOP), kitámasztás előtti pillanat
			context.lineTo(athlete.x+2.3*athlete.unit, athlete.y+15*athlete.unit);
			context.lineTo(athlete.x+3.1*athlete.unit, athlete.y+19.7*athlete.unit);
			context.lineTo(athlete.x+4.2*athlete.unit, athlete.y+19.4*athlete.unit);
			break;
		case 16:		//keresztlépésnél beszökkenés (HOP), kitámasztás előtti pillanat, láb már nyújtva van
			context.lineTo(athlete.x+3.8*athlete.unit, athlete.y+19.3*athlete.unit);
			context.lineTo(athlete.x+4.8*athlete.unit, athlete.y+18.4*athlete.unit);
			break;
		case 17:		//keresztlépésnél beszökkenés (HOP), kitámasztás előtti pillanat, láb már nyújtva van 2.
			context.lineTo(athlete.x+3.8*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+4.8*athlete.unit, athlete.y+19.6*athlete.unit);
			break;
		case 18:		//keresztlépésnél beszökkenés (HOP), kitámasztás, talajfogás
			context.lineTo(athlete.x+3.7*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+4.7*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 19:		//keresztlépésnél beszökkenés (HOP), kitámasztás, dobás megkezdése 
			context.lineTo(athlete.x+3.4*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+4.4*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 20:
			drawLeftLeg(19);
			break;
		case 21:
			drawLeftLeg(19);
			break;
		case 22:
			drawLeftLeg(19);
			break;
		case 23:
			drawLeftLeg(19);
			break;
		case 24:
			drawLeftLeg(19);
			break;
		case 25:
			drawLeftLeg(19);
			break;
		case 26:
			drawLeftLeg(19);
			break;
		case 27://megállás része
			context.lineTo(athlete.x+2.9*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+3.9*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 28:
			context.lineTo(athlete.x+1.8*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+2.8*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 29:
			context.lineTo(athlete.x+1*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+2*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 30:	//a teljes testsúlya a lábán van
			context.lineTo(athlete.x+0*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+1*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 31:
			drawLeftLeg(27);
			break;
		case 32:
			drawLeftLeg(27);
			break;
		case 33:
			context.lineTo(athlete.x-1*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+0*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 34:
			context.lineTo(athlete.x-1.8*athlete.unit, athlete.y+19*athlete.unit);
			context.lineTo(athlete.x-1*athlete.unit, athlete.y+20.*athlete.unit);
			break;
		case 35:
			context.lineTo(athlete.x-1.2*athlete.unit, athlete.y+15.7*athlete.unit);
			context.lineTo(athlete.x-3.4*athlete.unit, athlete.y+16.8*athlete.unit);
			context.lineTo(athlete.x-3.4*athlete.unit, athlete.y+18.8*athlete.unit);
			break;
		case 36:
			context.lineTo(athlete.x+0.7*athlete.unit, athlete.y+15.4*athlete.unit);
			context.lineTo(athlete.x-0.8*athlete.unit, athlete.y+18*athlete.unit);
			context.lineTo(athlete.x+0.2*athlete.unit, athlete.y+18.7*athlete.unit);
			break;
		case 37:
			context.lineTo(athlete.x+1.6*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+2.6*athlete.unit, athlete.y+20*athlete.unit);
			break;
	}
}

function drawRightLeg(legPosition) {
	context.moveTo(athlete.x, athlete.y + 11*athlete.unit);
	switch(legPosition) {
		case 0:		//indulás előtt áll, jobb láb hátul
			context.lineTo(athlete.x-athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x, athlete.y+20*athlete.unit);
			break;
		case 1:		//induláskor elrúgja a talajt
			context.lineTo(athlete.x-0.3*athlete.unit, athlete.y+16*athlete.unit);
			context.lineTo(athlete.x-athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x, athlete.y+20*athlete.unit);
			break;
		case 2:		//induláskor előreviszi a lábát
			context.lineTo(athlete.x+athlete.unit, athlete.y+15*athlete.unit);
			context.lineTo(athlete.x-1*athlete.unit, athlete.y+18*athlete.unit);
			context.lineTo(athlete.x-0.2*athlete.unit, athlete.y+19.5*athlete.unit);
			break;
		case 3:		//még előrébb van a lába
			context.lineTo(athlete.x+2*athlete.unit, athlete.y+14*athlete.unit);
			context.lineTo(athlete.x+0.6*athlete.unit, athlete.y+18*athlete.unit);
			context.lineTo(athlete.x+1.6*athlete.unit, athlete.y+19*athlete.unit);
			break;
		case 4:		//teljesen fent van a lába
			context.lineTo(athlete.x+2.5*athlete.unit, athlete.y+12*athlete.unit);
			context.lineTo(athlete.x+2*athlete.unit, athlete.y+17*athlete.unit);
			context.lineTo(athlete.x+3*athlete.unit, athlete.y+17*athlete.unit);
			break;
		case 5:		//előreviszi a lábát, elkezd felkészülni a talajfogásra
			context.lineTo(athlete.x+2.5*athlete.unit, athlete.y+13*athlete.unit);
			context.lineTo(athlete.x+2.3*athlete.unit, athlete.y+18*athlete.unit);
			context.lineTo(athlete.x+3.3*athlete.unit, athlete.y+19*athlete.unit);
			break;
		case 6:		//felkészül az első láb talajfogására
			context.lineTo(athlete.x+2.2*athlete.unit, athlete.y+14*athlete.unit);
			context.lineTo(athlete.x+2.4*athlete.unit, athlete.y+19*athlete.unit);
			context.lineTo(athlete.x+3.5*athlete.unit, athlete.y+19.5*athlete.unit);
			break;
		case 7:		//az első láb talajfogására
			context.lineTo(athlete.x+1.8*athlete.unit, athlete.y+15*athlete.unit);
			context.lineTo(athlete.x+1.8*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+2.8*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 8:		//az első láb talajfogására
			context.lineTo(athlete.x+1.4*athlete.unit, athlete.y+15.3*athlete.unit);
			context.lineTo(athlete.x+1.2*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+2.2*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 9:		///az első láb elkezd a törzs mögé kerülni
			context.lineTo(athlete.x+0.6*athlete.unit, athlete.y+15.7*athlete.unit);
			context.lineTo(athlete.x-0.3*athlete.unit, athlete.y+19.6*athlete.unit);
			context.lineTo(athlete.x+0.9*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 10:	//beszökkenésnél jobb láb talajfogásra készül fel
			context.lineTo(athlete.x+1.6*athlete.unit, athlete.y+14.5*athlete.unit);
			context.lineTo(athlete.x+2.4*athlete.unit, athlete.y+18.3*athlete.unit);
			context.lineTo(athlete.x+3.1*athlete.unit, athlete.y+19.5*athlete.unit);
			break;
		case 11:	//beszökkenésnél jobb láb talajfogásra készül fel
			drawRightLeg(10);
			break;
		case 12:	//beszökkenésnél jobb láb talajfogásra készül fel
			drawRightLeg(10);
			break;
		case 13:	//beszökkenésnél jobb láb talajfogásra készül fel
			drawRightLeg(10);
			break;
		case 14:	//beszökkenésnél jobb láb talajfogásra készül fel
			drawRightLeg(10);
			break;
		case 15:	//beszökkenésnél jobb láb talajfogásra készül fel
			drawRightLeg(10);
			break;
		case 16:	//beszökkenésnél jobb láb talajfogásra készül fel
			context.lineTo(athlete.x+1*athlete.unit, athlete.y+14*athlete.unit);
			context.lineTo(athlete.x+1*athlete.unit, athlete.y+17.7*athlete.unit);
			context.lineTo(athlete.x+1.8*athlete.unit, athlete.y+18.4*athlete.unit);
			break;
		case 17:	//beszökkenésnél jobb láb szinte már talajt fog
			context.lineTo(athlete.x+0.5*athlete.unit, athlete.y+15*athlete.unit);
			context.lineTo(athlete.x-0.2*athlete.unit, athlete.y+19.3*athlete.unit);
			context.lineTo(athlete.x+0.8*athlete.unit, athlete.y+19.8*athlete.unit);
			break;
		case 18:	//beszökkenésnél jobb láb beforgatása elkezdődik
			context.lineTo(athlete.x+0.2*athlete.unit, athlete.y+15.3*athlete.unit);
			context.lineTo(athlete.x-0.7*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x-0.3*athlete.unit, athlete.y+20.5*athlete.unit);
			break;
		case 19:	//beszökkenésnél jobb láb beforgatása folytatódik
			context.lineTo(athlete.x-0.4*athlete.unit, athlete.y+15.5*athlete.unit);
			context.lineTo(athlete.x-2.4*athlete.unit, athlete.y+19.4*athlete.unit);
			context.lineTo(athlete.x-2.4*athlete.unit, athlete.y+20.5*athlete.unit);
			break;
		case 20:	//beszökkenésnél jobb láb beforgatása folytatódik 2
			context.lineTo(athlete.x-0.2*athlete.unit, athlete.y+16.7*athlete.unit);
			context.lineTo(athlete.x-2.6*athlete.unit, athlete.y+18.5*athlete.unit);
			context.lineTo(athlete.x-3.4*athlete.unit, athlete.y+20.5*athlete.unit);
			break;
		case 21:	//beszökkenésnél jobb láb beforgatása folytatódik 3
			context.lineTo(athlete.x-0.3*athlete.unit, athlete.y+16.9*athlete.unit);
			context.lineTo(athlete.x-2.8*athlete.unit, athlete.y+18.7*athlete.unit);
			context.lineTo(athlete.x-3.8*athlete.unit, athlete.y+20.2*athlete.unit);
			break;
		case 22:	//beszökkenésnél jobb láb beforgatása befejeződik, előrenyomás
			context.lineTo(athlete.x-0.1*athlete.unit, athlete.y+17*athlete.unit);
			context.lineTo(athlete.x-2.6*athlete.unit, athlete.y+18.4*athlete.unit);
			context.lineTo(athlete.x-3.6*athlete.unit, athlete.y+20.2*athlete.unit);
			break;
		case 23:
			drawRightLeg(19);
			break;
		case 24:
			drawRightLeg(19);
			break;
		case 25:
			drawRightLeg(19);
			break;
		case 26:
			drawRightLeg(19);
			break;
		case 27:	//megállás megkezdése
			context.lineTo(athlete.x-1.4*athlete.unit, athlete.y+16.9*athlete.unit);
			context.lineTo(athlete.x-3.5*athlete.unit, athlete.y+19.4*athlete.unit);
			context.lineTo(athlete.x-4.6*athlete.unit, athlete.y+20.4*athlete.unit);
			break;
		case 28:
			context.lineTo(athlete.x-1.7*athlete.unit, athlete.y+16.8*athlete.unit);
			context.lineTo(athlete.x-3.8*athlete.unit, athlete.y+19.3*athlete.unit);
			context.lineTo(athlete.x-4.9*athlete.unit, athlete.y+20.3*athlete.unit);
			break;
		case 29:
			context.lineTo(athlete.x-4.5*athlete.unit, athlete.y+17.1*athlete.unit);
			context.lineTo(athlete.x-5.1*athlete.unit, athlete.y+19.2*athlete.unit);
			break;
		case 30:
			context.lineTo(athlete.x-4.5*athlete.unit, athlete.y+17.1*athlete.unit);
			context.lineTo(athlete.x-5.1*athlete.unit, athlete.y+19.2*athlete.unit);
			break;
		case 31:
			context.lineTo(athlete.x-4.5*athlete.unit, athlete.y+17.1*athlete.unit);
			context.lineTo(athlete.x-5.1*athlete.unit, athlete.y+19.2*athlete.unit);
			break;
		case 2:
			context.lineTo(athlete.x-2*athlete.unit, athlete.y+16*athlete.unit);
			context.lineTo(athlete.x-4.3*athlete.unit, athlete.y+15.3*athlete.unit);
			context.lineTo(athlete.x-5.4*athlete.unit, athlete.y+16.6*athlete.unit);
			break;
		case 33:
			context.lineTo(athlete.x+0.5*athlete.unit, athlete.y+15.3*athlete.unit);
			context.lineTo(athlete.x-2.3*athlete.unit, athlete.y+15.6*athlete.unit);
			context.lineTo(athlete.x-2.9*athlete.unit, athlete.y+17.2*athlete.unit);
			break;
		case 34:
			context.lineTo(athlete.x+1.8*athlete.unit, athlete.y+14.8*athlete.unit);
			context.lineTo(athlete.x+0.4*athlete.unit, athlete.y+18.3*athlete.unit);
			context.lineTo(athlete.x+1.5*athlete.unit, athlete.y+19.3*athlete.unit);
			break;
		case 35:
			context.lineTo(athlete.x+1.5*athlete.unit, athlete.y+15.3*athlete.unit);
			context.lineTo(athlete.x+1.5*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+2.5*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 36:
			context.lineTo(athlete.x+1.3*athlete.unit, athlete.y+15.5*athlete.unit);
			context.lineTo(athlete.x+0.8*athlete.unit, athlete.y+20*athlete.unit);
			context.lineTo(athlete.x+1.8*athlete.unit, athlete.y+20*athlete.unit);
			break;
		case 37:
			context.lineTo(athlete.x+0.9*athlete.unit, athlete.y+15.8*athlete.unit);
			context.lineTo(athlete.x-1.2*athlete.unit, athlete.y+17.9*athlete.unit);
			context.lineTo(athlete.x-0.8*athlete.unit, athlete.y+20*athlete.unit);
			break;
	}
}

function drawHeadAndTrunk(trunkPosition) {
	switch(trunkPosition) {
		case 0:
			context.arc(athlete.x, athlete.y, 2.5*athlete.unit, 0, Math.PI*2, true);
			context.moveTo(athlete.x, athlete.y + 2.5*athlete.unit);
			context.lineTo(athlete.x, athlete.y + 11*athlete.unit);
			break;
		case 1:
			context.arc(athlete.x+1.5*athlete.unit, athlete.y+0.4*athlete.unit, 2.5*athlete.unit, 0, Math.PI*2, true);
			context.moveTo(athlete.x+1*athlete.unit, athlete.y + 2.6*athlete.unit);
			context.lineTo(athlete.x, athlete.y + 11*athlete.unit);
			break;
		case 2:
			context.arc(athlete.x+2.6*athlete.unit, athlete.y+1.1*athlete.unit, 2.5*athlete.unit, 0, Math.PI*2, true);
			context.moveTo(athlete.x+1.6*athlete.unit, athlete.y + 3.2*athlete.unit);
			context.lineTo(athlete.x, athlete.y + 11*athlete.unit);
			break;
		case 3:
			context.arc(athlete.x+3.2*athlete.unit, athlete.y+2.1*athlete.unit, 2.5*athlete.unit, 0, Math.PI*2, true);
			context.moveTo(athlete.x+2.4*athlete.unit, athlete.y + 4.4*athlete.unit);
			context.lineTo(athlete.x, athlete.y + 11*athlete.unit);
			break;
		case 4:
			drawHeadAndTrunk(3);
			break;
		case 5://dobás utáni megállás
			drawHeadAndTrunk(3);
			break;
		case 6:
			drawHeadAndTrunk(3);
			break;
		case 7:
			drawHeadAndTrunk(3);
			break;
		case 8:
			drawHeadAndTrunk(3);
			break;
		case 9:	//dobás utáni megálláskor a felegyenesedés
			drawHeadAndTrunk(3);
			break;
		case 10:	//dobás utáni megálláskor a felegyenesedés
			drawHeadAndTrunk(2);
			break;
		case 11:
			drawHeadAndTrunk(2);
			break;
		case 12:
			drawHeadAndTrunk(2);
			break;
		case 13:
			drawHeadAndTrunk(1);
			break;
		case 13:
			drawHeadAndTrunk(1);
			break;
		case 14:	//teljesen felegyenesedett helyzet
			drawHeadAndTrunk(0);
			break;
	}
}

function drawJavelin(status) {
	switch(status) {
		case 0:		//Fogja a gerelyt indulás előtt és futáskor
			context.moveTo(athlete.x-0.5*javelin.length, athlete.y-8*athlete.unit);
			context.lineTo(athlete.x+0.5*javelin.length, athlete.y+1*athlete.unit);
			break;
		case 1: //Lekészítés kezdetekor
			context.moveTo(athlete.x-0.6*javelin.length, athlete.y-5.3*athlete.unit);
			context.lineTo(athlete.x+0.4*javelin.length, athlete.y-1*athlete.unit);
			break;
		case 2:
			context.moveTo(athlete.x-0.6*javelin.length, athlete.y-1.4*athlete.unit);
			context.lineTo(athlete.x+0.4*javelin.length, athlete.y-1.4*athlete.unit);
			break;
		case 3:
			context.moveTo(athlete.x-0.55*javelin.length, athlete.y+1*athlete.unit);
			context.lineTo(athlete.x+0.45*javelin.length, athlete.y-0.8*athlete.unit);
			break;
		case 4:
			context.moveTo(athlete.x-0.54*javelin.length, athlete.y+1.9*athlete.unit);
			context.lineTo(athlete.x+0.43*javelin.length, athlete.y-0.4*athlete.unit);
			break;
		case 5: //Dobást megelőzően
			context.moveTo(athlete.x-0.56*javelin.length, athlete.y+6.8*athlete.unit);
			context.lineTo(athlete.x+0.37*javelin.length, athlete.y-0.3*athlete.unit);
			break;
		case 6: //Dobás kezdete
			context.moveTo(athlete.x-0.51*javelin.length, athlete.y+6.5*athlete.unit);
			context.lineTo(athlete.x+0.4*javelin.length, athlete.y-1.8*athlete.unit);
			break;
		case 7: //Dobás
			context.moveTo(athlete.x-0.48*javelin.length, athlete.y+6.3*athlete.unit);
			context.lineTo(athlete.x+0.43*javelin.length, athlete.y-2.2*athlete.unit);
			break;
		case 8: //Dobás
			context.moveTo(athlete.x-0.44*javelin.length, athlete.y+5.5*athlete.unit);
			context.lineTo(athlete.x+0.48*javelin.length, athlete.y-4.3*athlete.unit);
			break;
		case 9: //Dobás vége
			context.moveTo(athlete.x-0.39*javelin.length, athlete.y+4.6*athlete.unit);
			context.lineTo(athlete.x+0.6*javelin.length, athlete.y-5.5*athlete.unit);
			break;
		case 10: //
			context.moveTo(athlete.x-0.39*javelin.length, athlete.y+4.6*athlete.unit);
			context.lineTo(athlete.x+0.6*javelin.length, athlete.y-5.5*athlete.unit);
			break;
	}
}

function clear() {
	context.clearRect(athlete.x-26*athlete.unit, athlete.y-15*athlete.unit, athlete.x+22*athlete.unit, athlete.y+12*athlete.unit);
	context.clearRect(0,380,w, h);
	context.clearRect(10, 50, 400, 100);
}

function drawAthlete(){
	context.beginPath();
	context.strokeStyle= athlete.lineColor;
	context.lineWidth= athlete.width;
	drawLeftArm(athlete.armPosition);
	drawLeftLeg(athlete.legPosition);
	context.stroke();
	context.closePath();
	context.beginPath();
	drawHeadAndTrunk(athlete.trunkPosition);
	context.stroke();
	context.closePath();	
	context.beginPath();
	drawRightArm(athlete.armPosition);
	drawRightLeg(athlete.legPosition);
	context.stroke();
	context.closePath();
	
	context.beginPath();
	context.strokeStyle= javelin.lineColor;
	context.lineWidth= javelin.width;
	drawJavelin(javelin.status);
	context.closePath();
	context.stroke();
}

function drawEnvironment() {
	if(game.field == null) {
		game.field= new Image();
		game.field.onload = function(){
  		context.drawImage(game.field, 0,0, 7500, 160, game.fieldX, game.fieldY, 7500, 100);
		};
		game.field.src= "images/field.png";
	}
	else
  	context.drawImage(game.field, 0,0, 7500, 160, game.fieldX, game.fieldY, 7500, 100);
	
}

function clearCanvas() {
	canvas = document.getElementById('gameCanvas');
	if(canvas.getContext) {
		context = canvas.getContext("2d");
		canvas.setAttribute("width", w - 2);
		canvas.setAttribute("height", h - 2);
		context.clearRect(0, 0, w, h);
	}
}

function initializeGame() {
	w = window.innerWidth;
	h = 480;
	clearCanvas();
	
	athlete= new Athlete();
	javelin= new Javelin();
	game   = new Game();
}

/*
var map = {
    'explode': function() {
      prepExplosive();
      if (flammable()) issueWarning();
      doExplode();
    },

    'hibernate': function() {
      if (status() == 'sleeping') return;
      // ... I can't keep making this stuff up
    },
    // ...
  };

  var thisFun = map[funCode];
  if (thisFun) thisFun();
*/



