
jQuery(document).ready(function($) {
	$(".placeholder").draggable('destroy');
	var oldval;

	var arPanels  = {
		'panelCount' : 0,
		'subPanel' : [],
		'panel' : [], 			// Array holding ID's of the panels added to work area
		'heading' : [], 		// Array holding ID's of headings added inside the panel
		'paragraph' : [], 		// Array holding ID's of paragraphs added inside panel
		'hr' : [],
		'image': [],
		'table': [],
		'list': [],
		'activePanel' : null, 	// Variable holding the ID of currently selected panel
		'jsonObject' : {
			'work_area' : {
				'panel' : [],
			},
		},
		'Panels'  : [{			// Array holding 
			'subPanel' : [],
			'panel' : [], 			// Array holding ID's of the panels added to work area
			'hr' : [],
			'image' : [],
			'table' : [],
			'list' : [],
			'heading' : [], 		// Array holding ID's of headings added inside the panel
			'paragraph' : [], 		// Array holding ID's of paragraphs added inside panel
		}],
	

		/*
			function addControl
				- Add the Id of the (panel, heading, paragraph, textField, submitButton, etc) to their corresponding array
			@params (control)
				- control : tells the type of control for which to return Id
			return values
				- Returns the Id of control generated according to the values in the corresponding control array
		*/
		addControl : function(parentId,controlType) {
			var controlId,localId;
			if(this[controlType].length == 0){
				controlId = 1;
			} else {
				controlId = Math.max.apply(Math,this[controlType])+1;
			}
			this[controlType].push(controlId);
			if(controlType == 'panel'){
				return controlId;
			}
			else{
				if(this['Panels'] == undefined){
					this['Panels'][1] = new Object(); 
				}
				if(this['Panels'][parentId] == undefined){
					this['Panels'][parentId] = new Object();
				}
				if(this['Panels'][parentId][controlType] == undefined){
					this['Panels'][parentId][controlType] = new Array();
					localId = 1;
				}
				else 
					localId = Math.max.apply(Math, this['Panels'][parentId][controlType]) + 1;
				this['Panels'][parentId][controlType].push(localId);
			}
			return localId;
		},

		/*
			function removecontrol
				- Removes the Id of control from the corresponding array
			@params (control, controlId)
				- control : tells the type of control to remove
				- controlId : tells the Id of control
		*/
		removeControl : function(control, controlId) {

			// Fetching the control id
			var a = controlId.split('-');
			var id = a[a.length-1];

			// Finding the index in array of corresponding control having value fetched above.
			var i = this[control].indexOf(parseInt(id));

			// if the value of id exits then remove the value from the array
			if(i> -1) {
				this[control].splice(i, 1);
			}
		},

		/*
			function removePanel:
				- for removing Panel and panel is removed only when it has no controls in it.
			@params (panelId) : Id of the panel to remove
		*/
		removePanel : function(panelId) {

			// finding the index in array of panel having value of the id of panel to remove
			var i = this.panel.indexOf(parseInt(panelId));

			// If panel exists then remove the value from array of panel.
			if(i> -1) {
				this.panel.splice(i,1);
			}
		},

		/*
			function activePanel 
				- This function marks a panel as current active panel
			@params (panelId) : Id of the panel to mark it active
		*/
		activatePanel : function(panelId) {
			this.activePanel = panelId;
		},

		/*
			function getActivePanel 
				- Gets the Id of current active Panel
		*/
		getActivePanel : function() {
			return this.activePanel;
		},
 
		/*
			function renderRightBar
				- Render the Right panels and control panel to update the changes of the added, deleted panels and controls
		*/
		renderRightBar : function() {

			var	$panels = $('#panels > ul');
			$panels.html('');
			var $controlsContainer = $('#panel-controls > ul');
			$controlsContainer.html('');

			var activePanel = this.activePanel;
			this.panel.forEach(function(e, i){
				if(e!= null) {
					var $a = $('#'+e).sortable("widget");
					var panelId = $a[0].id;
					var $obj = $('#'+$a[0].id);
					var $controls  = $obj.children('li');
					$c = $('<ul id="panel-control-'+panelId+'" class="items box-controls"><li class="panel-title"><span>#panel-'+panelId+'</span></li></ul>');
					if($controls.length ==1 && $controls[0].getAttribute('data-elem')=="No Controls") {
						$d = $c.append('<li>No Controls</li>');
					} else {
						for (var j = 0; j< $controls.length; j++) {
						$d = $c.append('<li>#'+$controls[j].getAttribute('id')+'</li>');
						};
					}
					$d.appendTo($controlsContainer);

					if($c.attr('id') == "panel-control-"+activePanel) {
						$c.show();
					}

					$panels.append('<li panel-id="'+panelId+'">#panel-'+e+'</li>');
					$panels.children('li').removeClass('active');
					$panels.children('li[panel-id="'+activePanel+'"]').addClass('active');	
					}
			});
		},

		createJsonObject : function(index ,parentId, context) {
			var obj = [];

			var $workarea = $(parentId).find('ol[data-elem="panel"]');
			for (var i =0; i< $workarea.length; i++) {
				var $panel = $('#'+$workarea[i].getAttribute('id'));
				var type = $panel.attr('data-elem');
				var id = $panel.attr('id');
				var width = $panel.width() / $panel.parent('ol').width() * 100;
				var inline = ((/inline/).test($panel.css('display')))?true:false;
				var emptyCheck = '#placeholder'+id;
				// if($panel.find(emptyCheck).length == 0){
				// 	continue;
				// }
				var $panelDef = {
					'type' : type,
					'width' : width,
					//'inline' : inline,
					'id' : id,
					'parentId' : $panel.parent('ol').attr('id'),
					'controls' : [],
				};
				//console.log($panelDef);
				this.prepareControlJson('#'+id,$panelDef.controls)
				context.panel.push($panelDef);
			}
		},

		prepareControlJson : function(parentId, context) {

			var $controls = $(parentId).find('> li');

			var obj = [];

			for (var i = 0; i< $controls.length; i++) {
				var $control = $('#'+$controls[i].getAttribute('id'));
				var type = $control.attr('data-elem');
				var id = $control.attr('id');

				//console.log(id);
				
					var $controlDef = {
						'type' : type,
						'id' : id,
						'html' : $control.html(),
						'value' : $control.text(),
					};
					context.push($controlDef);
			};
		},

		parseJsonObject : function(obj) {
			obj.forEach(function(e,i){
				console.log(e);
			});
		}

	};


	var $tool_box_controls = $('#tool-box-controls'),

		$work_area = $('#work-area'),

		$dynamic_controls =  $('#dynamic-controls'),

		$trash = $('#trash'),

		$panels = $('#panels');


	$('ul > li > a').on('click', function(event) {
		event.preventDefault();
	});

	$work_area.on('click','.control-action > li', function(event) {
		var action = $(this).attr('data-action');
		var targetId = $(this).attr('data-target');
		switch(action) {
			case 'delete' : removeControl($(targetId));
				break;
			case 'edit' : editControl($(targetId));
				break;
			case 'add' : addElement($(targetId));
				break;
			case 'load' : loadImage($(targetId));
				break;
			default:
			    break;
		}
		//$(targetId).remove();
	});


	// Event for Removing Panels/Controls
	$work_area.on('click', '.trash', function(event) {
		var $item = $(this).closest('li');
		removeControl($item);
	});
	function loadImage(item){
		var $item = item;
		var target = '#' + $item.attr('id');
		var value = $item.find('img').attr('src');
		var oldHtml = $item.html();
		var a = "<div class='load-control'><b>Value&nbsp;</b>&nbsp;<input type='file' value='"+value+"' data-oldhtml = '"+oldHtml+"' data-oldvalue='"+value+"' class='form-control load-control-field' /></div>";
		$item.html(a);
		$item.find('input:file').select().focus();
	}
	function editControl(item){
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
	function addElement(item){
		var $item = item;
		var type = $item.attr('data-elem');
		var value = '';
		var target = '#'+$item.attr('id');
		var value = $item.html();
		var a = "<div class='add-control'><b>Value&nbsp;</b>&nbsp;<input type='text' placeholder = 'Enter Default Value ' data-oldvalue = '"+value+"' class='form-control add-control-field'>&nbsp;<button type='button' data-action='edit-ok' data-target='"+target+"' class='btn btn-sm btn-success'>Ok</button><button type='button' data-action='add-cancel'  data-target='"+target+"' class='btn btn-sm btn-default'>Cancel</button></div></div>";
		$item.html(a);
		$item.find('input:text').select().focus();
	}
	$work_area.on('change','.load-control-field',function(event){
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
	$work_area.on('click','.add-control button',function(event){
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
				$target = $target.find('tr');
				$target.append('<th>'+newval+'</th>');
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
	$work_area.on('click','.edit-control button',function(event) {
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
					$target.html('<h3>'+newval+'</h3><ul class="control-action"><li data-action="edit" data-target="'+targetId+'"><span class="fa fa-pencil"></li><li data-action="delete" data-target="'+targetId+'"><span class="fa fa-times-circle-o"></li></ul>');
					break;
				case 'paragraph': 
					$target.html('<p>'+newval+'</p><ul class="control-action"><li data-action="edit" data-target="'+targetId+'"><span class="fa fa-pencil"></li><li data-action="delete" data-target="'+targetId+'"><span class="fa fa-times-circle-o"></li></ul></span>');
					break;
				default : 
					break;

		}
	}); 

	function removeControl(item){
		//var $item = $(this).closest('li');
		var $item = item;
		var $parent = $item.parent('.dynamic-panel');
		if($parent.children().length == 1 || ($parent.hasClass('sub-panel') == true && $parent.children().length <= 2)) { // IF the control was the last inside the panel den drop the panel also
			if($item.hasClass('placeholder') || $item.hasClass('sub-panel')) {

				var $decision = confirm("It will drop all controls. Do you want to continue ?");
				if($decision) {
					arPanels.removePanel($parent.attr('id'));
					$parent.remove();
				} else {
					;
				}
			} else {
				// Asking from user whether to drop the panel control.
				var $decision = confirm('It is last control. It will drop the panel also. Would you like to drop it ?');
				if($decision) { // if User select ok then drop the panel
					// First Removing the Control inside the panel
					arPanels.removeControl($item.attr('data-elem'),$item.attr('id'));
					// Then Removing the panel
					arPanels.removePanel($parent.attr('id'));
					$parent.remove();
				} else {
					;
				}

				
			}
			
		} else {

			arPanels.removeControl($item.attr('data-elem'), $item.attr('id'));

			$item.remove();
		}

		arPanels.renderRightBar();
}	
	// Items present in tool box is draggable
	$("li", $tool_box_controls).draggable({
		revert : "invalid",
		 helper :"clone",
		 opacity : "0.7",
		 zIndex : "4", //function() {
		 //	return '<div class="helper-control">'+$(this).text()+'</div>';
		// },
		 cursor : "move"

	});

	// Dynamic Control is Draggable
	$("li",$dynamic_controls).draggable({
		cursor : "move"
	});

	// Right Panel clicked to show controls present in panel
	$panels.on('click', 'ul> li', function(event) {
		var panelId = $(this).attr('panel-id');
		arPanels.activatePanel(panelId);
		$('#panel-controls> ul > ul').hide();
		//$('#panel-controls > ul > ul').find('li:first-child[class="panel-title"]').remove();
		$('#panel-control-'+panelId).show();
		arPanels.renderRightBar();
	});

	$dynamic_controls.on('click', '.dynamic-panel', function(event) {
		var panelId = $(this).attr('id');
		arPanels.activatePanel(panelId);
		$('#panel-controls > ul > ul').hide();
		$('#panel-controls-'+panelId).show();
		arPanels.renderRightBar();
		/* Act on the event */
	});
	

	// Dynamic control is droppable
	$dynamic_controls.droppable({
		accept : '#tool-box-controls> li[data-elem="panel"]',
		drop : function(event, ui) {
			addControl(ui.draggable,$(this));
		}
	}).sortable({
		containment : "document",
		revert : "invalid",
		cursor : "move",
		stop : function(e,ui) {
			arPanels.renderRightBar();
		}
	});

	function addControl($control, $context) {

		$type = $control.attr('data-elem');
		switch($type) {
			case "heading" : addHeading($control, $context,$control.attr('data-size'));
				break;
			case "paragraph" : addParagraph($control, $context);
				break;
			case "panel" : addPanel($control, $context);
				break;
			case "image" : addImage($control, $context);
				break;
			case "hr" : addHr($control, $context);
				break;
			case "table" : addTable($control, $context);
				break;
			case "list" : addList($control, $context);
				break;
			default : 
				break;
		}

		arPanels.renderRightBar();
	}
	function addHr($control, $context){
		var parentId = $context.attr('data-parent');
		var hrId = arPanels.addControl(parentId, $control.attr('data-elem'));
		hrId = 'panel-'+parentId+'-hr-'+hrId;
		var $data = $('<hr data-elem = "hr" data-parent = "'+parentId+'" id = "'+hrId+'">');
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}
	function addTable($control, $context){
		var parentId = $context.attr('data-parent');
		var tableId = arPanels.addControl(parentId, $control.attr('data-elem'));
		tableId = 'panel-'+parentId+'-table-'+tableId;
		var $data = $('<li data-elem="table" class = "table-responsive" data-parent = "'+parentId+'"   id="'+tableId+'"><table class = "table"><thead><tr></tr></thead></table>'+
			'<ul class="control-action"><li data-action="add" data-target="#'+tableId+'"><span class="fa fa-plus-square-o"></li><li data-action="delete" data-target="#'+tableId+'"><span class="fa fa-times-circle-o"></li></ul>'+
			'</li>');
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}
	function addList($control, $context){
		var parentId = $context.attr('data-parent');
		var listId = arPanels.addControl(parentId, $control.attr('data-elem'));
		var listType = $control.attr('data-type');
		listId = 'panel-'+parentId+'-list-'+listId;
		var $data = $('<li data-elem="list" data-parent = "'+parentId+'"   id="'+listId+'"><'+listType+' data-mode = "edit"></'+listType+'>'+
			'<ul class="control-action"><li data-action="add" data-target="#'+listId+'"><span class="fa fa-plus-square-o"></li><li data-action="delete" data-target="#'+listId+'"><span class="fa fa-times-circle-o"></li></ul>'+
			'</li>');
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}
	function addImage($control, $context){
		var parentId = $context.attr('data-parent');
		var imageId = arPanels.addControl(parentId, $control.attr('data-elem'));
		imageId = 'panel-'+parentId+'-image-'+imageId;
		var $data = $('<li data-elem = "image" height = "150" width = "150" style="display:inline-block" id = "'+imageId+'" data-parent = "'+parentId+'" ><img src = "#" height = "150" width = "150">'+
			'<ul class="control-action"><li data-action="load" data-target="#'+imageId+'"><span class="fa fa-file-picture-o"></li><li data-action="delete" data-target="#'+imageId+'"><span class="fa fa-times-circle-o"></li></ul>'+
			'</li>').resizable();
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));

	}
	function addHeading($control, $context, size) {

		var parentId = $context.attr('data-parent');
		var headingId = arPanels.addControl(parentId,$control.attr('data-elem'));
		headingId = 'panel-'+parentId+'-heading-'+headingId;
		var $data = $('<li data-elem="heading"  data-parent = "'+parentId+'"   id="'+headingId+'"><h'+size+'>Heading</h'+size+'>'+
			'<ul class="control-action"><li data-action="edit" data-target="#'+headingId+'"><span class="fa fa-pencil"></li><li data-action="delete" data-target="#'+headingId+'"><span class="fa fa-times-circle-o"></li></ul>'+
			'</li>');

		//arPanels.addHeading($context,$data);
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}

	function addParagraph($control, $context) {
		var parentId = $context.attr('data-parent');
		var paragraphId = arPanels.addControl(parentId,$control.attr('data-elem'));
		paragraphId = 'panel-'+parentId+'-paragraph-'+paragraphId;
		var $data = $('<li data-elem="paragraph"  data-parent = "'+parentId+'"  id="'+paragraphId+'"><p>Paragraph</p>'+
			'<ul class="control-action"><li data-action="edit" data-target="#'+paragraphId+'"><span class="fa fa-pencil"></li><li data-action="delete" data-target="#'+paragraphId+'"><span class="fa fa-times-circle-o"></li></ul>'+
			'</li>');
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}
	function addPanel($control,$context) {

		// Generates a new Panel Id 
		
		var parentType = $context.attr('data-elem');
		if(parentType == 'panel'){
			addSubPanel($control,$context);
		}
		else {
		var panelId = arPanels.addControl(0,$control.attr('data-elem'));
		$p = 	$('<ol class="dynamic-panel" id="'+panelId+'" data-parent = "'+panelId+'" data-elem="panel"><li class="placeholder" id = "placeholder'+panelId+'"data-elem="No Controls"><h3>Panel <span class="notice-text">Add Controls Here</span></h3><span class="trash"></span></li></ol>').droppable({
					accept: ":not(.ui-sortable-helper) ", //:not('#tool-box-controls > li[data-elem=\"panel\"]')",
					connectWith: ".dynamic-panel",
					greedy : true,
					cancel : ".placeholder",
					drop : function(event, ui) {
						$('#placeholder'+$(this).attr('id')).remove();
						addControl(ui.draggable, $(this));

					}
				}).sortable({
					containment : "document",
					connectWith: ".dynamic-panel",
					cursor : "move",
					cancel : ".placeholder",
					stop : function(e,ui) {
						if(ui.item.parent().children(':not(.placeholder)').length > 0){
							$('#placeholder'+ui.item.parent().attr('id')).remove();
							//alert(ui.item.parent().children(':not(.placeholder)').length);
						}

						if($(this).children().length == 0)
							$(this).append('<li class="placeholder" id = "placeholder'+panelId+'"data-elem="No Controls"><h3>Panel <span class="notice-text">Add Controls Here</span></h3><span class="trash"></span></li>');
						arPanels.renderRightBar();
			}
				 })
				.appendTo($context);
		}

	}
	function addSubPanel($control,$context){
		var parentId = $context.attr('data-parent');
		var panelId = arPanels.addControl(parentId,$control.attr('data-elem'));
		$p = $('<ol class="dynamic-panel sub-panel" id="'+panelId+'" data-elem="panel" data-parent = "'+parentId+'"><li class="placeholder" id = "placeholder'+panelId+'" data-elem="No Controls"><h3>Panel <span class="notice-text">Add Controls Here</span></h3><span class="trash"></span></li></ol>').resizable({
				handles:'e',
        		containment:"document"
		}).draggable({
			accept:"img"
		}).droppable({
					accept: ":not(.ui-sortable-helper) ", //:not('#tool-box-controls > li[data-elem=\"panel\"]')",
					connectWith: ".dynamic-panel",
					greedy : true,
					cancel : ".placeholder",
					drop : function(event, ui) {
						$('#placeholder'+$(this).attr('id')).remove();
						addControl(ui.draggable, $(this));

					}
				}).sortable({
					containment : "document",
					connectWith: ".dynamic-panel",
					cursor : "move",
					cancel : ".placeholder",
					stop : function(e,ui) {
						if(ui.item.parent().children(':not(.placeholder)').length > 0){
							$('#placeholder'+ui.item.parent().attr('id')).remove();
							//alert(ui.item.parent().children(':not(.placeholder)').length);
						}
						
						if($(this).children().length == 0)
							$(this).append('<li class="placeholder" id = "placeholder'+panelId+'"data-elem="No Controls"><h3>Panel <span class="notice-text">Add Controls Here</span></h3><span class="trash"></span></li>');
						arPanels.renderRightBar();
			}
				 })
				.appendTo($context);
	}
		$( "#save" ).click(function(e) {
			e.preventDefault();
	  		var $htmlString = $( "#dynamic-controls" ).clone();
	  		$htmlString.find('.control-action').remove();
	  		$htmlString.find('.edit-control').remove();
	  		$htmlString.find('li.placeholder').parent().remove();
	  		var s = $htmlString.html();
	  		s = '<html><head> <title> Page View </title><link rel="stylesheet" type="text/css" href="../assets/css/build-style.css"><link rel="stylesheet" type="text/css" href="../assets/css/bootstrap.min.css"></head><body><div id="header"><h2>#ResumeBuilder</h2></div><div id="content">'  + s +'</div><script type="text/javascript" src="../assets/external/jquery/jquery.js"></script><script type="text/javascript" src="../assets/js/form.js"></script></body></html>';
	  		s = s.replace('/"','"');
	  		arPanels.createJsonObject(0,'#dynamic-controls', arPanels.jsonObject.work_area);
	  		var jsonObject = JSON.stringify(arPanels.jsonObject);
	  		//console.log(jsonObject);
	  		$.ajax({
	  			url: 'save.php',
	  			type: 'POST',
	  			data : {
	  				content : s,
	  				jsonObject : jsonObject,
	  			},
	  		})
	  		.done(function(data) {
	  			data = $.parseJSON(data);
	  			if(data.success) {
	  				alert("Form Created Successfully!");
	  			}
	  			//console.log(data);
	  			window.open(data.file,"Final Build");
	  			//console.log("success");
	  		})
	  		.fail(function(data) {
	  			console.log("error");
	  			console.log(data);
	  		})
	  		.always(function() {
	  			console.log("complete");
	  		});
	});

	$('#rt-panel-hide').on('click', function(event) {
		$('#rt-panel').css({
			'right' : '-140px'
		});
		$(this).hide();
		$('#rt-panel-show').show();
	});
	$('#rt-panel-show').on('click', function(event) {
		$('#rt-panel').css({
			'right' : '0',
		})
		$(this).hide();
		$('#rt-panel-hide').show();
		/* Act on the event */
	});
	$('#rt-panel-toggle').on('click', function(event) {
		$('#rt-panel').fadeIn();
		$(this).hide();
		/* Act on the event */
	});
	$(window).resize(function(event) {
		h = $(window).height();
		w = $(window).width();

		if(w < 480 ) {
			$('#rt-panel').css({
				'right' : '-140px',
			});
			$('#rt-panel-show').show();
			$('#rt-panel-hide').hide();
		}

		// if(w > 640) {
		// 	$('#rt-panel').show();
		// 	$('#rt-panel-show').hide();
		// 	$('#rt-panel-hide').show();
		// }
	});

});
