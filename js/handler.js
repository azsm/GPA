// THIS FILE IS USED TO HANDLE UI ENVENT 

/*
 *  Declare constant String
 */ 
STATE_INPUT_REPO_VAR    = "inputRepoName"; 
STATE_SELECTED_REPO_VAR = "repoName";

PUSH_STATE_TITLE_SEARCH  = "Find repo : ";
PUSH_STATE_TITLE_DETAILS = "Repo details : ";

/*
 * Init the function
 * It s called when the page is load
*/
$(function() {
    console.log( "ready!" );

    google.charts.load('current', {'packages':['corechart', "timeline"]});

    verifyURLState();

    $('#searchRepository').submit(function(e) {
        var repoName = $('#repositoryName').val();
        onSearchRepositorySubmit(repoName);
        
        var stateData = { 
            STATE_INPUT_REPO_VAR : repoName 
        };   
        var url = "?inputRepo=" + repoName; 
        history.pushState(stateData, PUSH_STATE_TITLE_SEARCH + repoName, url);
        
        e.preventDefault();
    });


    $("#retrievedRepositoriesList").dblclick(function(e) {
	    var selectedRepo = $('#retrievedRepositoriesList option:selected').val();
        onSelectRepositoryInList(selectedRepo);
        
        var stateData = { 
            STATE_INPUT_REPO_VAR    : $('#repositoryName').val(), 
            STATE_SELECTED_REPO_VAR : selectedRepo
        };    
        var url = "?inputRepo=" + $('#repositoryName').val() + "&selectedRepo=" + selectedRepo; 
        history.pushState(stateData, PUSH_STATE_TITLE_DETAILS + selectedRepo, url);
    });

    window.addEventListener('popstate', function(event) {
        updateContent(event.state);
    });
});

/*
 * This function get the URL argument and update content
 */
function verifyURLState() {
   // get url parametre 
   // construct a state parameter 
   // load updateContent 
}

/*
 * This function is called when the user navigate on the history on charge a URL
 * It help to restitute the state
 */
function updateContent(state) {
    if(state == null) {
        console.log("No state !!");
        hideAllComponent();
    }
    else {
        if(STATE_INPUT_REPO_VAR in state) {
            onSearchRepository(state[STATE_INPUT_REPO_VAR]);
            if(STATE_SELECTED_REPO_VAR in state) {
                onSelectRepositoryInList(state[STATE_SELECTED_REPO_VAR]);
            }
            else {
                $('#repoDetailsPart').hide();
            }
        }
    }
}

/*
 * This function hide all page components except the form 
 */
function hideAllComponent() {
    $('#retrievedRepositories').hide();
    $('#repoDetailsPart').hide();
}

/*
 * Get repo list that match with the entred name from the GitHub server
 * It fill the select "retrievedRepositoriesList" element on index.html 
 */
function onSearchRepositorySubmit(repoName){
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
}

/*
 * This function is called when the user select a repository on the list
 * It get the repository committers and ask to load charts
 */
function onSelectRepositoryInList(selectedRepo) {
    requestListRepositories(getRepoContributorsURL(selectedRepo), function(data) {
        var outhtml = '<p><strong>User List:</strong></p> <ul>';
            
        $.each(data, function(i, item) {
			var contributor = item.author;
            outhtml = outhtml + '<li><a href="'
                        + contributor.html_url +'" target="_blank" class="btn btn-info" role="button">'
                        + contributor.login + '</a></li>';
        });
            
		outhtml = outhtml + '</ul></div>'; 
		$('#repoUsers').html(outhtml);

  	});

    loadCharts(selectedRepo);
}
