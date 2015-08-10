<?php 

class Form {

	//static $dbh = null;

	private $data = array();

	public function __construct($dbh=null) {

		$init_query = "CREATE TABLE IF NOT EXISTS form_file (table_name varchar(60), file_name varchar(60))";
		$dbh->query($init_query);
	}

	public function createFormTable($dbh, $tablename, $structure) {

		$filename = $tablename.".html";
		foreach ($structure['controls'] as $control) {
				$controls_id[] = preg_replace('/-/', '_', $control['id']);
			}

		$formdata_table_cols = join(' varchar(60) ,', $controls_id)." varchar(60)";

		$query = "CREATE TABLE IF NOT EXISTS $tablename ( user_id varchar(30) not null, $formdata_table_cols )";

		if($dbh->query($query)==false) {
			$dbh->query("INSERT INTO form_file values('$tablename', '$filename')");
			if($dbh->rows_affected > 0 ) {
				return true;
			}
		}

		return false;
	}

	public function addFormEntry($dbh, $form_id, $values) {

		$formtable = $form_id;

		$query = "INSERT INTO $formtable VALUES('abc','".join("','",$dbh->escape($values))."')";

		$dbh->query($query);

		if($dbh->rows_affected > 0 ){
			// return $this->getFormData($dbh, $form_id);
			return true;
		}
		return false;
	}

	public function getFormData($dbh, $form_id) {
		$formtable = $form_id."_data";
		$query = "SELECT * FROM $formtable";

		$result = $dbh->get_results($query, ARRAY_A);

		return $result;
	}
}
