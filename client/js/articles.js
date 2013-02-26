/*global console:true Download:true PubSub:true OfflineStorage:true Crawler:true Q:true */

(function(window, undefined){
    "use strict";

    function Articles(){
        console.log("Start!");

        this.offlineStorage = new OfflineStorage();

        this.crawler = new Crawler();
    }

    Articles.prototype.getArticles = function() {
        var deferred = Q.defer();
        var self = this;

        this.offlineStorage.getArticlesPromise().then(function(articles){

            deferred.resolve(articles);

        })
        .fail(function(){
            console.log('empty dB');
            self.crawler.getArticles().then(function(articles){

                console.log('crewler downloaded articles', articles);

                self.offlineStorage.addArticles(articles);

                deferred.resolve(articles);

            })
            .fail(function (err) {
                deferred.reject(new Error( "no articles" ) );
            });

            console.log('empty dB');
        }).fail(function () {
            console.error('error model', arguments);

            deferred.reject(new Error( "crawler error" ) );
        });

        return deferred.promise;
    };

    Articles.prototype.clearOffline = function(){
        this.offlineStorage.clearDB();
    };



    window.Articles = Articles;

})( window );