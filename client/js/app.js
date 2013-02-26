/*global console:true Downloader:true PubSub:true View:true Articles:true $:true
schibsted:true */

(function(window, undefined){
    "use strict";

    function App(){
        console.log("Start!");

        this.articles = new Articles();
        this.view = new View();
        this.articles.getArticles()
        .then(
            this.view.thenViewArticles,
            this.view.thenViewError
        )
        .done();

        function notifyImageDownloader(){
            schibsted.images.startOffline();
        }

        var self = this;
        function notifyClear(){
            self.articles.clearOffline();
        }



        $('#saveForOffline').on('click', notifyImageDownloader);
        $('#saveForOffline').on('tap', notifyImageDownloader);
        $('body').swipeDown(notifyImageDownloader);

        $('#clearOffline').on('click', notifyClear);
        $('#clearOffline').on('tap', notifyClear);

    }



    window.App = App;

})( window );