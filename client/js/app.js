/*global console:true Downloader:true PubSub:true View:true Articles:true */

(function(window, undefined){
    "use strict";

    function App(){
        console.log("Start!");

        this.articles = new Articles();
        this.view = new View();

        try{
        this.articles.getArticles()
        .then(
            this.view.thenViewArticles,
            this.view.thenViewError
        )
        .done();
    }catch(e){
        console.error(e);
    }

    }



    window.App = App;

})( window );