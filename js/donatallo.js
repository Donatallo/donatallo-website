// Items array
var items = [];

// Load database recursively
$.get('database/meta.yml', function(data) {
	jsyaml.load(data).files.forEach(function(file) {
		$.get('database/' + file, function(itemdata) {
			items = items.concat(jsyaml.load(itemdata)).sort(function(a, b) {
				return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
			});
			renderDatabase();
		}, "text");
	});
}, "text");

function renderDonationMethod(method) {
	return method;
}

function renderDatabase() {
	var table = $('<table>').append(
		$('<tr>').append(
			$('<th>').text('Project')
		).append(
			$('<th>').text('Donation methods')
		).append(
			$('<th>').text('Donate')
		)
	);

	items.forEach(function(item, i) {
		var tr_class = (i & 1) ? 'even' : 'odd';
		$('<tr>').addClass(tr_class).append(
			$('<td>').addClass("project-name").append(
				$('<a>').prop('href', item.url).text(item.name)
			)
		).append(
			$('<td>').addClass("donation-methods").prop('rowspan', 2).text(item.methods.sort().map(renderDonationMethod).join(', '))
		).append(
			$('<td>').addClass("donation-go").prop('rowspan', 2).append(
				$('<a>').prop('href', item.donations || item.url).text('Donate')
			)
		).appendTo(table);

		$('<tr>').addClass(tr_class).append(
			$('<td>').addClass("project-description").text(item.comment)
		).appendTo(table);
	});

	$("#items").empty().append(table);
}
