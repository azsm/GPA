function loadCharts(repoName) {
    var mapCommitters = {};
    
    requestListRepositories(getRepoCommitsURL(repoName), function(data) {
        $.each(data.items, function(item) {
            var author = item.author;
            console.log(author); 
            if(author in mapCommitters) {
                mapCommitters[author] = mapCommitters[author] + 1;
            }
            else {
                mapCommitters[author] = 1;
            }
        });
    });

    google.charts.setOnLoadCallback(drawImpactContributorChart(mapCommitters));
	google.charts.setOnLoadCallback(drawCommitsTimelineChart());
}

function drawImpactContributorChart(rows) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
  
    var listData = [];    
    $.each(rows, function(row) {
        listData.push([row, rows[row]]); 
    });
    data.addRows(listData);

    var options = {'title':'User contribution',
                    'width':400,
                    'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('contributorChart'));
    chart.draw(data, options);
}

function drawCommitsTimelineChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Mushrooms', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ]);

        // Set chart options
        var options = {'title':'Commits timeline',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('commitChart'));
        chart.draw(data, options);
}
    
