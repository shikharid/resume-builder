jQuery(document).ready(function($) {
	
	$('.dynamic-panel > li > input[type="submit"]').on('click', function(event) {

		var a = document.location.pathname.split('/');
		var filename = a[a.length-1].split('.')[0];

		var controls = $('.dynamic-panel > li');

		var c_values = new Array();

		for(var i =0; i< controls.length ; i++) {
			var c = $(controls[i]);
			var c_id = c.attr('id');
			var c_type = c.attr('data-elem');

			

			switch(c_type) {
				case 'heading' : c_values.push(null);
				break;
				case 'paragraph' : c_values.push(null);
				break;
				case 'textField' : c_values.push(c.find('input').val());
				break;
				case 'submitButton' : c_values.push(null);
				break;
				default : 
				break;
			}
		}

		console.log(c_values);

		$.ajax({
			url: '../formsubmit.php',
			type: 'POST',
			data: {
				filename: filename,
				field_values : c_values,
			},
		})
		.done(function(data) {
			data = $.parseJSON(data);
			alert('Entry Added Successfully');
			console.log(data);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
		console.log(filename);
	});
});