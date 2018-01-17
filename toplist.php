<?php
include_once("common.php");

$dbh= dbConnect();
$stmt= $dbh->prepare("SELECT id, name FROM disciplines ORDER BY id") or die($dbh->error);
$stmt->execute() or die($stmt->error);
$stmt->bind_result($id, $name) or die($stmt->error);
$num= 0;
while($stmt->fetch()) {
	$num++;
	echo "<h3>".$name."</h3><br/>";
	echo getTopList($id, strtotime("2000-01-01 00:00:00"), strtotime("2222-08-01 00:00:00"), 100);
	echo "<hr />";
}

echo "<i style='margin: 5px 0px 0px 20px;'>Results are refreshed automatically after 5 minutes.</i><br/>";

?>