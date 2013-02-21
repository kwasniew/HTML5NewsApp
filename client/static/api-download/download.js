/*global console:true, $:true, RSVP:true  */

(function (window, undefined) {
    "use strict";

    var betahostUrl = 'http://apitestbeta3.medianorge.no';
    var rootUrl = betahostUrl+'/news/';


    function makeRequest(url){
        var promise = new RSVP.Promise();

        console.log('makeRequest to url: ', url);

        $.ajax({
            url: url,
            dataType: "xml",
            headers: {
                'accept':"application/atom+xml"
            },
            success: function(data){
                //console.log('makeRequest ok', data);
                promise.resolve( data );
            },
            error: function(xhr, type){
                console.error('makeRequest root error');
                promise.reject(new Error( arguments ) );
            }
        });

        return promise;
    }

    function getRoot() {
        return makeRequest(rootUrl);
    }

    function getArticle(url){
        var promise = new RSVP.Promise();

        console.log('makeRequest to url: ', url);

        var req = makeRequest(url);

        req.then(function(data){
            promise.resolve(data);
        }, function (error){
            //ignore article errors
            promise.resolve(false);
        });

        return promise;
    }

    function getArticles(articles){
        var promises = [];
        for (var i = articles.length - 1; i >= 0; i--) {
            promises.push(getArticle(articles[i].url));
        }
        return RSVP.all(promises);

    }

    window.download = {
        makeRequest: makeRequest,
        getArticlesRoot: makeRequest,
        getArticles: getArticles,
        getRoot: getRoot,
        getSection: makeRequest
    };

})( window );