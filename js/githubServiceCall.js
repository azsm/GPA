var URL_START = "https://api.github.com/";

function getRepoSearchURL(name) { 
    return URL_START + "search/repositories?q=" + name; 
}

function getRepoURL(name) { 
    return URL_START + "repos/" + name; 
}
        
function getRepoContributorsURL(name) { 
    return URL_START + "repos/" + name + "/stats/contributors";
}

function getRepoCommitsURL(name) {
    return URL_START + "repos/" + name + "/commits?per_page=100";
}


function requestListRepositories(url, displayListRepository) {
	$.get( url )
		.done(displayListRepository)
		.fail(function() {
    		alert( "error contact admin" );
  		});
}

