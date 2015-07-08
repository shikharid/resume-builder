
jQuery(document).ready(function($) {

	var oldval;

	var arPanels  = {
		'panelCount' : 0,
		'panel' : [], 			// Array holding ID's of the panels added to work area
		'heading' : [], 		// Array holding ID's of headings added inside the panel
		'paragraph' : [], 		// Array holding ID's of paragraphs added inside panel
		'textField' : [], 		// Array holding ID's of text Fields added inside panel
		'submitButton' : [], 	// Array holding Id's of submit button added inside panel
		'activePanel' : null, 	// Variable holding the ID of currently selected panel
		'jsonObject' : {
			'work_area' : {
				'panel' : [],
			},
		},

		/*
			function addControl
				- Add the Id of the (panel, heading, paragraph, textField, submitButton, etc) to their corresponding array
			@params (control)
				- control : tells the type of control for which to return Id
			return values
				- Returns the Id of control generated according to the values in the corresponding control array
		*/
		addControl : function(controlType) {
			var controlId;
			if(this[controlType].length == 0){
				controlId = 1;
			} else {
				controlId = Math.max.apply(Math,this[controlType])+1;
			}
			
			this[controlType].push(controlId);
			return controlId;
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

				var $panelDef = {
					'type' : type,
					'width' : width,
					'inline' : inline,
					'id' : id,
					'parentId' : $panel.parent('ol').attr('id'),
					'controls' : [],
				};
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
			default : 
			break;
		}
		//$(targetId).remove();
	});


	// Event for Removing Panels/Controls
	$work_area.on('click', '.trash', function(event) {
		var $item = $(this).closest('li');
		removeControl($item);
	});

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
			case 'textField' : value = $item.val();
			break;
			case 'submitButton' : value = $item.val();
			break;
		}
		var a = '<div class="edit-control"><b>Value&nbsp;</b>&nbsp;<input type="text" value="'+value+'" data-oldvalue="'+value+'" class="form-control edit-control-field">&nbsp;<button type="button" data-action="edit-ok" data-target="'+target+'" class="btn btn-sm btn-success">Ok</button><button type="button" data-action="edit-cancel"  data-target="'+target+'" class="btn btn-sm btn-default">Cancel</button></div></div>';
		$item.html(a);
		$item.find('input:text').select().focus(); //focus(function() { $item.find('input:text').select(); });
	}

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
				case 'textField' : 
					$target.html('<input type="text" value="'+newval+'"/><ul class="control-action"><li data-action="edit" data-target="'+targetId+'"><span class="fa fa-pencil"></li><li data-action="delete" data-target="'+targetId+'"><span class="fa fa-times-circle-o"></li></ul>');
					break;
				case 'submitButton' : 
					$target.html('<input type="submit" value="'+newval+'"/><ul class="control-action"><li data-action="edit" data-target="'+targetId+'"><span class="fa fa-pencil"></li><li data-action="delete" data-target="'+targetId+'"><span class="fa fa-times-circle-o"></li></ul>');
					break;
				default : 
					break;

		}
		$editControl.remove();
	}); 

	function removeControl(item){
		//var $item = $(this).closest('li');
		var $item = item;
		var $parent = $item.parent('.dynamic-panel');

		//$item.remove();

		if($parent.children().length == 1) { // IF the control was the last inside the panel den drop the panel also
			if($item.hasClass('placeholder')) {
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
			case "heading" : addHeading($control, $context);
				break;
			case "paragraph" : addParagraph($control, $context);
				break;
			case "panel" : addPanel($control, $context);
				break;
			case "textField" : addTextField($control, $context);
				break;
			case "submitButton" : addSubmitButton($control, $context);
				break;
			default : 
				break;
		}

		arPanels.renderRightBar();
	}

	function addHeading($control, $context) {

		var headingId = arPanels.addControl($control.attr('data-elem'));
		var $data = $('<li data-elem="heading" id="heading-'+headingId+'"><h3>Heading</h3>'+
			'<ul class="control-action"><li data-action="edit" data-target="#heading-'+headingId+'"><span class="fa fa-pencil"></li><li data-action="delete" data-target="#heading-'+headingId+'"><span class="fa fa-times-circle-o"></li></ul>'+
			'</li>');

		//arPanels.addHeading($context,$data);
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}

	function addParagraph($control, $context) {
		var paragraphId = arPanels.addControl($control.attr('data-elem'));
		var $data = $('<li data-elem="paragraph" id="paragraph-'+paragraphId+'"><p>Paragraph</p>'+
			'<ul class="control-action"><li data-action="edit" data-target="#paragraph-'+paragraphId+'"><span class="fa fa-pencil"></li><li data-action="delete" data-target="#paragraph-'+paragraphId+'"><span class="fa fa-times-circle-o"></li></ul>'+
			'</li>');
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}

	function addTextField($control, $context) {
		var textFieldId = arPanels.addControl($control.attr('data-elem'));
		var $data = $('<li data-elem="textField" id="textField-'+textFieldId+'"><input type="text" placeholder="Enter Value" class="input ">'+
			'<ul class="control-action"><li data-action="edit" data-target="#textField-'+textFieldId+'"><span class="fa fa-pencil"></li><li data-action="delete" data-target="#textField-'+textFieldId+'"><span class="fa fa-times-circle-o"></li></ul>'+
			'</li>');
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}

	function addSubmitButton($control, $context) {
		var submitButtonId = arPanels.addControl($control.attr('data-elem'));
		var $data = $('<li data-elem="'+$control.attr('data-elem')+'" id="submitButton-'+submitButtonId+'"><input type="submit" value="Button">'+
			'<ul class="control-action"><li data-action="edit" data-target="#submitButton-'+submitButtonId+'"><span class="fa fa-pencil"></li><li data-action="delete" data-target="#submitButton-'+submitButtonId+'"><span class="fa fa-times-circle-o"></li></ul>'+
			'</li>');
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}
	function addPanel($control,$context) {

		// Generates a new Panel Id 
		var panelId = arPanels.addControl($control.attr('data-elem'));
	
		$p = 	$('<ol class="dynamic-panel" id="'+panelId+'" data-elem="panel"><li class="placeholder" data-elem="No Controls"><h3>Panel <span class="notice-text">Add Controls Here</span></h3><span class="trash"></span></li></ol>').droppable({
				accept: ":not(.ui-sortable-helper) ", //:not('#tool-box-controls > li[data-elem=\"panel\"]')",
				greedy : true,
				drop : function(event, ui) {
					$(this).find('.placeholder').remove();
					addControl(ui.draggable, $(this));
				}
			}).sortable({
				containment : "document",
				cursor : "move",
				stop : function(e,ui) {
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
	  		var s = $htmlString.html();
	  		s = '<html><head> <title> Page View </title><link rel="stylesheet" type="text/css" href="assets/css/build-style.css"></head><body><div id="header"><h2>#ResumeBuilder</h2></div><div id="content">'  + s +'</div></body></html>';
	  		s = s.replace('/"','"');
	  		arPanels.createJsonObject(0,'#dynamic-controls', arPanels.jsonObject.work_area);
	  		var jsonObject = JSON.stringify(arPanels.jsonObject);
	  		$.ajax({
	  			type : "POST",
	  			url : "save.php",
	  			dataType : "html",
	  			data : {
	  				content : s,
	  				jsonObject : jsonObject,
	  			},
	  			success: function(output) {
	  				//console.log(output);
	  				var w = window.open('test.html',"Final Build");
	  				w.document.write(output);
	  			  	w.document.close();
                  }
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
