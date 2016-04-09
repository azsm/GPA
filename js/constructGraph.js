DAY_IN_MILLISECOND = 24 * 60 * 60 * 1000;

function loadCharts(repoName) {
	$('#repoCorrespondantGraph').show();

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
            var dateCommit = new Date(item.commit.committer.date);
            resetHours(dateCommit); 
            if(commiter in historyCommits) {
                (historyCommits[commiter]).push(dateCommit);
            }
            else {
                historyCommits[commiter] = [dateCommit];
            }
        });

    
        google.charts.setOnLoadCallback(drawImpactContributorChart(mapCommitters));
	    google.charts.setOnLoadCallback(drawCommitsTimelineChart(historyCommits));
    });
}

function resetHours(d) {
    d.setHours(0);    
    d.setMilliseconds(0);
    d.setMinutes(0);
    d.setSeconds(0);
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
    $.each(rows, function(commiter, listDate) {

        var nextDate  = listDate[0];
        var endCommit = listDate[0];
        $.each(listDate, function(index, d) {
            if((nextDate.getTime() - d.getTime()) > DAY_IN_MILLISECOND) {
                listData.push([commiter, nextDate, endCommit]);
                endCommit = d;
            }
            nextDate = d;
        });
        listData.push([commiter, nextDate, endCommit]);
    });

    dataTable.addRows(listData);

    var chart = new google.visualization.Timeline(document.getElementById('commitChart'));
    chart.draw(dataTable);
}
