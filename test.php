
<?php 

include_once('altconfig.inc.php');
if(file_exists(INCLUDE_DIR.'/dbcon.php'))
	 include_once(INCLUDE_DIR.'/dbcon.php');

	$dbHandle->show_errors();

if($dbHandle->get_results("CREATE TABLE abc (a varchar(2) )")===true) {
	//$dbHandle->debug();
	echo 'table created';
} else {
	'not created';
}
print_r($dbHandle->get_results("SHOW TABLES", ARRAY_N));