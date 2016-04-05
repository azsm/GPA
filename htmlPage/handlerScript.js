$(function() {
        console.log( "ready!" );


        $('#retrievedRepositoriesList').hide();

        // Load the Visualization API and the corechart package.
        google.charts.load('current', {'packages':['corechart']});
});



$('#searchRepository').submit(function(event){
    var repoName = $('#repositoryName').val();
    requestListRepositories(getRepoSearchURL(repoName), function(data) {
	
        $('#retrievedRepositoriesList').empty();

        if (data.total_count > 0) {
		    $.each(data.items, function(i, item) {
   			    $('#retrievedRepositoriesList').append($('<option>', 
                    { value: item.full_name, text : item.full_name }
                ));
		    });
            $('#retrievedRepositoriesList').show();
        }
        else {
            $('#retrievedRepositoriesList').hide();
            alert("Not result found for this entry, please recheck !!");
        }
  	});
    event.preventDefault();
});


$("#retrievedRepositories").click(function() {
	var selectedRepo = $('#retrievedRepositoriesList option:selected').val();
    requestListRepositories(getRepoContributorsURL(selectedRepo), function(data) {
        var outhtml = '<p><strong>User List:</strong></p> <ul>';
            
        $.each(data.items, function(i, item) {
			var contributor = item.author;
            outhtml = outhtml + '<li><a href="'
                        + contributor.html_url +'" target="_blank">'
                        + contributor.login + '</a></li>';
        });
            
		outhtml = outhtml + '</ul></div>'; 
		$('#repoUsers').html(outhtml);

  	});

    loadCharts(selectedRepo);
});


