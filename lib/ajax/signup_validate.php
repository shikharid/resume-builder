<?php

$data = array("success" => false);

if(file_exists("../../altconfig.inc.php") && file_exists("../ezsql/shared/ez_sql_core.php")) {
	include_once("../../altconfig.inc.php");
	include_once("../ezsql/shared/ez_sql_core.php");
	include_once("../ezsql/mysql/ez_sql_mysql.php");
	include_once("../../DAO/account/users.class.php");

	$dbHandle = new ezSQL_mysql(DB_USER, DB_PASS, DB_DATABASE, DB_HOST);

	if(isset($_GET['what'])) {
		$what = htmlentities(trim($_GET['what']));
		$value = htmlentities(trim($_GET['value']));

		$data['what'] = $what;
		$data['value'] = $value;

		switch ($what) {
			case 'userid':
				  if(User::userIdExists($dbHandle,$value)) {
				  	$data['success'] = true;
				  	echo json_encode($data);
				  	exit();
				  }
				 
				break;
			case 'email' :
				   if(User::userEmailExists($dbHandle,$value)) {
				   	 $data['success'] = true;
				   	 echo json_encode($data);
				  	exit();
				   }
				break;
			default:
				# code...
				break;
		}

		//$dbHandle->debug();
	}
}
else  {
	$data['message'] = 'Unable to load altconfig.inc.php';
}
	
//$dbHandle->close();

echo json_encode($data);				