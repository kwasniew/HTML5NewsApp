/*global console:true Download:true PubSub:true Offline:true Crawler:true Q:true */

(function(window, undefined){
    "use strict";

    function Model(){
        console.log("Start!");

        this.offline = new Offline();
        this.offline.clearDB();
        //this.download = new Download();
        this.crawler = new Crawler();
    }

    Model.prototype.getArticles = function() {
        var deferred = Q.defer();
        var self = this;

        this.offline.getArticlesPromise().then(function(articles){

            deferred.resolve(articles);

        }, function(){
            console.log('empty dB');
            self.crawler.getArticles().then(function(articles){

                console.log('crewler downloaded articles', articles);
                deferred.resolve(articles);

                self.offline.addArticles(articles);

            }, function (err) {

                deferred.reject(new Error( "no articles" ) );
            });
            console.log('empty dB');
        }).fail(function () {
            console.error('error model', arguments);

            deferred.reject(new Error( "crawler error" ) );
        });

        return deferred.promise;
    };



    window.Model = Model;

})( window );