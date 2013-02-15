/*global console:true Downloader:true PubSub:true */
;(function(window, undefined){
    "use strict";

    function App(){

    }

    App.prototype.start = function () {
        console.log("Start!");

        var title = document.createElement('h1');

        this.downloader = new Downloader();
        this.downloader.start();

        PubSub.subscribe( "downloaded:articles", function(){
            console.log('downloaded:articles', arguments);
        } );

        PubSub.subscribe( "downloaded:articles-list", function(name, articles){
            console.log('downloaded:articles-list', arguments);
            var entry, img, h2, div;
            var articlesList = articles.list;

            var len = articlesList.length;
            for (var i = len - 1; i >= 0; i--) {

                entry = articlesList[i];

                img = new Image();
                img.onload = entry.img;
                img.src = entry.img;
                div = document.createElement('div');
                h2 = document.createElement('h2');
                h2.innerHTML = entry.title;
                div.appendChild(h2);
                div.appendChild(img);

                document.body.appendChild(div);

            }

        } );


        window.downloader = this.downloader;

    };

    window.App = App;

})( window );