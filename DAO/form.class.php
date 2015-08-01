<?php 

class Form {

	//static $dbh = null;

	private $data = array();

	public function __construct($dbh=null) {
	}

	public function createFormTable($dbh, $tablename, $structure) {

		$query = "CREATE TABLE IF NOT EXISTS $tablename ( control_id varchar(60) not null, value text, html text) ";

		$dbh->query($query);

			//mysqli_query("CREATE TABLE IF NOT EXISTS $tablename"."_data ")
			foreach ($structure['controls'] as $control) {
				$controls_id[] = preg_replace('/-/', '_', $control['id']);
				$dbh->query("INSERT INTO $tablename values('".$control['id']."','".$control['value']."','".$dbh->escape($control['html'])."')");
				$dbh->show_errors();
			}

			// now creating table for form data filled by user
			$formdata_table_cols = join(' varchar(60) ,', $controls_id)." varchar(60)";
			$formdata_tablename  = $tablename."_data";
			$dbh->query("CREATE TABLE IF NOT EXISTS $formdata_tablename ( user_id int not null primary key auto_increment, $formdata_table_cols )");
				return array(
					'success' => true,
					'message' => "$formdata_tablename created successfully"
					);
			// //return array('cols' => $formdata_table_cols);

			// return array(
			// 	'success' => true,
			// 	'message' => "$tablename table created successfully"
			// 	);
		// } else {

		// 		return array(
		// 			'success' => false,
		// 			'message' => "Error Creating $tablename table"
		// 		);
		// 	}
	}

	public function addFormEntry($dbh, $form_id, $values) {

		$formtable = $form_id."_data";

		$query = "INSERT INTO $formtable VALUES('default,'".join("','",$dbh->escape($values))."')";

		$dbh->query($query);
		//if($dbh->rows_affected > 0) {
			return $this->getFormData($dbh, $form_id);
		// } else {
		// 	return array(
		// 	'success' => false,
		// 	'message' => 'Error Adding Entry'
		// 	);

	}

	public function getFormData($dbh, $form_id) {
		$formtable = $form_id."_data";
		$query = "SELECT * FROM $formtable";

		$result = $dbh->get_results($query, ARRAY_A);

		return $result;
	}
}
