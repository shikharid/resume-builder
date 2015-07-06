<?php
	if(isset($_POST["content"])){
	$val = $_POST["content"];
	//str_replace('\"','"', $val);
	$file = fopen("resumebuild.html","w");
	fwrite($file, $val);
	fclose($file);
	echo str_replace("\\", " ", file_get_contents("resumebuild.html"));
	}
	else
		echo "Error!";
 ?>