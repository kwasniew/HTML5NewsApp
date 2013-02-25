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

        $('#saveForOffline').on('click', notifyImageDownloader);
        $('#saveForOffline').on('tap', notifyImageDownloader);
        $('body').swipeDown(notifyImageDownloader);

    }



    window.App = App;

})( window );