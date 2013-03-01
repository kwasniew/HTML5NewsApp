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
        h1.className = 'alert alert-error';
        h1.innerText = "no articles, check internet connection";
        document.body.appendChild(h1);
    };

    View.prototype.viewArticles = function(name, articles){
        console.log('View:viewArticles', arguments);
        var entry, img, h2, div, text, footer, date;
        var articlesList = articles;

        var len = articlesList.length;
        for (var i = len - 1; i >= 0; i--) {

            entry = articlesList[i];

            div = document.createElement('div');
            //div.className = "media well";
            div.className = "well";

            img = new Image();
            img.onload = entry.img;
            img.src = entry.base ? entry.base : entry.img;
            //img.className = 'media-object';

            h2 = document.createElement('h2');
            h2.innerHTML = entry.title;
            //h2.className = 'media-heading';

            text = document.createElement('div');
            text.innerHTML = entry.bodytext;

            footer = document.createElement('footer');
            date = entry.published.split('T')[0] ?
                entry.published.split('T')[0] : entry.published;
            footer.innerText = 'Published: ' + date;

            //text.className = 'media-body';

            div.appendChild(h2);
            div.appendChild(img);
            div.appendChild(text);
            div.appendChild(footer);

            document.querySelector('.articleList').appendChild(div);

        }

    };

    window.View = View;

})(window);