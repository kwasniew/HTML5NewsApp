/*global console:true Downloader:true PubSub:true View:true Articles:true
schibsted:true */

(function(window, undefined){
    "use strict";

    function App(articles, view){
        console.log("Start!");

        this.articles = articles;
        this.view = view;
        this.articles.getArticles()
        .then(
            this.view.showArticles,
            this.view.showError
        )
        .done();

        function notifyImageDownloader(){
            schibsted.images.startOffline();
        }

        var self = this;
        function notifyClear(){
            self.articles.clearOffline();
        }


        view.registerImageDownload(notifyImageDownloader);
        view.registerClearDB(notifyClear);

    }


    window.schibsted = window.schibsted || {};
    window.schibsted.App = App;

})( window );