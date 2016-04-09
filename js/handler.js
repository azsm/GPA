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

   // verifyURLState();

    $('#searchRepository').submit(function(e) {
        var repoName = $('#repositoryName').val();
        onSearchRepositorySubmit(repoName);
        
        var stateData = { 
            state_input_repo_var    : repoName, 
            state_selected_repo_var : ""
        };   
        var url = "?" + STATE_INPUT_REPO_VAR + "=" + repoName; 
        history.pushState(stateData, PUSH_STATE_TITLE_SEARCH + repoName, url);
        
        e.preventDefault();
    });


    $("#retrievedRepositoriesList").dblclick(function(e) {
	    var selectedRepo = $('#retrievedRepositoriesList option:selected').val();
        onSelectRepositoryInList(selectedRepo);
        
        var stateData = { 
            state_input_repo_var    : $('#repositoryName').val(), 
            state_selected_repo_var : selectedRepo
        };    
        var url = "?" + STATE_INPUT_REPO_VAR + "=" + $('#repositoryName').val() + "&" + STATE_SELECTED_REPO_VAR + "=" + selectedRepo; 
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
    var state_url = {
        state_input_repo_var    : "",
        state_selected_repo_var : ""
    };

    // Split the url 
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (pair[0] === STATE_INPUT_REPO_VAR) {
            state_url.state_input_repo_var = pair[1];
        } 
        else if (pair[0] === STATE_SELECTED_REPO_VAR) {
            state_url.state_selected_repo_var = pair[1];
        } 
    } 
   // load updateContent
   updateContent(state_url); 
}

/*
 * This function is called when the user navigate on the history on charge a URL
 * It help to restitute the state
 */
function updateContent(state) {
    if(state != null && state.state_input_repo_var != "") {
        onSearchRepositorySubmit(state.state_input_repo_var);
        if(state.state_selected_repo_var != "") {
            onSelectRepositoryInList(state.state_selected_repo_var);
        }
        else {
            $('#repoDetailsPart').hide();
        }
    }
    else {
        console.log("No state !! " + state);
        hideAllComponent();
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
        var outhtml = '<p><strong>User List:</strong></p> <p>';
            
        $.each(data, function(i, item) {
			var contributor = item.author;
            outhtml = outhtml + '<a href="'
                        + contributor.html_url +'" target="_blank" class="btn btn-info" role="button">'
                        + contributor.login + '</a>';
        });
            
		outhtml = outhtml + '</p>'; 
		$('#repoUsers').html(outhtml);

  	});

    loadCharts(selectedRepo);
}
