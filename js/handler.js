// THIS FILE IS USED TO HANDLE UI ENVENT 
/*
 *  Declare constant String
 */ 
STATE_INPUT_REPO_VAR    = "inputRepoName"; 
STATE_SELECTED_REPO_VAR = "repoName";

PUSH_STATE_TITLE_SEARCH  = "Find repo : ";
PUSH_STATE_TITLE_DETAILS = "Repo details : ";

var handlerFactory = {
    inputRepo : "",
   
    initInputRepo : function(initValue) {
        handlerFactory.inputRepo = initValue;
    },

    onSearchRepositorySubmit : function(e) {
        hideAllComponents();
        handlerFactory.inputRepo = $('#repositoryName').val();
    
        searchRepositories(handlerFactory.inputRepo, "");
        
        var stateData = { 
            state_input_repo_var    : handlerFactory.inputRepo, 
            state_selected_repo_var : ""
        };   
        var query = "?" + STATE_INPUT_REPO_VAR + "=" + handlerFactory.inputRepo; 
        history.pushState(stateData, PUSH_STATE_TITLE_SEARCH + handlerFactory.inputRepo, query);

        e.preventDefault();
    },

    onSelectRepository : function(e) {
	    var selectedRepo = $('#retrievedRepositoriesList option:selected').val();
        getRepoDetails(selectedRepo);
        
        var stateData = { 
            state_input_repo_var    : handlerFactory.inputRepo, 
            state_selected_repo_var : selectedRepo
        };    
        var query = "?" + STATE_INPUT_REPO_VAR + "=" + handlerFactory.inputRepo  + "&" + STATE_SELECTED_REPO_VAR + "=" + selectedRepo; 
        history.pushState(stateData, PUSH_STATE_TITLE_DETAILS + selectedRepo, query);
    }
};

/*
 * Init the function
 * It s called when the page is load
*/
$(function() {
    google.charts.load('current', {'packages':['corechart', "timeline"]});

    verifyURLState();

    $('#searchRepository').submit(handlerFactory.onSearchRepositorySubmit);
    $("#retrievedRepositoriesList").dblclick(handlerFactory.onSelectRepository);

    window.addEventListener('popstate', function(event) {
        updateContent(event.state);
    });
});


/*
 * This function get the URL argument and update content
 */
function verifyURLState() {
    hideAllComponents();
    var stateUrl = {
        state_input_repo_var    : "",
        state_selected_repo_var : ""
    };

    var mapQuery = {};
    var vars = window.location.search.substring(1).split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        mapQuery[pair[0]] = pair[1];
    }
        
    if (STATE_INPUT_REPO_VAR in mapQuery) {
        stateUrl.state_input_repo_var = mapQuery[STATE_INPUT_REPO_VAR];
        handlerFactory.initInputRepo(mapQuery[STATE_INPUT_REPO_VAR]);
    } 

    if (STATE_SELECTED_REPO_VAR in mapQuery) {
        stateUrl.state_selected_repo_var = mapQuery[STATE_SELECTED_REPO_VAR]; 
    }

    updateContent(stateUrl); 
}

/*
 * This function is called when the user navigate on the history on charge a URL
 * It help to restitute the state
 */
function updateContent(state) {
    logStateContent(state);
    if(state && state.state_input_repo_var != "") {
        $('#repositoryName').val(state.state_input_repo_var);
        searchRepositories(state.state_input_repo_var, state.state_selected_repo_var);

        if(state.state_selected_repo_var != "") {
            getRepoDetails(state.state_selected_repo_var);
        }
        else {
            $('#repoDetailsPart').hide();
			$('#repoCorrespondantGraph').hide();
        }
    }
    else {
        $('#repositoryName').val('');
        hideAllComponents();
    }
}

/*
 * log function
 */
function logStateContent(state) {
    if(state != null) {
       console.log("State :: state input repo var *" + state.state_input_repo_var + "* et state selected *" + state.state_selected_repo_var + "*");
    }
    else {
        console.log("No state !!")
    }
}

/*
 * This function hide all page components except the form 
 */
function hideAllComponents() {
    $('#retrievedRepositoriesDisplay').hide();
    $('#repoDetailsPart').hide();
	$('#repoCorrespondantGraph').hide();
}

/*
 * Get repo list that match with the entred name from the GitHub server
 * It fill the select "retrievedRepositoriesList" element on index.html 
 */
function searchRepositories(repoName, choosedRepo){
    requestListRepositories(getRepoSearchURL(repoName), function(data) {
        $('#retrievedRepositoriesList').empty();

        if (data.total_count > 0) {
		    $.each(data.items, function(i, item) {
   			    $('#retrievedRepositoriesList').append($('<option>', 
                    { value: item.full_name, text : item.full_name }
                ));
		    });
            $('#retrievedRepositoriesDisplay').show();

            if($("#retrievedRepositoriesList option[value='" + choosedRepo + "']").length > 0) {
                $("#retrievedRepositoriesList").val(choosedRepo);
            }
        }
        else {
            $('#retrievedRepositoriesDisplay').hide();
            alert("Not result found for this entry, please recheck !!");
        }
  	});
}

/*
 * This function is called when the user select a repository on the list
 * It get the repository committers and ask to load charts
 */
function getRepoDetails(selectedRepo) {
    $('#repoDetailsPart').show();
	
	requestListRepositories(getRepoURL(selectedRepo), function(data) {
        var outhtml = '<h5>Repository description :</h5><div>';
            
		outhtml = outhtml + '<table class="table"> <tbody>';
		outhtml = outhtml + '<tr><td> Name </td><td>' + data.name + '</td></tr>';
		outhtml = outhtml + '<tr><td> Description </td><td>' + data.description + '</td></tr>';
		outhtml = outhtml + '<tr><td> Owner </td><td>' + data.owner.login + '</td></tr>';
		outhtml = outhtml + '</tbody> </table>';
		outhtml = outhtml + '<a href="' + data.html_url 
							+'" target="_blank" class="btn btn-link" role="button">'
                        	+ 'Access to the project on GitHub</a>';            
		outhtml = outhtml + '</div>';

		$('#repoDescription').html(outhtml);

  	});

    requestListRepositories(getRepoContributorsURL(selectedRepo), function(data) {
        var outhtml = '<h5>User List:</h5> <div>';
            
        $.each(data, function(i, item) {
			var contributor = item.author;
            outhtml = outhtml + '<a href="'
                        + contributor.html_url +'" target="_blank" class="btn btn-link" role="button">'
                        + contributor.login + '</a> <span>&bull;</span> ';
        });
            
		outhtml = outhtml + '</div>'; 
		$('#repoUsers').html(outhtml);

  	});

    loadCharts(selectedRepo);
}
