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

function renderDatabase() {
	var table = $('<table>').append(
		$('<tr>').append(
			$('<th>').text('Project')
		).append(
			$('<th>').text('Methods')
		).append(
			$('<th>').text('Donate')
		)
	);

	items.forEach(function(item, i) {
		var tr_class = (i & 1) ? 'odd' : 'even';
		$('<tr>').addClass(tr_class).append(
			$('<td>').addClass("column-project").append(
				$('<a>').addClass("project-name").prop('href', item.url).text(item.name)
			).append(
				$('<p>').addClass("project-comment").text(item.comment)
			)
		).append(
			$('<td>').addClass("column-donations").append(
				item.methods.sort().map(function(method) {
					return $('<div>').addClass('donation-method').addClass('button').prop('title', method).text(method);
				})
			)
		).append(
			$('<td>').addClass("column-go").append(
				$('<a>').prop('href', item.donations || item.url).addClass('button').text('Goto')
			)
		).appendTo(table);
	});

	$("#items").empty().append(table);
}
