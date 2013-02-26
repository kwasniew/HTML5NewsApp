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

        this.offlineStorage.getArticlesPromise()
        .done(function(articles){

            deferred.resolve(articles);

        }, function(){

            var artPromise = self.crawler.getArticles();
            artPromise.then(self.offlineStorage.addArticles.bind(self.offlineStorage));
            artPromise.then(deferred.resolve);
            //artPromise.then(schibsted.images.startOffline);
            artPromise.fail(function (err) {
                deferred.reject(new Error( "no articles" ) );
            });
            artPromise.done();

        });

        return deferred.promise;
    };

    Articles.prototype.clearOffline = function(){
        this.offlineStorage.clearDB();
    };



    window.Articles = Articles;

})( window );