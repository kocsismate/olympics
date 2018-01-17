<?php

	function getCompetitionInfo() {
		$result = "<h3>Information</h3>";
		$result.= "<table class='competitionInfoTable'>";
		$result.= "<tr><td width='55'><b>event:</b></td><td id='competitionInfoEvent' width='150'></td><td width='50'><b>wind:</b></td><td id='competitionInfoWind' width='75'></td><td width='45'><b>date:</b></td><td>".date("Y.m.d.")."</td></tr>";
		$result.= "</table>";

		$result.= "<h3>Standings</h3>";
		$result.= "<table class='competitionInfoTable'>";
		$result.= "<tr>";
		for($i=0; $i < 2; $i++)
			$result.= "<th width='20'>#</th><th width='190'>athlete</th><th width='60'>country</th><th width='70'>result</th>";
		$result.= "</tr>";
		for($i=1; $i <= 6; $i++)
			$result.= "<tr><td><b>".$i."</b></td><td id='competitionOpponent".$i."Name'></td><td id='competitionOpponent".$i."Country'></td><td id='competitionOpponent".$i."Result'></td><td><b>".(6+$i)."</b></td><td id='competitionOpponent".(6+$i)."Name'></td><td id='competitionOpponent".(6+$i)."Country'</td><td id='competitionOpponent".(6+$i)."Result'></td></tr>";
		$result.= "</table>";

		$result.= "<h3>Your results</h3>";
		$result.= "<table class='competitionInfoTable' id='competitionOwnResultsTable'><tr>";
		for($i=1; $i <= 6; $i++)
			$result.= "<td id='competitionOwnResult".$i."'></td>";
		$result.= "</tr></table>";

		$result.= "<table class='competitionInfoTable' style='margin: 0px; width: 100%;'><tr>";
		$result.= "<tr><td><input id='restartCompetitionButton' type='button' value='restart competition' onclick='javascript:restartCompetition()'/>";
		$result.= "<input id='exitCompetitionButton' type='button' value='exit competition' onclick='javascript:exitCompetition()'/></td></tr>";
		$result.= "</table>";


		$result.= "<script language='javascript'>";
		$result.= "document.getElementById('competitionInfoEvent').innerHTML= sessionStorage.getItem('competitionEvent');";
		$result.= "document.getElementById('competitionInfoWind').innerHTML = sessionStorage.getItem('competitionWind') + ' m/s';";
		$result.= "var i;";
		$result.= "for(i=1; i <= 12; i++) {";
		$result.= "document.getElementById('competitionOpponent'+i+'Name').innerHTML= sessionStorage.getItem('competitionOpponent'+i+'Name');";
		$result.= "document.getElementById('competitionOpponent'+i+'Country').innerHTML= sessionStorage.getItem('competitionOpponent'+i+'Country');";
		$result.= "document.getElementById('competitionOpponent'+i+'Result').innerHTML= sessionStorage.getItem('competitionOpponent'+i+'Result');";
		$result.= "}";
		$result.= "for(i=1; i <= 6; i++)";
		$result.= "document.getElementById('competitionOwnResult'+i).innerHTML= sessionStorage.getItem('competitionOwnResult'+i);";
		$result.= "</script>";

		return $result;
	}

	function getCompetitionChooser() {
		$result= "<table id='competitionChooserTable'>";
		$result.= "<tr><td style='width: 260px'><i>Choose a competition event:</i></td><td></td></tr>";
		$dbh= dbConnect();
		$stmt= $dbh->prepare("SELECT id, name FROM disciplines ORDER BY id") or die($dbh->error);
		$stmt->execute() or die($stmt->error);
		$stmt->bind_result($id, $name) or die($stmt->error);
		$num= 0;
		while($stmt->fetch()) {
			$result.= "<tr><td><a id='competitionChooserTableEvent".$num."' onclick='".($num == 0? "javascript:selectGame(this)" : "")."' style='".($num == 0? "font-weight: 600;" : "font-weight: 500;")."'>".$name."</a></td><td></td><td></td></tr>";
			$num++;
		}
		$result.= "<tr><td></td><td></td><td></td></tr>";
		$result.= "<tr><td></td><td>level: <input id='competitionChooserTableLevel' type='range' min='1' max='5' step='1' value='1'/></td><td></td></tr>";
		$result.= "<tr><td></td><td id='competitionChooserResult'></td><td><input id='competeButton' type='button' value='go to competition' onclick='javascript:compete()'/></td></tr>";
		$result.= "</table>";

		$result.= "<script language='javascript'>";
		$result.= "var x= localStorage.getItem('competitionLevel');";
		$result.= "document.getElementById('competitionChooserTableLevel').value= isNaN(parseInt(x))? 1 : parseInt(x,10);";
		$result.= "</script>";

		return $result;
	}

	function getTopList($disciplineId, $start, $end, $limit) {
		$result= "<table class='topListTable'>";
		$result.="<tr><th width='30'>#</th><th width='220'>athlete</th><th width='80'>country</th><th width='80'>result</th><th width='80'>wind</th><th width='90'>date</th><th width='50'></th></tr>";

		$dbh= dbConnect();
	  $stmt= $dbh->prepare("SELECT * FROM loadTopResults WHERE disciplineId= ? ORDER BY CASE disciplineType " .
												 "WHEN 'HIGHER_THE_BETTER' THEN -resultValue ELSE resultValue END LIMIT ?") or die($dbh->error);
	  $stmt->bind_param("ii", $disciplineId, $limit); //date("m/d/y g:i A", $start), date("m/d/y g:i A", $end) ||| AND resultTime >= ? AND resultTime < ?
		$stmt->execute() or die($stmt->error);
		$stmt->bind_result($athleteId, $athleteFirstname, $athleteSurname, $athleteGender, $athleteCountry,
											 $countryCode, $countryName, $countryImage, $discipineId, $disciplineName, $disciplineDimension,
											 $disciplineType, $value, $wind, $time) or die($stmt->error);
		$num= 0;
	 	while($stmt->fetch()) {
			$num++;
			$result.= "<tr><td><b>".$num."</b></td><td><a onclick=\"window.open('ajax.php?function=showProfile&id=".$athleteId."','".$athleteSurname.", ".$athleteFirstname."','width=580,height=660,toolbar=0,location=0,status=0');\">".$athleteSurname.", ".$athleteFirstname."</a></td><td><img src='images/flags/small/".$countryImage."' title='".$countryName."' style='width:40px;'/></td><td>".formatValue($disciplineDimension, $value)."</td><td>".round($wind, 1)." m/s</td><td>".date("Y.m.d.", strtotime($time))."</td><td><b>".($num == 1? "WR" : "")."</b></td></tr>";
		}
		$stmt->close();
		$dbh->close();

		if($num == 0)
			$result="<span style='margin: 0px 0px 15px 60px;'>There are not any results in this event.</span>";
		else
			$result.= "</table>";

		return $result;
	}

	function getProfile($id) {
		$data= loadUserById($id);
		$result = "<h3>".$data['surname'].", ".$data['firstname']."</h3> (".$data['countryName']." <img src='images/flags/tiny/".$data['countryImage']."' style='clear:none;'/>)";
		$result.= "<table class='profileTable' style='margin-bottom: 0px;'>";
		$result.= "<tr><th colspan='2'>Personal data</th></tr>";
		$result.= "<tr><td width='90'>height:</td><td colspan='4'>".$data['height']." cm</td></tr>";
		$result.= "<tr><td>weight:</td><td colspan='4'>".$data['weight']." kg</td></tr>";
		$result.= "<tr><th colspan='2'>Skills</th></tr>";
		$result.= "<tr><td>strength:</td><td><input type='range' readonly='readonly' min='0' max='100' step='1' value='".$data['strength']."'/> <input type='text' readonly='readonly' value='".$data['strength']."' style='width: 35px;'/></td></tr>";
		$result.= "<tr><td>speed:</td><td><input type='range' readonly='readonly' min='0' max='100' step='1' value='".$data['speed']."'/> <input type='text' readonly='readonly' value='".$data['speed']."' style='width: 35px;'/></td></tr>";
		$result.= "<tr><td>endurance:</td><td><input type='range' readonly='readonly' min='0' max='100' step='1' value='".$data['endurance']."'/> <input type='text' readonly='readonly' value='".$data['endurance']."' style='width: 35px;'/></td></tr>";
		$result.= "<tr><td>flexibility:</td><td><input type='range' readonly='readonly' min='0' max='100' step='1' value='".$data['flexibility']."'/> <input type='text' readonly='readonly' value='".$data['flexibility']."' style='width: 35px;'/></td></tr>";
		$result.= "<tr><td>technique:</td><td><input type='range' readonly='readonly' min='0' max='100' step='1' value='".$data['technique']."'/> <input type='text' readonly='readonly' value='".$data['technique']."' style='width: 35px;'/></td></tr>";
		$result.= "</table>";

		$dbh= dbConnect();
	  $stmt= $dbh->prepare("SELECT * FROM loadTopResults WHERE athleteId = ?") or die($dbh->error);
		$stmt->bind_param("i", $id);
		$stmt->execute() or die($stmt->error);
		$stmt->bind_result($athleteId, $athleteFirstname, $athleteSurname, $athleteGender, $athleteCountry,
											 $countryCode, $countryName, $countryImage, $discipineId, $disciplineName, $disciplineDimension,
											 $disciplineType, $value, $wind, $time) or die($stmt->error);
		$num= 0;
		$result.= "<table class='profileTable'>";
		$result.= "<tr><th colspan='2'>Personal bests</th></tr>";
	 	while($stmt->fetch()) {
			$num++;
			$result.= "<tr><td width='130'>".$disciplineName.":</td><td width='90'>".formatValue($disciplineDimension, $value)."</td><td width='110'>".round($wind, 1)." m/s wind</td><td width='90'>".date("Y.m.d.", strtotime($time))."</td><td><b>".(0 == 1? "WR" : "")."</b></td></tr>";
		}
		if($num == 0)
			$result.= "<tr><td colspan='5'>Athlete has not competed yet.</td></tr>";
		$result.= "</table>";
		$stmt->close();
		$dbh->close();

		$result.= "</table>";

		return $result;
	}

	function train($id, $type) {
		$trainings= array("strength", "speed", "endurance", "flexibility", "technique");
    $dbh= dbConnect();
	  $stmt= $dbh->prepare("SELECT train(?, ?)") or die($dbh->error);
	  $stmt->bind_param("is", $id, $trainings[$type]);
		$stmt->execute() or die($stmt->error);
	  $stmt->bind_result($result) or die($stmt->error);
	  if($stmt->fetch()) {
		  if($result == "")
				;
	  }
		$stmt->close();
		$dbh->close();

		return $result;
	}

	function formatValue($type, $value) {
		$result= "";
		if($value <= 0)
			return "-";

		if($type == 'length') { //value is in cm.
			$result= ($value / 100) . " m";
		}
		else if($type == 'time') { //value is in 1/100 sec.
			$result= ($value / 100);
		}
		else $result= "-";

		return $result;
	}

	function compete($id, $event, $level) {
    $dbh= dbConnect();
	  $stmt= $dbh->prepare("CALL compete(?)") or die($dbh->error);
	  $stmt->bind_param("i", $id);
		$stmt->execute() or die($stmt->error);
		$result= "<script language='javascript'>localStorage.setItem('id', '".$_SESSION["id"]."');localStorage.setItem('competitionLevel', '".$level."');localStorage.setItem('firstname', '".$_SESSION['firstname']."'); localStorage.setItem('surname', '".$_SESSION['surname']."');" .
						 "localStorage.setItem('countryCode', '".$_SESSION['countryCode']."');localStorage.setItem('height', '".$_SESSION['height']."'); localStorage.setItem('weight', '".$_SESSION['weight']."');" .
						 "localStorage.setItem('strength', '".$_SESSION['strength']."');" .
						 "localStorage.setItem('speed', '".$_SESSION['speed']."'); localStorage.setItem('endurance', '".$_SESSION['endurance']."');" .
						 "localStorage.setItem('flexibility', '".$_SESSION['flexibility']."'); localStorage.setItem('technique', '".$_SESSION['technique']."');" .
						 "localStorage.setItem('experience', '".$_SESSION['experience']."');</script>";
		$stmt->close();
		$dbh->close();

		return $result;
	}

	function printTrainingTime() {
		if($_SESSION['lastTrainingTime'] > 100000) {
			$text= timeTo($_SESSION['lastTrainingTime']+3600) != ""? " (".timeTo($_SESSION['lastTrainingTime']+3600)." left to the next training)" : " (You can do training now!)";
			return "<i>".date("M. d H:i", $_SESSION['lastTrainingTime']).$text. "</i>";
		}
		else
			return "<i>-</i>";
	}

	function loadUser($email, $password, $autoLogin) {
	 $result= "Incorrect data!";
   $dbh= dbConnect();
	 $stmt= $dbh->prepare("SELECT * FROM loadAthletes WHERE athleteEmail = ? AND athletePassw = ?") or die($dbh->error);
	 $stmt->bind_param("ss", $email, $password);
	 $stmt->execute() or die($stmt->error);
	 $stmt->bind_result($id, $email, $password, $gender, $firstname, $surname, $countryId, $countryCode, $countryName, $countryImage, $height, $weight, $strength, $speed, $endurance, $flexibility, $technique, $experience, $registerTime, $lastLoginTime, $loginNumber, $competitionNumber, $lastTrainingTime) or die($stmt->error);
	 if($stmt->fetch()) {
		 $_SESSION['id']          = $id;
		 $_SESSION['email']       = $email;
		 $_SESSION['password']    = $password;
		 $_SESSION['gender']      = $gender;
		 $_SESSION['firstname']   = $firstname;
		 $_SESSION['surname']     = $surname;
		 $_SESSION['countryId']   = $countryId;
		 $_SESSION['countryCode'] = $countryCode;
		 $_SESSION['countryName'] = $countryName;
		 $_SESSION['countryImage']= $countryImage;
		 $_SESSION['height']      = $height;
		 $_SESSION['weight']      = $weight;
		 $_SESSION['strength']    = $strength;
		 $_SESSION['speed']       = $speed;
		 $_SESSION['endurance']   = $endurance;
		 $_SESSION['flexibility'] = $flexibility;
		 $_SESSION['technique']   = $technique;
		 $_SESSION['experience']  = $experience;
		 $_SESSION['lastTrainingTime'] = strtotime($lastTrainingTime);
		 $_SESSION['registerTime']     = strtotime($registerTime);
		 $_SESSION['competitionNumber']= $competitionNumber;

		 if($_POST["loginAutoLogin"] == true) {
	    setcookie("id", $_SESSION['id'], time()+86400000*60, "/");
		  setcookie("email", $_POST["loginEmail"], time()+86400000*60, "/");
	    setcookie("password", $_POST["loginPassword"], time()+86400000*60, "/");
		  setcookie("autoLogin", true, time()+86400000*60, "/");
	   }
		 $stmt->close();
		 $stmt= $dbh->prepare("SELECT LOGIN(?)") or die($dbh->error);
	 	 $stmt->bind_param('i', $id) or die($stmt->error);
		 $stmt->execute() or die($stmt->error);
     $result= "Logging in...<script language='javascript'>window.location.href='index.php';</script>";
   }
	 $stmt->close();
	 $dbh->close();

		return $result;
  }

	function loadUserById($id) {
   $dbh= dbConnect();
	 $stmt= $dbh->prepare("SELECT * FROM loadAthletes WHERE athleteId= ?") or die($dbh->error);
	 $stmt->bind_param("i", $id);
	 $stmt->execute() or die($stmt->error);
	 $stmt->bind_result($id, $email, $password, $gender, $firstname, $surname, $countryId, $countryCode, $countryName, $countryImage, $height, $weight, $strength, $speed, $endurance, $flexibility, $technique, $experience, $registerTime, $lastLoginTime, $loginNumber, $competitionNumber, $lastTrainingTime) or die($stmt->error);
	 if($stmt->fetch()) {
		 $result['id']          = $id;
		 $result['email']       = $email;
		 $result['password']    = $password;
		 $result['gender']      = $gender;
		 $result['firstname']   = $firstname;
		 $result['surname']     = $surname;
		 $result['countryId']   = $countryId;
		 $result['countryCode'] = $countryCode;
		 $result['countryName'] = $countryName;
		 $result['countryImage']= $countryImage;
		 $result['height']      = $height;
		 $result['weight']      = $weight;
		 $result['strength']    = $strength;
		 $result['speed']       = $speed;
		 $result['endurance']   = $endurance;
		 $result['flexibility'] = $flexibility;
		 $result['technique']   = $technique;
		 $result['experience']       = $experience;
		 $result['lastTrainingTime'] = strtotime($lastTrainingTime);
		 $result['registerTime']     = strtotime($registerTime);
		 $result['competitionNumber']= $competitionNumber;
   }
	 else
	   logout();
	 $stmt->close();
	 $dbh->close();

		return $result;
  }

	function logout() {
		$_SESSION["id"]= 0;
		$_SESSION['email']      = "";
		$_SESSION['password']   = "";
		$_SESSION['gender']     = "";
		$_SESSION['firstname']  = "";
		$_SESSION['surname']    = "";
		$_SESSION['countryId']  = "";
		$_SESSION['countryCode']= "";
		$_SESSION['countryName']= "";
		$_SESSION['countryImage']= "";
		$_SESSION['height']     = "";
		$_SESSION['weight']     = "";
		$_SESSION['strength']   = "";
		$_SESSION['speed']      = "";
		$_SESSION['endurance']  = "";
		$_SESSION['flexibility']= "";
		$_SESSION['technique']  = "";
		$_SESSION['experience'] = "";
		$_SESSION['lastTrainingTime']  = "";
		$_SESSION['competitionNumber']  = "";
		setcookie("email", "", time()-1, "/");
	  setcookie("password", "", time()-1, "/");
		setcookie("autoLogin", "", time()-1, "/");
		setcookie("id", "", time()-1, "/");
	  $result= "Successful logout";
	}

	function registerUser($email, $password, $gender, $firstname, $surname, $country, $height, $weight, $strength, $speed, $endurance, $flexibility, $technique) {
	 $dbh= dbConnect();
	 $stmt= $dbh->prepare("SELECT CreateAthlete(?,?,?,?,?,?,?,?,?,?,?,?,?)") or die($dbh->error);
	 $stmt->bind_param("ssissiiiiiiii", $email, $dbh->real_escape_string($password), $gender, $dbh->real_escape_string($firstname), $dbh->real_escape_string($surname), $dbh->real_escape_string($country), $height, $weight, $strength, $speed, $endurance, $flexibility, $technique) or die($stmt->error);
	 $stmt->execute() or die($stmt->error);
	 $stmt->bind_result($result);
	 $stmt->fetch();
   if($result == '') {
		 $result= "Successful registration!<script language='javascript'>window.location.href='index.php';</script>";
	 }
	  $stmt->close();
		$dbh->close();
		return $result;
  }

	function dbConnect() {
		$dbh = new mysqli(
            getenv("MYSQL_ADDR"),
            getenv("MYSQL_USER"),
            getenv("MYSQL_PASSWORD"),
            getenv("MYSQL_DATABASE")
        );
		$dbh->set_charset("utf8");
		if(mysqli_connect_errno()) {
      printf("Connection failed: %s\n", mysqli_connect_error());
      return NULL;
   }
		return $dbh;
	}

	function timeTo($future) {
    // Common time periods as an array of arrays
    $periods = array(array(60 * 60 * 24 * 365 , 'year'), array(60 * 60 * 24 * 30 , 'month'), array(60 * 60 * 24 * 7, 'week'),
							 array(60 * 60 * 24 , 'day'), array(60 * 60 , 'hour'), array(60, 'minute'));

    $today = time();
    $since = $future - $today; // Find the difference of time between now and the future
		if($since <= 0)
			return "";

    // Loop around the periods, starting with the biggest
    for($i = 0, $j = count($periods); $i < $j; $i++) {
        $seconds = $periods[$i][0];
        $name = $periods[$i][1];
        // Find the biggest whole period
        if (($count = floor($since / $seconds)) != 0)
            break;
    }

    $print = ($count == 1) ? '1 '.$name : "$count {$name}s";
    if($i + 1 < $j) {
        // Retrieving the second relevant period
        $seconds2 = $periods[$i + 1][0];
        $name2 = $periods[$i + 1][1];
        // Only show it if it's greater than 0
        if (($count2 = floor(($since - ($seconds * $count)) / $seconds2)) != 0)
            $print .= ($count2 == 1) ? ', 1 '.$name2 : ", $count2 {$name2}s";
    }
    return $print;
}

?>
