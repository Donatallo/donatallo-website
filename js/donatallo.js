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
	var list = $('<ul>');

	items.forEach(function(item) {
		$('<li>').text(item.name).appendTo(list);
	});

	$("#items").empty().append(list);
}
