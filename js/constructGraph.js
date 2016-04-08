function loadCharts(repoName) {
    var mapCommitters  = {};
    var historyCommits = {};
    
    requestListRepositories(getRepoCommitsURL(repoName), function(data) {
        $.each(data, function(i, item) {
            
            if(item.author != null) {
                var author = item.author.login;
                if(author in mapCommitters) {
                    mapCommitters[author] = mapCommitters[author] + 1;
                }
                else {
                    mapCommitters[author] = 1;
                }

            }
           
            var commiter   = item.commit.committer.name;
            var dateCommit = (new Date(item.commit.committer.date)).setHours(0, 0, 0, 0, 0);
            console.log("get the date :: " + dateCommit);
            if(commiter in historyCommits) {
                historyCommits[commiter] = (historyCommits[commiter]).push(dateCommit);//.append(dateCommit);
            }
            else {
                historyCommits[commiter] = [dateCommit];
            }
        });

    
        google.charts.setOnLoadCallback(drawImpactContributorChart(mapCommitters));
	    google.charts.setOnLoadCallback(drawCommitsTimelineChart(historyCommits));
    });
}

function drawImpactContributorChart(rows) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
  
    var listData = [];    
    $.each(rows, function(row, data) {
        listData.push([row, data]); 
    });

    data.addRows(listData);

    var options = {'title':'The impact of each user on the project',
                    'width':400,
                    'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('contributorChart'));
    chart.draw(data, options);
}


function drawCommitsTimelineChart(rows) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Committer' });
    dataTable.addColumn({ type: 'date'  , id: 'start date' });
    dataTable.addColumn({ type: 'date'  , id: 'end date' });
   
    var listData = [];    
    $.each(rows, function(i, row) {
        console.log("work with date :: " + i + " => " + row);    
        $.each(rows[row], function(d) {
        });
    });



//    dataTable.addRows(rows);

//	var chart = new google.visualization.Timeline(document.getElementById('commitChart'));
//	chart.draw(dataTable);
}


    
