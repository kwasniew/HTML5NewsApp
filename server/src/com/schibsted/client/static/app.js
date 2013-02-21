/*global console:true Downloader:true PubSub:true Offline:true Show:true */

(function(window, undefined){
    "use strict";

    function App(){
        console.log("Start!");

        this.offline = new Offline();
        this.downloader = new Downloader();
        this.show = new Show();

        this.bindDownload();
        this.bindShow();
        this.bindOffline();

        PubSub.publish( 'get:articles' );

        window.downloader = this.downloader;
    }

    App.prototype.bindOffline = function() {
        var self = this;
        PubSub.subscribe( "downloaded:articles", function(name, articles){
            self.offline.addArticles(articles);
        });
        PubSub.subscribe( "clear:db", function(name, articles){
            self.offline.clearDB();
        });
        PubSub.subscribe( "get:articles", function(name){
            //todo check articles
            self.offline.getArticles(function(articles){
                if(articles.length){
                    PubSub.publish( 'show:articles', articles);
                }else{
                    PubSub.publish( 'no:articles', articles);
                }
            });
        });
    };

    App.prototype.bindShow = function() {
        var self = this;
        PubSub.subscribe( "downloaded:articles", self.show.showArticles );
        PubSub.subscribe( "show:articles", self.show.showArticles );
    };

    App.prototype.bindDownload = function() {
        var self = this;
        var downloadCallback = function(data){
            PubSub.publish( "downloaded:articles", data.articles );
        };
        PubSub.subscribe( "no:articles", function(name, articles){
            console.log('no:articles', arguments);
            self.downloader.start(downloadCallback);
        });
    };

    window.App = App;

})( window );