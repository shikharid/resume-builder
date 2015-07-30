	<?php 

	include_once("../../altconfig.inc.php");
	include_once("../ezsql/shared/ez_sql_core.php");
	include_once("../ezsql/mysql/ez_sql_mysql.php");
	include_once("../../DAO/account/users.class.php");

	$dbHandle = new ezSQL_mysql(DB_USER, DB_PASS, DB_DATABASE, DB_HOST);


	$dbHandle->query("DELETE FROM user_654879");

	
	?>