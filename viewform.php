<?php
	include_once('altconfig.inc.php');
	include_once(INCLUDE_DIR.'/dbcon.php');
?>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css">
 <link rel="stylesheet" type="text/css" href="assets/css/font-awesome.min.css">
  <link rel="stylesheet" type="text/css" href="assets/css/edit-style.css">
  <link rel="stylesheet" type="text/css" href="assets/css/style.css">
  <link rel="stylesheet" type = "text/css" href="assets/css/jquery-ui.css">


<script src="assets/external/jquery/jquery.js"></script>
<script src="assets/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="assets/js/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript" src="assets/js/editform.js"></script>
<script type="text/javascript" src="assets/js/bootstrap.min.js"></script>
</head>
<body>
	<div class = "container">
	<div class = "list-group">
		<?php 
		   $getList = scandir("forms",1);
		   foreach(glob('./forms/*.*') as $formName){
			     echo '<a href = "#" class = "list-group-item form-name" data-toggle = "modal" data-target = "#viewModal"><span>'.$formName."</span></a>";
			 }
		?>
	</div>
	<div id="viewModal" class="modal fade" role="dialog">
	  <div class="modal-dialog">

	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal">&times;</button>
	        <h4 class="modal-title">Form View</h4>
	      </div>
	      <div class="modal-body">
	        <iframe src = "#"> </iframe>
	        <b
	      </div>
	      <div class="modal-footer">
	      	<button type="button" class="btn btn-active edit-select">Edit Form </button>
	        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	      </div>
	    </div>

	  </div>
	  <div id="editModal" class="modal fade" role="dialog">
	  <div class="modal-dialog">

	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal">&times;</button>
	        <h4 class="modal-title">Edit View</h4>
	      </div>
	      <div class="modal-body">
	        <iframe id = "edit-frame" src = "#"> </iframe>
	      </div>
	      <div class="modal-footer">
	      	<button type="button" class="btn btn-active edit-select">Save </button>
	        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	      </div>
	    </div>

	  </div>
</div>
</div>
</body>
</html>
