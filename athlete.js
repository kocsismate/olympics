
function Athlete(){
	var canvas= document.getElementById("gameCanvas");
	
	this.strength     = localStorage.getItem("strength");
	this.speed        = localStorage.getItem("speed");
	this.endurance    = localStorage.getItem("endurance");
	this.flexibility  = localStorage.getItem("flexibility");
	this.technique    = localStorage.getItem("technique");
	this.experience   = localStorage.getItem("experience");
	this.height       = localStorage.getItem("height");
	this.weight       = localStorage.getItem("weight");
	
	this.status       = 0;
	this.legPosition  = 0;
	this.trunkPosition= 0;
	this.armPosition  = 0;
	this.headPosition = 0;
	
	this.momentum     = 0;
	this.length       = 130+(this.height - 180);
	this.width        = Math.floor(3 + (this.weight - 80) / 10);
	this.x            = 0;
	this.y            = 0;
	this.unit         = this.length / 20;
	this.lineColor    = "black";
	this.frameNumber  = 0;				//Hanyadik frame
	this.frameChange  = 0;
	
	this.setFrameChange= function() {
		if(this.status == 0)
			this.frameChange= 8- Math.round(this.momentum/25)/1.5;
		else if(this.status <= 2)
			this.frameChange= 4- Math.round(this.momentum/25)/1.5;
		else if(this.status >= 3)
			this.frameChange= 3- Math.round(this.momentum/ 25)/1.5;
	}
	
	this.setArmPosition= function(position) {
		if(this.frameNumber >= this.frameChange) {
			this.armPosition= position == null? this.armPosition+1 : position;
			return true;
		}
		return false;
	}
	
	this.setLegPosition= function(position) {
		if(this.frameNumber >= this.frameChange) {
			this.legPosition= position == null? this.legPosition+1 : position;
			return true;
		}
		return false;
	}
	
	this.setTrunkPosition= function(position) {	
		if(this.frameNumber >= this.frameChange) {
			this.trunkPosition= position == null? this.trunkPosition+1 : position;
			return true;
		}
		return false;
	}
	
	this.setStatus= function(status) {	
			this.status= status == null? this.status+1 : status;
	}
	
	/** Beállítja az atléta lendületét
	*/
	this.setMomentum= function(change) {
		var sign       = change != 0? change / Math.abs(change) : 0;
		var absSpeed   = Math.abs(athlete.speed);
		var absMomentum= Math.abs(athlete.momentum);
		var now        = new Date().getTime();
		var gain       = 0;
		if(sign == 0)
			return;
		if(sign == 1)
			game.lastSpeedComboTime= now;
		//gain= 1+Math.ceil(athlete.momentum/15+(athlete.speed < 10? 3 : athlete.speed/10) /(1+athlete.width/2));
		gain= Math.ceil(1+athlete.momentum/3+absSpeed/7/athlete.width);
		if(game.maximalSpeedTime == 0 && absSpeed - absMomentum - 1 <= absSpeed*0.08)
			;//game.maximalSpeedTime= now;
		else
			game.maximalSpeedTime= 0;
		if(game.maximalSpeedTime != 0 && now - game.maximalSpeedTime > 600+athlete.endurance*50) {
			//gain= -1;
		}
		athlete.momentum= athlete.momentum+sign*gain <= absSpeed? athlete.momentum+sign*gain : absSpeed;
	}
	
		
}

