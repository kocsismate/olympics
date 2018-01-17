
	function drawMan(){
		var w = window.innerWidth;
		var h = window.innerHeight;
		var canvas = document.getElementById('gameCanvas');
		if(canvas.getContext){
			context = canvas.getContext("2d");
			with(canvas){
				setAttribute("width", w - 6)
				setAttribute("height", h - 6)
			}
			with(context){
				clearRect(0, 0, w, h);
				strokeStyle = "#000000";
				lineWidth = "5";
				
				arc(w/2, h/2, h/10, 0, Math.PI*2, true);
				moveTo(w/2,  h/2+(h/10));
				lineTo(w/2, h-(h/5));
						
				/*
				Draw Legs
				*/
				moveTo(w/2, h-(h/5));
				lineTo(w/2+(h/20), h-(h/50)-30);
				moveTo(w/2, h-(h/5));
				lineTo(w/2-(h/20), h-(h/50)-30);
				/*
					Draw Arms 
				*/
				moveTo(w/2-h/10, (h/2+(h/20) +  h-(h/4))/2);
				lineTo(w/2+h/10, (h/2+(h/20) +  h-(h/4))/2);
				
				stroke();
			}
		
		}
	}