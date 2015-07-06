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
					$c = $('<ul id="panel-control-'+panelId+'" class="items box-controls"><li class="panel-title"><span>#panel-'+panelId+' Controls</span></li></ul>');
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

		createJsonObject : function(obj) {
			var $workarea = $('#dynamic-controls').find(' > ol');
			console.log('length: '+$workarea.length);
			for (var i =0; i< $workarea.length; i++) {
				console.log('inside loop')
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
				};

				var $controlContainer = $('#'+id).find('>li');
				for (var j = $controls.length - 1; j >= 0; j--) {
					$control = 
				};

				this.jsonObject.work_area.panel.push($panelDef);
			}
		},

	};


	var $tool_box_controls = $('#tool-box-controls'),

		$work_area = $('#work-area'),

		$dynamic_controls =  $('#dynamic-controls'),

		$trash = $('#trash'),

		$panels = $('#panels');


	$('ul > li > a').on('click', function(event) {
		event.preventDefault();
	});

	// Event for Removing Panels/Controls
	$work_area.on('click', '.trash', function(event) {
		var $item = $(this).closest('li');
		var $parent = $item.parent('.dynamic-panel');

		//$item.remove();

		if($parent.children().length == 1) { // IF the control was the last inside the panel den drop the panel also
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
		} else {
			arPanels.removeControl($item.attr('data-elem'), $item.attr('id'));
			$item.remove();
		}
		arPanels.renderRightBar();
	});
	$work_area.on('dblclick','ol > li',function() {

		var $elem = $(this);

		if($elem.hasClass('placeholder')){
			return ;
		}

		var type = $elem.attr('data-elem');

		if(type=="submitButton" || type == "textField") {
			oldval = $elem.val();
		}
		else {
			oldval = $elem.text();
		}

			$elem.html('<input type="text" placeholder="Enter '+type+' text" class="edit-data" placeholder=""/>').find('input').focus();
	});

	$('#work-area').on('focusout','input',function() {
			var newval = $(this).val();
			var closestelem;

			closestelem = $(this).closest('li');
			if(newval=="")
				newval = oldval;

			var elemType = closestelem.attr('data-elem');

			switch(elemType) {
				case 'heading' : 
					closestelem.html('<h3>'+newval+'</h3><span class="trash"></span>');
					break;
				case 'paragraph': 
					closestelem.html('<p>'+newval+'</p><span class="trash"></span>');
					break;
				case 'textField' : 
					closestelem.html('<input type="text" value="'+newval+'"/><span class="trash"></span>');
					break;
				case 'submitButton' : 
					closestelem.html('<input type="submit" value="'+newval+'"/><span class="trash"></span>');
					break;
				default : 
					break;

			}
		});

	
	// Items present in tool box is draggable
	$("li", $tool_box_controls).draggable({
		revert : "invalid",
		 helper : function() {
		 	return '<div class="helper-control">'+$(this).text()+'</div>';
		 },
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
		var $data = $('<li data-elem="heading" id="heading-'+headingId+'"><h3>Heading <span class="notice-text">(Double click to change)</span></h3><span class="trash"></span></li>');

		//arPanels.addHeading($context,$data);
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}

	function addParagraph($control, $context) {
		var paragraphId = arPanels.addControl($control.attr('data-elem'));
		var $data = $('<li data-elem="paragraph" id="paragraph-'+paragraphId+'"><p>Paragraph <span class="notice-text">(Double click to change)</span></p><span class="trash"></span></li>');
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}

	function addTextField($control, $context) {
		var textFieldId = arPanels.addControl($control.attr('data-elem'));
		var $data = $('<li data-elem="textField" id="textField-'+textFieldId+'"><input type="text" placeholder="Enter Value"><span class="trash"></span></li>');
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}

	function addSubmitButton($control, $context) {
		var submitButtonId = arPanels.addControl($control.attr('data-elem'));
		var $data = $('<li data-elem="'+$control.attr('data-elem')+'" id="submitButton-'+submitButtonId+'"><input type="submit" value="Button"><span class="trash"></span></li>');
		$data.appendTo($context);
		arPanels.activatePanel($context.attr('id'));
	}
	function addPanel($control,$context) {

		// Generates a new Panel Id 
		var panelId = arPanels.addControl($control.attr('data-elem'));
	
			$('<ol class="dynamic-panel" id="'+panelId+'" data-elem="panel"><li class="placeholder" data-elem="No Controls"><h3>Panel <span class="notice-text">Add Controls Here</span></h3></li></ol>').droppable({
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
			}).appendTo($context);
	}

	// SHIKHAR CODE
		$( "#save" ).click(function() {
	  		var htmlString = $( "#dynamic-controls" ).html();
	  		htmlString = '<html><head> <title> Page View </title><link rel="stylesheet" type="text/css" href="assets/css/build-style.css"><header> Page View </header> </head><body>'  + htmlString +'</body></html>';
	  		htmlString = htmlString.replace('/"','"');
	  		arPanels.createJsonObject('#dynamic-controls');
	  		$.ajax({
	  			type : "POST",
	  			url : "save.php",
	  			dataType : "html",
	  			data : {content : htmlString},
	  			success: function(output) {
	  				//var w = window.open('test.html',"Final Build");
	  				//w.document.write(output);
	  			  //	w.document.close();
                  }
	  		});
	});
});
