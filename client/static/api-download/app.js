/*global console:true Downloader:true PubSub:true Offline:true Show:true Model:true */

(function(window, undefined){
    "use strict";

    function App(){
        console.log("Start!");

        this.model = new Model();
        this.show = new Show();

        this.model.getArticles()
        .then(
            this.show.thenShowArticles,
            this.show.thenShowError
            );

    }



    window.App = App;

})( window );