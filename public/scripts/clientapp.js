//var totalSal = 0;
//var empArray = [];
//var monthlySal = 0;

$(document).ready(function(){
	appendDom();

	$('#empInfo').on('submit', createEmployeeObject);

	$('#container').on('click', '.deleteButton', deleteEmployee);

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
				// everything went ok
				console.log('from server:', data);
				appendDom();
			} else {
				console.log('error');
			}
			$('#empInfo').find('input[type=text]').val('');
			$('#firstName').focus();
		}
	});
}

function appendDom(){
	$.ajax({
		type: 'GET',
		url: '/people',
		success: function(data) {
			console.log(data);

			updateSalary();

			$('.people-list').children().remove();

			data.forEach(function(person) {
				$('.people-list').append('<p></p>');

				var $el = $('.people-list').children().last();

				$el.append(person.id + ': ');
				$el.append(person.first_name + ', ');
				$el.append(person.last_name + ', ');
				$el.append(person.id_num + ', ');
				$el.append(person.title + ', ');
				$el.append(person.annual_sal + ' ');
				$el.append('<button class="deleteButton">Delete Employee</button>');
			});
		}
	});
}

function updateSalary() {
	$.ajax({
		type: 'GET',
		url: '/salary_sum',
		success: function(data) {
			console.log(data);

			data.forEach(function(person) {
				var totalSal = person.total_sal
				var monthlySal = Math.round(parseFloat(totalSal / 12));

				$('#total').replaceWith('<span id="total">' + '$' + monthlySal + '</span>');
			});
		}
	});
}

function deleteEmployee() {
	var index = $(this).data().id;
	var employee = empArray[index];

	totalSal -= Math.round(employee.annualSal /12);
	totalSal = parseFloat(totalSal);
	updateSalary();

	$(this).parent().remove();
}