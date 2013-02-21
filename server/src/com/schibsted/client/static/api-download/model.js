/*global console:true Download:true PubSub:true Offline:true Crawler:true RSVP:true */

(function(window, undefined){
    "use strict";

    function Model(){
        console.log("Start!");

        this.offline = new Offline();
        //this.download = new Download();
        this.crawler = new Crawler();
    }

    Model.prototype.getArticles = function() {
        var promise = new RSVP.Promise();
        var self = this;

        this.offline.getArticlesPromise().then(function(articles){

            promise.resolve(articles);

        }, function(){

            self.crawler.getArticles().then(function(articles){

                self.offline.addArticles(articles);
                promise.resolve(articles);

            }, function (err) {

                promise.reject(new Error( "no articles" ) );
            });
        });

        return promise;
    };



    window.Model = Model;

})( window );