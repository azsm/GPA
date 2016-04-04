/*var URLS = (function() {
     var private = {
         'SEARCH_REPO_URL': 'https://api.github.com/search/repositories?q=',
         'ANOTHER_CONST': '2'
     };

     return {
        get: function(name) { return private[name]; }
    };
})();
*/


function requestListRepositories(url, displayListRepository) {
	$.get( url )
		.done(displayListRepository)
		.fail(function() {
    		alert( "error contact admin" );
  		});
}

