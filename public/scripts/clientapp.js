$(document).ready(function(){
	appendAll();

	$('#empInfo').on('submit', createEmployeeObject);

	$('.people-list').on('click', '.deactivateButton', deactivateEmployee);

});


function createEmployeeObject() {
	event.preventDefault();

	var results = {};

	$.each($('#empInfo').serializeArray(), function(i, field) {
		results[field.name] = field.value;
	});


	$.ajax({
		type: 'POST',
		url: '/people',
		data: results,
		success: function(data) {
			if(data) {
				appendNew();
			} else {
				console.log('error');
			}
			$('#empInfo').find('input[type=text]').val('');
			$('#firstName').focus();
		}
	});
}
function appendNew() {
	$.ajax({
		type: 'GET',
		url: '/last_person',
		success: function(data) {
			//console.log(data);

			updateSalary();
			updateDom(data);
		}
	});
}

function appendAll(){
	$.ajax({
		type: 'GET',
		url: '/people',
		success: function(data) {
			//console.log(data);

			updateSalary();
			$('.people-list').children().remove();
			updateDom(data);
		}
	});
}

function updateSalary() {
	$.ajax({
		type: 'GET',
		url: '/salary_sum',
		success: function(data) {
			//console.log(data);

			data.forEach(function(person) {
				var totalSal = person.total_sal
				var monthlySal = Math.round(parseFloat(totalSal / 12));

				$('#total').replaceWith('<span id="total">' + '$' + monthlySal + '</span>');
			});
		}
	});
}

//update status to inactive
function deactivateEmployee() {

	//console.log('clicked');
	//testData = $(this).data('id');
	//console.log(testData);

	var deactivate = {};
	var index = $(this).data('id');

	deactivate.person = index;
	console.log(deactivate);

	updateSalary();

	$.ajax({
		type: 'POST',
		url: '/change_status',
		data: deactivate,
		success: function(data) {
			if(data) {
				console.log('from server:', data);
				appendAll();
			} else {
				console.log('error');
			}
		}
	});
}

function updateDom(data) {
	data.forEach(function(person) {
		$('.people-list').append('<p></p>');

		var $el = $('.people-list').children().last();

		$el.append(person.id + ': ');
		$el.append(person.first_name + ' ');
		$el.append(person.last_name + ', ');
		$el.append(person.id_num + ', ');
		$el.append(person.title + ', ');
		$el.append(person.annual_sal + ' ');
		$el.append('<button class="deactivateButton" data-id = " '+ person.id_num +' ">Deactivate Employee</button>');
	});
}
