/*global console:true Downloader:true PubSub:true Offline:true Show:true Model:true */

(function(window, undefined){
    "use strict";

    function App(){
        console.log("Start!");

        this.model = new Model();
        this.show = new Show();

        try{
        this.model.getArticles().then(
            this.show.thenShowArticles,
            this.show.thenShowError
        ).fail(this.show.thenShowError);
    }catch(e){
        console.error(e);
    }

    }



    window.App = App;

})( window );