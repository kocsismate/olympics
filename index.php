<?php
	session_start();
	header('Content-Type: text/html; charset=utf-8');
	include_once("common.php");

	if(isset($_COOKIE['email']) === false)
		$_COOKIE['email']= "";
	if(isset($_COOKIE['password']) === false)
		$_COOKIE['password']= "";
	if(isset($_COOKIE['autoLogin']) === false) {
		$_COOKIE['autoLogin']= "false";
	}
?>

<!doctype HTML>
<html lang="en">
	<head>
		<title>Stickman Olympics 2012 beta</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="StyleSheet" href="style.css" type="text/css" media="screen">
    <script type="text/javascript" src="common.js"></script>
    <script type="text/javascript" src="athlete.js"></script>
    <script type="text/javascript" src="javelinthrow.js"></script>
	</head>
	<body onLoad="initializePage();">
    <?php
			echo "<audio id='audioPlayer' preaload='none' loop='loop'></audio>";
			echo "<header>";
			echo "<div id='headerLogo'><a href='index.php'><img src='images/olympic-rings.png'/><h1>Stickman Olympics 2012</h1><h5>beta</h5></a></div>";
			echo "<div id='headerInfo'>";
			if((isset($_SESSION['id']) == true && $_SESSION['id'] >= 1) || isset($_COOKIE['autoLogin']) == true) {
				if(isset($_COOKIE['autoLogin']) == true && isset($_SESSION['id']) == false)
					loadUser($_COOKIE['email'], $_COOKIE['password'], $_COOKIE['autoLogin']);
				if(isset($_SESSION['id']) && $_SESSION['id'] >= 1) {
					$_SESSION= loadUserById($_SESSION['id']);
					echo "<div id='headerUserFunctions'>";
					echo "<a id='headerUsername' onclick='javascript:showPage(0, -1)'>".$_SESSION['firstname']. " " . $_SESSION['surname']."</a>";
					echo "<a id='headerUserFunctionsTrain' onclick='javascript:showPage(1, -1)'>training</a>";
					echo "<a id='headerUserFunctionsCompete' onclick='javascript:showPage(2, -1)'>competition</a>";
					echo "<a id='headerUserFunctionsTopList' onclick='javascript:showPage(3, -1)'>top list</a>";
					echo "<a id='headerUserFunctionsSettings' onclick='javascript:showPage(4, -1)'>settings</a>";
					echo "<a id='headerAudioControl' onclick='javascript:controlAudio()'><img id='headerAudioControlImage' src='images/volume-full.png' style='width: 15px;'/></a>";
					echo "<a id='headerUserFunctionsLogout' onclick='javascript:logout()'><img src='images/logout.png' style='width: 12px;' title='logout'/></a>";
					echo "</div>";
				}
			}
			if((isset($_SESSION['id']) == false || $_SESSION['id'] < 1) && (isset($_COOKIE['autoLogin']) === false || $_COOKIE['autoLogin'] == "false")) {
				echo "<a id='headerLoginButton' onclick='javascript:showLoginBox()'>login</a>";
				echo "<a id='headerRegisterButton' onclick='javascript:showRegisterBox()'>register</a>";
				echo "<a id='headerAudioControl' onclick='javascript:controlAudio()'><img id='headerAudioControlImage' src='images/volume-full.png' style='height: 12px;'/></a>";
			}
			echo "</div>";
			echo "</header>";

			if(isset($_SESSION['id']) && $_SESSION['id'] >= 1) {
				echo "<section id='profileBox'>";
				echo getProfile($_SESSION['id']);
				echo "</section>";

				echo "<section id='trainingBox'>";
				echo "<table id='trainingTable'>";
				echo "<tr><td style='width: 170px'><i>Choose a training type:</i></td><td></td><td></td></tr>";
				echo "<tr><td><a id='trainingTableExercise0' onclick='javascript:selectExercise(this)' style='font-weight: 600;'>strength training</a></td><td id='trainingSkill0'>".$_SESSION['strength']."</td><td></td></tr>";
				echo "<tr><td><a id='trainingTableExercise1' onclick='javascript:selectExercise(this)'>speed training</a></td><td id='trainingSkill1'>".$_SESSION['speed']."</td><td></td></tr>";
				echo "<tr><td><a id='trainingTableExercise2' onclick='javascript:selectExercise(this)'>endurance training</a></td><td id='trainingSkill2'>".$_SESSION['endurance']."</td><td></td></tr>";
				echo "<tr><td><a id='trainingTableExercise3' onclick='javascript:selectExercise(this)'>flexibility training</a></td><td id='trainingSkill3'>".$_SESSION['flexibility']."</td><td></td></tr>";
				echo "<tr><td><a id='trainingTableExercise4' onclick='javascript:selectExercise(this)'>technique training</a></td><td id='trainingSkill4'>".$_SESSION['technique']."</td><td></td></tr>";
				echo "<tr><td></td><td></td><td></td></tr>";
				echo "<tr><td>last training:</td><td id='trainingTime'>".printTrainingTime()."</td><td></td></tr>";
				echo "<tr><td></td><td id='trainingResult'></td><td><input id='trainButton' type='button' value='go training' onclick='javascript:train()'/></td></tr>";
				echo "</table>";
				echo "</section>";

				echo "<section id='competitionBox'>";
				echo getCompetitionChooser();
				echo "</section>";

				echo "<section id='topListBox'>";
				include("toplist.php");
				echo "</section>";

				echo "<section id='settingsBox'>";
				echo "<table id='settingsTable'>";
				echo "<tr><td width='200'>email:</td><td><input id='settingsTableEmail' type='text' placeholder='your email address' value='".$_SESSION["email"]."'/></td></tr>";
				echo "<tr><td>password:</td><td><input id='settingsTablePassword' type='password' placeholder='your password' value='".$_SESSION["password"]."'/></td><td></td></tr>";
				echo "<tr><td>password again:</td><td><input id='settingsTablePassword2' type='password' value='".$_SESSION["password"]."'/></td><td></td></tr>";
				echo "<tr><td>registration:</td><td><input id='settingsTableRegistrerTime' type='datetime' disabled='disabled' value='".date("m/d/y g:i A", $_SESSION["registerTime"])."'/></td><td></td></tr>";
				echo "<tr><td>competitions:</td><td><input id='settingsTableCompetitionNumber' type='number' disabled='disabled' value='".$_SESSION["competitionNumber"]."'/></td><td></td></tr>";
				echo "</table>";
				echo "</section>";
			}
			else {
				echo "<section id='loginBox'>";
				echo "<div style='float: left;'><form autocomplete='on' method='POST' action='javascript: login();'>";
				echo "<input id='function' type='hidden' value='login'/>";
				echo "<input id='loginEmail' type='text' placeholder='email' autofocus='autofocus' />";
				echo "<input id='loginPassword' type='password' placeholder='password'/>";
				echo "<label for='loginAutoLogin'>auto-login</label> <input id='loginAutoLogin' type='checkbox' value='".($_COOKIE['autoLogin'] == true? "checked" : "none")."'/></div>";
				echo "<div id='loginResult'></div>";
				echo "<input id='loginButton' type='submit' value='Login'/></form>";
				echo "</section>";

				echo "<section id='registerBox'>";
				echo "<table id='registerTable'>";
				echo "<tr><td width='85'>email</td><td><input id='registerEmail' type='text' maxlength='128'/></td><td><div id='registerEmailCheck'></div></td></tr>";
				echo "<tr><td>password</td><td><input id='registerPassword' type='password' maxlength='64'/></td><td><div id='registerPasswordCheck'></div></td></tr>";
				echo "<tr><td>name</td><td><input id='registerFirstname' type='text' placeholder='Firstname' maxlength='64'/></td><td><input id='registerSurname' type='text' placeholder='Surname' maxlength='64'/></td></tr>";
				echo "<tr><td>country</td><td><select id='registerCountry'>";
				$dbh= dbConnect();
				$stmt= $dbh->prepare("SELECT id, name FROM countries ORDER BY name") or die($dbh->error);
				$stmt->execute() or die($stmt->error);
				$stmt->bind_result($id, $name) or die($stmt->error);
				$num= 0;
				while($stmt->fetch()) {
					echo "<option value='".$id."'>".$name."</option>";
					$num++;
				}
				echo "</select></td><td></td></tr>";
				echo "<tr><td>height</td><td><input id='registerHeight' type='number' min='140' max='220' step='1' value='180'/> cm</td><td></td></tr>";
				echo "<tr><td>weight</td><td><input id='registerWeight' type='number' min='40' max='140' step='1' value='80'/> kg</td><td></td></tr>";
				echo "<tr><td>strength</td><td><input id='registerStrength' type='range' min='0' max='100' step='1' value='50' onchange=\"superviseSkills('registerStrength')\"/> <input id='registerStrengthNumber' type='text' readonly='readonly' value='50' style='width: 35px;'/></td><td></td></tr>";
				echo "<tr><td>speed</td><td><input id='registerSpeed' type='range' min='0' max='100' step='1' value='50' onchange=\"superviseSkills('registerSpeed')\"/> <input id='registerSpeedNumber' type='text' readonly='readonly' value='50' style='width: 35px;'/></td><td></td></tr>";
				echo "<tr><td>endurance</td><td><input id='registerEndurance' type='range' min='0' max='100' step='1' value='50' onchange=\"superviseSkills('registerEndurance')\"/> <input id='registerEnduranceNumber' type='text' readonly='readonly' value='50' style='width: 35px;'/></td><td></td></tr>";
				echo "<tr><td>flexibility</td><td><input id='registerFlexibility' type='range' min='0' max='100' step='1' value='50' onchange=\"superviseSkills('registerFlexibility')\"/> <input id='registerFlexibilityNumber' type='text' readonly='readonly' value='50' style='width: 35px;'/></td><td></td></tr>";
				echo "<tr><td>technique</td><td><input id='registerTechnique' type='range' min='0' max='100' step='1' value='50' onchange=\"superviseSkills('registerTechnique')\"/> <input id='registerTechniqueNumber' type='text' readonly='readonly' value='50' style='width: 35px;'/></td><td></td></tr>";
				echo "</table>";
				echo "<div id='registerResult'></div><input id='registerButton' type='button' value='register' onclick='javascript:register()'/>";
				echo "</section>";
			}
			echo "<canvas id='gameCanvas'></canvas>";
			echo "<video id='videoPlayer' allow='autoplay'>";
			echo "<source src='video/intro.webm' type='video/webm'>";
    	echo "<source src='video/intro.mp4' type='video/mp4'>";
			echo "</video>";
			echo "<div id='skipIntro'><a onclick='buildPage()'>skip intro</a></div>";
			echo "<footer style='height: 30px; margin-top: 15px;'><img src='images/logo.png' style='width:200px; clear: none; margin-top: 3px;' /><span style='padding-bottom: 7px; display: none; clear: none;'>&copy; All rights reserved.</span></footer>";
			//<span style='background: white; padding: 5px; color: red; font-size: 15px; font-weight: 600;'>DO NOT PLAY THE OLD BETA! NEW BETA IS COMING!</span>
		?>
		<div id='log'></div>
	</body>
	</html>
