<?php

class FormBuilder {

	private $fileName;

	private $fileBaseName; 

	private $fileData;

	private $formStructure = array();

	public function __construct() {

		$file_id = substr(md5(mt_rand()), 0, 10);

		$this->fileBaseName = "form_".$file_id;

		$this->fileName = $this->fileBaseName.".html";
	}


	public function getFileName() {
		return $this->fileName;
	}

	public function getFileBaseName() {
		return $this->fileBaseName;
	}

	public function createFile($data) {

		$this->fileData = $data;
		$file = "./forms/".$this->fileName;

		if(file_put_contents($file, $data)) { 
			return true;
		}
		return false;
	}

	public function decodeJson($json) {

		$form = json_decode($json, true);

		$panels = $form['work_area']['panel'];

		foreach ($panels as $panel) {
			$i = 0;
			foreach ($panel['controls'] as $control) {
				$this->formStructure['controls'][$i]['id'] = $control['id'];
				$this->formStructure['controls'][$i]['value'] = $control['value'];
				$this->formStructure['controls'][$i]['html'] = $control['html'];
				$i++;
			}
			
		}
	}

	public function getFormStructure() {
		return $this->formStructure;
	}


}