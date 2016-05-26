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
	return $('<div>').addClass('donation-method').text(method);
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
			$('<td>').addClass("column-project").append(
				$('<a>').addClass("project-name").prop('href', item.url).text(item.name)
			).append(
				$('<p>').addClass("project-comment").text(item.comment)
			)
		).append(
			$('<td>').addClass("column-donations").append(item.methods.sort().map(renderDonationMethod))
		).append(
			$('<td>').addClass("column-go").append(
				$('<a>').prop('href', item.donations || item.url).text('Donate')
			)
		).appendTo(table);
	});

	$("#items").empty().append(table);
}
