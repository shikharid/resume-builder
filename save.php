<?php
session_start();

include_once('altconfig.inc.php');
include_once(INCLUDE_DIR.'/dbcon.php');
include_once(IMPORT_DIR.'/formbuilder.class.php');
include_once(DAO_DIR.'/form.class.php');



if(isset($_POST["content"])) {

	$builder = new FormBuilder();

	$builder->createFile($_POST['content']);

	//$data['data'] = json_decode($_POST['jsonObject'], true);
	$builder->decodeJson($_POST['jsonObject']);

	$data['data'] = $builder->getformStructure();

	$form = new Form();

	$data[] = $form->createFormTable($dbHandle, $builder->getFileBaseName(), $builder->getformStructure());

	$data['file'] = BASE_URL.'/forms/'.$builder->getFileName();

	echo json_encode($data);

} else {

	echo "Error!";
}
		
 ?>