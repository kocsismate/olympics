<?php
	$skills= array("strength", "speed", "endurance", "flexibility", "technique");

	$dbh= dbConnect();
	$stmt= $dbh->prepare("SELECT id, lastTrainingTime FROM users") or die($dbh->error);
	$stmt->execute() or die($stmt->error);
	$stmt->bind_result($id, $lastTrainingTime) or die($stmt->error);
	$num= 0;
	$now= time();
	while($stmt->fetch()) { 
		$num++;
		if($now - strtotime($lastTrainingTime) > 259200000) {
			srand();
			$skill= $skills[rand(0,4)];
			$stmt= $dbh->prepare("UPDATE users SET ".$skill."= ".$skill." - ".rand(1,3)." WHERE id= ?") or die($dbh->error);
			$stmt->bind_param("i", $id);
			$stmt->execute() or die($stmt->error);
			
		}
	}
	$stmt->close();
	$dbh->close();

?>