// get the user input 
$('#searchRepository').click(function(){
    var repoName = $('#repositoryName').val();

    var requri = "https://api.github.com/search/repositories?q=" + repoName;
    requestListRepositories(requri, function( data ) {
			$('#retrievedRepositoriesList').empty();

			$.each(data.items, function (i, item) {
    			$('#retrievedRepositoriesList').append($('<option>', { 
        			value: item.full_name,
        			text : item.full_name 
    			}));
			});

  		});
});


$("#committers").click(function() {
    if($(this).is(":checked")) {
		var selectedRepo = $('#retrievedRepositoriesList option:selected').val();
		var requri       = "https://api.github.com/repos/" + selectedRepo + "/stats/contributors";

        requestListRepositories(requri, function( data ) {

			var outhtml = '<p><strong>User List:</strong></p> <ul>';
            
			$.each(data.items, function(i, item) {
				var contributor = item.author;
              	outhtml = outhtml + '<li><a href="'+ contributor.html_url +'" target="_blank">'+ contributor.login + '</a></li>';
            });
            
			outhtml = outhtml + '</ul></div>'; 
			$('#showGraphic').html(outhtml);

  		});
    }
});

/*
$("#committersImpact").click(function() {
    if($(this).is(":checked")) 
    {
        alert('The user want commits impact');
    }
});

$("#commitTimeline").click(function() {
    if($(this).is(":checked")) 
    {
        alert('The user want commit timeline');
    }
});
*/





