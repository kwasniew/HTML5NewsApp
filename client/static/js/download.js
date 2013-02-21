/*global console:true, $:true, Q:true  */

(function (window, undefined) {
    "use strict";

    var betahostUrl = 'http://apitestbeta3.medianorge.no';
    var rootUrl = betahostUrl+'/news/';


    function makeRequest(url){
        //var promise = new RSVP.Promise();
        var deferred = Q.defer();

        console.log('makeRequest to url: ', url);

        $.ajax({
            url: url,
            dataType: "xml",
            headers: {
                'accept':"application/atom+xml"
            },
            success: function(data){
                //console.log('makeRequest ok', data);
                deferred.resolve( data );
            },
            error: function(xhr, type){
                console.error('makeRequest root error');
                deferred.reject(new Error( arguments ) );
            }
        });

        return deferred.promise;
    }

    function getRoot() {
        return makeRequest(rootUrl);
    }

    function getArticle(url){
        //var promise = new RSVP.Promise();
        var deferred = Q.defer();

        console.log('makeRequest to url: ', url);

        var req = makeRequest(url);

        req.then(function(data){
            deferred.resolve(data);
        }, function (error){
            //ignore article errors
            deferred.resolve(false);
        });

        return deferred.promise;
    }

    function getArticles(articles){
        var promises = [];
        for (var i = articles.length - 1; i >= 0; i--) {
            promises.push(getArticle(articles[i].url));
        }
        return Q.all(promises);

    }

    window.download = {
        makeRequest: makeRequest,
        getArticlesRoot: makeRequest,
        getArticles: getArticles,
        getRoot: getRoot,
        getSection: makeRequest
    };

})( window );