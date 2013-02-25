/*global console:true */

(function(window, undefined){
    "use strict";

    function View(){
        console.log("Start!");
    }

    View.prototype.thenViewArticles = function(articles){
        console.log('View:thenViewArticles', arguments);
        View.prototype.viewArticles('then', articles);
    };

    View.prototype.thenViewError = function(articles){
        var h1 = document.createElement('h1');
        h1.innerText = "no articles, check internet connection";
        document.body.appendChild(h1);
    };

    View.prototype.viewArticles = function(name, articles){
        console.log('View:viewArticles', arguments);
        var entry, img, h2, div, text;
        var articlesList = articles;

        var len = articlesList.length;
        for (var i = len - 1; i >= 0; i--) {

            entry = articlesList[i];

            img = new Image();
            img.onload = entry.img;
            img.src = entry.base ? entry.base : entry.img;
            div = document.createElement('div');
            h2 = document.createElement('h2');
            h2.innerHTML = entry.title;
            div.appendChild(h2);
            div.appendChild(img);

            text = document.createElement('div');
            text.innerHTML = entry.bodytext;

            div.appendChild(text);

            document.body.appendChild(div);

        }

    };

    window.View = View;

})(window);