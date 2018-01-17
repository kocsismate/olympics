<?php
  header('Content-Type: text/html; charset=utf-8');
  error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
  include_once("common.php");
  session_start();
  
  $function= $_POST["function"];
  $result= "Error!";
  //------------------------------------------------ Weblap ------------------------------------------------------------------------  
  if($function == "login") {
		if($_POST["loginEmail"] == "" || $_POST["loginPassword"] == "")
			$result= "Invalid data!";
	  else {
			if(!isset($_POST["loginAutoLogin"]) || $_POST["loginAutoLogin"] == false)
	      $_POST["loginAutoLogin"]= false;
	  $result= loadUser($_POST["loginEmail"], $_POST["loginPassword"], $_POST["loginAutoLogin"]);
		}
  }
	else if($function == "logout") {
    logout();
  }
	else if($function == "register") {
		if($_POST["registerEmail"] && $_POST["registerPassword"] && $_POST["registerCountry"] && $_POST["registerFirstname"] && $_POST["registerSurname"])
      $result= registerUser($_POST["registerEmail"], $_POST["registerPassword"], 1, $_POST["registerFirstname"], $_POST["registerSurname"], $_POST["registerCountry"], $_POST["registerHeight"], $_POST["registerWeight"], $_POST["registerStrength"], $_POST["registerSpeed"], $_POST["registerEndurance"], $_POST["registerFlexibility"], $_POST["registerTechnique"]);
		else
		  $result= "All field must be filled!";
  }
	else if($function == "printTrainingTime") {
		$result= printTrainingTime();
  }
	else if($function == "train" && $_POST["type"] >= 0 && $_POST["type"] < 5) {
		$trainings= array('strength', 'speed', 'endurance', 'flexibility', 'technique');
		$result= train($_SESSION["id"], $_POST["type"]);
		if($result == "") {
			$_SESSION['lastTrainingTime']= time();
			$_SESSION[$trainings[$_POST["type"]]]+= 1;
			$result= "Successful training!<script language='javascript'>document.getElementById('trainingSkill".$_POST["type"]."').innerHTML= '".($_SESSION[$trainings[$_POST["type"]]])."'; ajaxRequest('ajax.php', 'function=printTrainingTime', 'trainingTime', '');";
		}
		else
			$result.= "<script language='javascript'>";
		$result.= "setTimeout(function(){document.getElementById('trainingResult').innerHTML= '';}, 10000);</script>";
	}
	else if($function == "compete" && $_POST["type"] >= 0 && $_POST["type"] < 8 && $_POST["level"] >= 1 && $_POST["type"] <= 5 ){
		$result= compete($_SESSION["id"], $_POST["type"], $_POST['level']);
	}
	else if($function == "refreshTopList") {
		include("toplist.php");
		$result= "";
	}
	else if($function == "refreshProfile") {
		$result= getProfile($_SESSION['id']);
	}
	else if($_GET['function'] == "showProfile" && $_GET['id'] > 0) {
		$result= "<html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>".
						 "<script type='text/javascript' src='common.js'></script>".
    				 "<link rel='StyleSheet' href='style.css' type='text/css' media='screen'></head>".
						 "<body style='margin-top: 15px;'>" . getProfile($_GET['id']) . "</body></html>";
	}
	else if($function == "refreshCompetitionInfo")
		$result= getCompetitionInfo();
	else if($function == "showCompetitionChooser")
		$result= getCompetitionChooser();
	else if($function == "registerThrow" && $_POST["event"] >= 1 && $_POST["event"] <= 10 && $_POST["round"] >= 1 && $_POST["round"] <= 6 && $_POST["momentum"] > 0 && $_POST["momentum"] < 200 && $_POST["wind"] >= -8 && $_POST["wind"] <= 8 && isset($_POST["distanceToLine"]) && ((abs($_POST["optimalThrowingTime"]-$_POST["throwingTime"]) < 5000 && $_POST["releaseTime"]-$_POST["throwingTime"] > 0)) || ($_POST["optimalThrowingTime"] == 0 || $_POST["throwingTime"] == 0) || $_POST["releaseTime"] == 0) {
		$chance        = rand(166,338)/100;
		$angle1 			 = ($_POST["releaseTime"]-$_POST["throwingTime"]);
		$angle1        = $angle1 < 128? 16 : ($angle1 > 592? 74 : $angle1/8);
		$angle         = 1-abs(42-$angle1)/100;
		$timing        = ($optimalThrowingTime * $timing != 0)? abs($_POST["optimalThrowingTime"]-$_POST["throwingTime"]) : 2000;
		$timing        =  1.6*(log($timing > 750? 63000/13000 : 63000/(1+$timing*15)));
		$distanceToLine= $_POST["distanceToLine"];
		$wind          = 1+(-$_POST["wind"])/60;
		$wind2         = $_POST["wind"];
		$force         = 0.8*log($_SESSION["speed"]*$_SESSION["strength"]);
		$dexterity     = 1.3*log($_SESSION["flexibility"]*$_SESSION["technique"]);
		$momentum      = 1+$_POST["momentum"] / 105;
		
		$length= $_POST["distanceToLine"] >= 0? ($chance + ($force+$dexterity)*$timing*$angle)*$momentum*$wind - $distanceToLine : "X";
													//maximum value: (14,87   +  27,6309956*1,166666          + 13,1460799*1  )*1.89      - 0 = 60,252 * 1.89= 113,8763
													//avarage value: 	12,50   + (0,5+8,047189+11,26606)*1     + 7,362254  *0,8)*1.22      - 2 = kb 44
		$length2= $length == "X"? NULL : floor($length*100);
		$length3= $length == "X"? $length : round($length, 2) . " m";
		$length4= $length == "X"? $length : $length3 . " (" . round($angle1) . "°)";
		$dbh= dbConnect();
		$stmt= $dbh->prepare("CALL registerResult(?, ?, ?, ?, ?)") or die($dbh->error);
	  $stmt->bind_param("iiidi", $_SESSION["id"], $_POST["event"], $length2, $wind2, round($angle1));
		$stmt->execute() or die($stmt->error);
		$stmt->close();
		$dbh->close();
		
		$result= "<script language='javascript'>var i= 0; sessionStorage.setItem('competitionOwnResult".$_POST["round"]."', '".$length4."');\n" .
					   "for(i=1; i <= 12; i++) {\n" .
					   "if(sessionStorage.getItem('competitionOpponent'+i+'Id') != 0 && (isNaN(parseFloat(sessionStorage.getItem('competitionOpponent'+i+'Result'))) == true || (isNaN(parseFloat('".$length."')) == false && parseFloat(sessionStorage.getItem('competitionOpponent'+i+'Result')) < parseFloat('".$length."'))))\n" .
					   "sessionStorage.setItem('competitionOpponent'+i+'Result', '".$length3."');\n" .
					   "}\n" .
						 "game.startRound(game.roundNumber+1); showPage(2, 1);\n" .
					   "</script>\n";
	}
  //-------------------------------------------------- Home ------------------------------------------------------------------------  
	echo $result;
	//print_r($_POST);
?>