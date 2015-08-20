<?php
	$value = $_POST["content"];
	$name = $_POST["name"];
	$name = "edit/".substr($name,strrpos($name,'/') + 1);
	file_put_contents($name, $value);
	header( "url=edit/test.html".$name);
	echo $name;
?>
