
<?php 

include_once('altconfig.inc.php');
if(file_exists(INCLUDE_DIR.'/dbcon.php'))
	 include_once(INCLUDE_DIR.'/dbcon.php');


//$dbh->query("Drop table form_833f1f1aca, form_b84ebf3d1c, form_c8bca13439, form_c8bca13439_data,form_fdaed82598 ");

print_r($dbHandle->get_results("SHOW TABLES", ARRAY_N));
//print_r($dbHandle->get_results("SELECT * FROM form_c8bca13439_data"));