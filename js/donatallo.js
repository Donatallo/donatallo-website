var methods = {};
var methods_not_yet_loaded = 0;
var projects = [];

loadDatabase('database');

function loadDatabase(path) {
	$.get(path + '/meta.yml', function(data) {
		var metadata = jsyaml.load(data);
		metadata.methods.forEach(function(file) {
			methods_not_yet_loaded++;
			$.get(path + '/' + file, function(data) {
				processMethods(data);
				if (--methods_not_yet_loaded == 0) {
					metadata.projects.forEach(function(file) {
						$.get(path + '/' + file, processProjects, "text");
					});
				}
			}, "text");
		});
	}, "text");
}

function processMethods(data) {
	jsyaml.load(data).forEach(function(method) {
		methods[method.keyword] = method;
	});
}

function processProjects(data) {
	projects = projects.concat(jsyaml.load(data)).sort(function(a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	renderDatabase();
}

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

	projects.forEach(function(item, i) {
		$('<tr>').append(
			$('<td>').addClass("column-project").append(
				$('<a>').addClass("project-name").prop('href', item.url).text(item.name)
			).append(
				$('<p>').addClass("project-comment").text(item.comment)
			)
		).append(
			$('<td>').addClass("column-donations").append(
				item.methods.sort().map(function(method) {
					var inside;
					if (typeof methods[method].icon === 'undefined') {
						return $('<div>').addClass('donation-method').addClass('button').prop('title', methods[method].name).append(
							$('<div>').addClass('donation-method-desc').text(methods[method].name)
						);
					} else {
						return $('<div>').addClass('donation-method').addClass('button').prop('title', methods[method].name).append(
							$('<img>').prop('src', 'database/' + methods[method].icon).prop('width', '32').prop('height', '32')
						);
					}
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
