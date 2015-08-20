jQuery(document).ready(function($) {
	var fileName;
	var $editArea = $(':root');
	
	$('.form-name').click(function(e){
		fileName = $(this).text();
	});
	
	$('.modal').on('shown.bs.modal', function() {
        $(this).find('iframe').attr('src',fileName);
    });

    function createJson(htmlPage) {

			var $controls = $(htmlPage).find('li[data-elem="table"],li[data-elem="list"]');

			var obj = [];

			for (var i = 0; i< $controls.length; i++) {
				var $control = $('#'+$controls[i].getAttribute('id'));
				var type = $control.attr('data-elem');
				var id = $control.attr('id');
				$control.find('.control-action').remove();
				var value = $control.html();
				//console.log(id);
				
					var $controlDef = {
						'id' : id,
						'value' : $control.html()
					};
					obj.push($controlDef);
			};
			$controls = $(htmlPage).find('li[data-elem="heading"],li[data-elem="paragraph"]');
			for(var i = 0;i < $controls.length; ++i){
				var $control = $('#' + $controls[i].id);
				var type = $control.attr('data-elem');
				var id = $control.attr('id');
				$control.find('.control-action').remove();
				var value;
				if(type == "paragraph"){
					value = $control.text();
				}
				else if(type == "heading"){
					var size = $control.attr('data-size');
					size = 'h' + size;
					value = $control.text(); 
				}
				var $controlDef = {
						'id' : id,
						'value' : value
				};
				obj.push($controlDef);
			}
			$controls = $(htmlPage.find('li[data-elem="image"]'));
			for(var i = 0;i < $controls.length; ++i){
				var $control = $('#' + $controls[i].id);
				var type = $control.attr('data-elem');
				var id = $control.attr('id');
				$control.find('.control-action').remove();
				var value = $control.find('img').attr('src');
				var $controlDef = {
						'id' : id,
						'value' : value
				};
				obj.push($controlDef);
			}
			return obj;
		}

	$('#save').click(function(e){
	  	var $htmlString = $( ":root" ).clone();
	  	var fileName = $htmlString.find('#fileName').attr('value');
	  	$htmlString.find("#fileName").remove();
	  	$htmlString.find('#save').remove();
	  	$htmlString.find('.control-action',function(e){
	  		$(this).promise().remove();
	  	});
	  	var JsonObject = createJson($htmlString);
	  	var JsonArray = JSON.stringify(JsonObject);
	  	$.post( "formsubmit.php", { filename:fileName,field_values: JsonArray },function(data){ 
	  			//document.write(data);
	  		});
		// send to formsubmit.php
	});

    $editArea.on('click','.control-action > li',function(e){
    		var editId = $(this).attr('data-target');
    		var editAction = $(this).attr('data-action');
    		if(editAction == 'add')
    			addField($(editId));
    		else if(editAction == 'edit')
    			editField($(editId)); 
    		else if(editAction == 'load')
    			editLoad($(editId));

	});
	function editLoad(item){
		var $item = item;
		var target = '#' + $item.attr('id');
		var value = $item.find('img').attr('src');
		var oldHtml = $item.html();
		var a = "<div class='load-control'><b>Value&nbsp;</b>&nbsp;<input type='file' value='"+value+"' data-oldhtml = '"+oldHtml+"' data-oldvalue='"+value+"' class='form-control load-control-field' /></div>";
		$item.html(a);
		$item.find('input:file').select().focus();
	}
	

	function addField(item){
		var $item = item;
		var type = $item.attr('data-elem');
		if(type == "table"){
			addRow($item);
			return;
		}
		var value = '';
		var target = '#'+$item.attr('id');
		var value = $item.html();
		var a = "<div class='add-control'><b>Value&nbsp;</b>&nbsp;<input type='text' placeholder = 'Enter Default Value ' data-oldvalue = '"+value+"' class='form-control add-control-field'>&nbsp;<button type='button' data-action='edit-ok' data-target='"+target+"' class='btn btn-sm btn-success'>Ok</button><button type='button' data-action='add-cancel'  data-target='"+target+"' class='btn btn-sm btn-default'>Cancel</button></div></div>";
		$item.html(a);
		$item.find('input:text').select().focus();
	}

	function addRow(item){
		var $item = item.find('table');
		var row = '<tr>';
		var count = 1;
		var col = parseInt($item.attr('data-col'),10);
		while(count <= col){
			var value = prompt("Enter Value For Column " + count);
			while(value == null)
				 value = prompt("Enter Value For Column " + count);
			row += '<td>' + value + '</td>';
			++count;
		}
		row += '</tr>';
		$item.append(row);

	}

	$editArea.on('change','.load-control-field',function(event){
			var $loadField = this;
			var address;
			var $loadFile = $($loadField).parent();
			if ($loadField.files && $loadField.files[0]) {
	            var reader = new FileReader();

	            reader.onload = function (e) {
	             	address = e.target.result;   
	             	$loadFile.html($($loadField).attr('data-oldhtml'));
	        		$loadFile.find('img').attr('src',address);
	            }

	            reader.readAsDataURL($loadField.files[0]);
	        }
	        
	});

	$editArea.on('click','.add-control button',function(event){
		var action = $(this).attr('data-action');
		var targetId = $(this).attr('data-target');
		var $target = $(targetId);
		var $addElement = $target.find('.add-control');
		var $addField = $addElement.find('>.add-control-field');
		var type = $target.attr('data-elem');
		var newval = $addField.val();
		var oldval = $addField.attr('data-oldvalue');
		$target.html(oldval);
		//alert(action + ' ' + targetId + ' ' + type + ' ' + newval + ' ' + oldval);
		//alert($target.attr('id') + ' ' + newval);
		switch(action){
			case 'add-ok' : if(newval == ""){
								alert("Cannot be Blank.");
								newval = oldval;
							}
							break;
			default : break;
		}
		switch(type){
			case 'table' : 
				$target = $target.find('table');
				$target.append('<tr><td>'+newval+'<td></tr>');
				break;
			case 'list' : 
				$editTarget = $target.find('ul[data-mode = "edit"]');
				if($editTarget.attr('data-mode') == undefined){
					$editTarget = $target.find('ol[data-mode = "edit"]');
				}
				$target = $editTarget;
				$target.append('<li>'+newval+'</li>');
				break;
			default : break;
		}
		$addElement.remove();
	});

	$editArea.on('click','.edit-control button',function(event) {
		var action  = $(this).attr('data-action');
		var targetId = $(this).attr('data-target');
		var $target = $(targetId);
		var $editControl = $target.find('.edit-control');
		var $editField = $editControl.find('>.edit-control-field');
		var type = $target.attr('data-elem');
		var newval = $editField.val();
		var oldval = $editField.attr('data-oldvalue');
		
		switch(action) {
			case 'edit-ok' : if(newval=="") {
				alert('Cannot be Blank.');
				newval = oldval;
			}
				break;
			case 'edit-cancel' : newval = oldval;
				break;
			default: 
				break;
		}
		switch(type) {
				case 'heading' : 
					var size = $target.attr('data-size');
					$target.html('<h'+size+'>'+newval+'</h'+size+'><ul class="control-action"><li data-action="edit" data-target="'+targetId+'"><span class="fa fa-pencil"></li></ul>');
					break;
				case 'paragraph': 
					$target.html('<p>'+newval+'</p><ul class="control-action"><li data-action="edit" data-target="'+targetId+'"><span class="fa fa-pencil"></li></ul>');
					break;
				default : 
					break;

		}
	}); 


	function editField(item){
		var $item = item;
		var type = $item.attr('data-elem');
		var value = '';
		var target = '#'+$item.attr('id');
		switch(type) {
			case 'heading' : value = $item.text();
			break;
			case 'paragraph' : value = $item.text();
			break;
		}
		var a = '<div class="edit-control"><b>Value&nbsp;</b>&nbsp;<input type="text" value="'+value+'" data-oldvalue="'+value+'" class="form-control edit-control-field">&nbsp;<button type="button" data-action="edit-ok" data-target="'+target+'" class="btn btn-sm btn-success">Ok</button><button type="button" data-action="edit-cancel"  data-target="'+target+'" class="btn btn-sm btn-default">Cancel</button></div></div>';
		$item.html(a);
		$item.find('input:text').select().focus(); //focus(function() { $item.find('input:text').select(); });
	}
	
	
	function replaceAll(string, find, replace) {
	  return string.replace(new RegExp(find, 'g'), replace);
	}

    $('.edit-select').click(function(e){
		var $loadHTML = $('<html>');
		$loadHTML.load( fileName, function() {

			if(navigator.userAgent.indexOf("Chrome") != -1)
				$loadHTML.find('script[src="../assets/external/jquery/jquery.js"]').remove();
			$loadHTML.append('<link rel="stylesheet" type="text/css" href="./assets/css/edit-style.css">');
			$loadHTML.append('<link rel="stylesheet" type="text/css" href="./assets/css/font-awesome.min.css">');
			$loadHTML.append('<script type="text/javascript" src="./assets/js/editform.js"></script>');
			var $appender = $loadHTML.find('li[data-elem="heading"],li[data-elem="paragraph"]');
			for(var i = 0;i < $appender.length; ++i){
				var headingId = $appender[i].id;
				$loadHTML.find("#"+headingId).append('<ul class="control-action"><li data-action="edit" data-target="#'+headingId+'"><span class="fa fa-pencil"></li></ul>');
			}
			$appender = $loadHTML.find('li[data-elem="list"],li[data-elem="table"]');
			for(var i = 0;i < $appender.length; ++i){
				var listId = $appender[i].id;
				$loadHTML.find('#'+listId).append('<ul class="control-action"><li data-action="add" data-target="#'+listId+'"><span class="fa fa-plus-square-o"></li></ul>');
			}
			$appender = $loadHTML.find('li[data-elem="image"]');
			for(var i = 0;i < $appender.length; ++i){
				var imageId = $appender[i].id;
				$loadHTML.find('#'+imageId).append('<ul class="control-action"><li data-action="load" data-target="#'+imageId+'"><span class="fa fa-file-picture-o"></li></ul');
			}
			fileHTML = $loadHTML.html();
			fileHTML = replaceAll(fileHTML,'href="../','href="');
			fileHTML = replaceAll(fileHTML,'src="../','src="');
			fileName = fileName.substr(fileName.lastIndexOf("/") + 1,(fileName.lastIndexOf(".") - fileName.lastIndexOf("/") - 1));
			fileHTML = '<div id="save" class="btn btn-success pull-right"><span class="fa fa-floppy-o"></span>&nbsp;Save</button><input type = "hidden" height = "0px" width = "0px" name = "filename" id = "fileName" value = "'+fileName+'"></div>' + fileHTML;
			document.write(fileHTML);
			/*var fileAdd;
			fileHTML = '<div id="save" class="btn btn-success pull-right"><span class="fa fa-floppy-o"></span>&nbsp;Save</button></div>' + fileHTML;
	  		$.post( "edit.php", { name:fileName,content: fileHTML },function(data){ 
	  			fileAdd = data;
		  		window.location = fileAdd;
		  		var href = document.location.href;
				var last = href.substr(href.lastIndexOf('/') + 1);
				alert(last);
	  		});*/
		});
    });  
});