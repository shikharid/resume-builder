<?php

foreach ($structure['controls'] as $control) {
				$controls_id[] = preg_replace('/-/', '_', $control['id']);
				//$dbh->query("INSERT INTO $tablename values('".$control['id']."','".$control['value']."','".$dbh->escape($control['html'])."')");
				//$dbh->show_errors();
			}

		$formdata_table_cols = join(' varchar(60) ,', $controls_id)." varchar(60)";

		$query = "CREATE TABLE IF NOT EXISTS $tablename ( user_id varchar(30) not null, $formdata_table_cols )";
		 // control_id varchar(60) not null, value text, html text) ";

		$dbh->query($query);