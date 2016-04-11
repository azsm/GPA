DAY_IN_MILLISECOND = 24 * 60 * 60 * 1000;

function loadCharts(repoName) {
	$('#repoCorrespondantGraph').show();
   
    requestListRepositories(getRepoLanguagesURL(repoName), function(data) {
        var languageProportions = [];
        $.each(data, function(i, item) {
            languageProportions.push([i, item]);
        });
        
        google.charts.setOnLoadCallback(function() {
            drawLanguageProportionUse(languageProportions);
        });
    });

    requestListRepositories(getRepoCommitsURL(repoName), function(data) {
        var mapCommitters  = {};
        var historyCommits = {};
        $.each(data, function(i, item) {
            if(item.author) {
                var author = item.author.login;
                mapCommitters[author] = (author in mapCommitters) ? (mapCommitters[author] + 1) : 1;
            }
           
            var committer   = item.commit.committer.name;
            var dateCommit = new Date(item.commit.committer.date);
            resetHours(dateCommit); 
            if(committer in historyCommits) {
                (historyCommits[committer]).push(dateCommit);
            }
            else {
                historyCommits[committer] = [dateCommit];
            }
        });

        google.charts.setOnLoadCallback(function() {
            drawImpactContributorChart(mapCommitters);
        });
	    
        google.charts.setOnLoadCallback(function() {
            drawCommitsTimelineChart(historyCommits)
        });
    });
}

function resetHours(d) {
    d.setUTCHours(0);    
    d.setUTCMilliseconds(0);
    d.setUTCMinutes(0);
    d.setUTCSeconds(0);
}

function drawLanguageProportionUse(rows) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
  
    data.addRows(rows);

    var options = {'title':'Programming language usage',
                    'width':400,
                    'height':300};

    var chart = new google.visualization.PieChart(document.getElementById('languageChart'));
    chart.draw(data, options);

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

    var options = {'title':'The impact of each user on the project based on the last 100 commits',
                    'width':400,
                    'height':300};

    var chart = new google.visualization.PieChart(document.getElementById('contributorChart'));
    chart.draw(data, options);
}


function drawCommitsTimelineChart(rows) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Committer' });
    dataTable.addColumn({ type: 'string', id: 'dummy bar label' });
    dataTable.addColumn({type: 'string' , role: 'tooltip', p: {'html': true}})
    dataTable.addColumn({ type: 'date'  , id: 'start date' });
    dataTable.addColumn({ type: 'date'  , id: 'end date' });

    var listData = [];    
    $.each(rows, function(committer, listDate) {

        var nextDate  = listDate[0];
        var endCommit = listDate[0];
        $.each(listDate, function(index, d) {
            if((nextDate.getTime() - d.getTime()) > DAY_IN_MILLISECOND) {
                listData.push([committer, null, createCustomHTMLContentForTimeline(committer, nextDate, endCommit), nextDate, endCommit]);
                endCommit = d;
            }
            nextDate = d;
        });
        listData.push([committer, null, createCustomHTMLContentForTimeline(committer, nextDate, endCommit), nextDate, endCommit]);
    });
    dataTable.addRows(listData);

    var paddingHeight = 50;
    var rowHeight = dataTable.getNumberOfRows() * 20;
    var chartHeight = rowHeight + paddingHeight;

    var options = {
        title  : 'User commit Timeline based on the last 100 commits',
        tooltip: { isHtml: true },
        height : chartHeight
    };

    var chart = new google.visualization.Timeline(document.getElementById('commitChart'));
    chart.draw(dataTable, options);
}

function createCustomHTMLContentForTimeline(committer, startDate, endDate) {
    var duration = 1 + (endDate.getTime() - startDate.getTime()) / DAY_IN_MILLISECOND;
    return '<div><p><Strong>' + committer + '</Strong> has commit : <br/> from ' + startDate + ' to ' + endDate + '</p>' 
        + '<p> It is for about <Strong>' + duration + '</Strong> day(s)</p></div>';
}
