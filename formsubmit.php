<?php 

session_start();

include_once('altconfig.inc.php');
include_once(INCLUDE_DIR.'/dbcon.php');
include_once(IMPORT_DIR.'/formbuilder.class.php');
include_once(DAO_DIR.'/form.class.php');



$form_id =  $_POST['filename'];

$field_values = $_POST['field_values'];

//$form = new Form();

//$data = $form->addFormEntry($dbHandle, $form_id, $field_values);

echo $field_values;