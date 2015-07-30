<?php 

include_once LIB_DIR."/ezsql/shared/ez_sql_core.php";
include_once LIB_DIR."/ezsql/mysql/ez_sql_mysql.php";

/*
|--------------------------------------------------------
|   DEFAULT MYSQL CONNECTON
|--------------------------------------------------------
|	DB_USER : USERNAME FOR database
|	DB_PASS : PASSWORD FOR database
| 	DB_DATABASE : DEFAULT database
|	DB_HOST : DEFAULT HOST
|
|--------------------------------------------------------
*/

$dbHandle = new ezSQL_mysql(DB_USER, DB_PASS, DB_DATABASE, DB_HOST);

//$dbHandle = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
