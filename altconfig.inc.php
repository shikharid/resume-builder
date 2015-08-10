<?php 

##-------------- PATHS ------------------------------##
	define("SITE_NAME","#Dummy.com");
	define("SITE_HOST","localhost");
	//define("SITE_HOST","http://intern2015.altwareindia.com");
	define("SITE_PORT","80");
	define("SITE_ROOT", '');
	define("BASE_URL","http://localhost/resume-builder");
	// define("BASE_URL",SITE_HOST."/ashif/formbuilder");

##-------------- ASSETS ------------------------------##
	
	define("ASSETS_DIR",BASE_URL."/assets");
	define("ASSETS_CSS", ASSETS_DIR."/css");
	define("ASSETS_JS", ASSETS_DIR."/js");
	define("ASSETS_IMG", ASSETS_DIR."/images");
	define("FORM_DIR",BASE_URL."/forms");
	define("VIEWS_DIR", SITE_ROOT."views");

##---------------OTHER PATHS--------------------------##
	define("DAO_DIR", SITE_ROOT."DAO");
	define("IMPORT_DIR", SITE_ROOT."import");
	define("CLASSES_DIR", IMPORT_DIR."/classes");

// PATH to inculde
	define("INCLUDE_DIR", SITE_ROOT."include");


	define("LIB_DIR", SITE_ROOT."lib");


##-------------- DATABASE CREDENTIALS ---------------##

	// define("DB_DATABASE", "altwarei_builder");
	// define("DB_USER","altwarei_resume");
	// define("DB_PASS", "Altware@2015");
	// define("DB_HOST", "altwareindia.com");


	define("DB_USER", "root");
	define("DB_HOST", "localhost");
	define("DB_PASS", "tiger");
	define("DB_DATABASE", "altware");
?>