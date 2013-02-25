/*global console:true Downloader:true PubSub:true Offline:true View:true Model:true */

(function(window, undefined){
    "use strict";

    function App(){
        console.log("Start!");

        this.model = new Model();
        this.view = new View();

        try{
        this.model.getArticles()
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