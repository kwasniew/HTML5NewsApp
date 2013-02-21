/*global console:true, download:true RSVP:true */

(function (window, undefined) {
    "use strict";

    var articleUrl = "/news/publication/common/searchContents/instance?id=24517&contentType=article";
    var imageUrl = 'http://ap.mnocdn.no/incoming/article7122344.ece/ALTERNATES/w580cFree/sovedekk-xshEl7UtjK.jpg?updated=150220131021';


    function Crawler(){
        this.sectionName = 'sport_bt';
        //this.download = Download;
    }

    Crawler.prototype.getArticles = function() {
        var promise = new RSVP.Promise();

        this.god(function(data){
            promise.resolve(data.articles);
        }, function (err) {
            promise.reject(err);
        });

        return promise;
    };

    function filterArticles(data){
            data.articles = data.articles.filter(function(element){
                return !!element;
            });

            console.log('CRAWLER succedded', data.articles);

            return data;
    }

    function parseArticle(entry){
        var articleImage, elId, elImg, articleUrl, title;

        elId = entry.querySelector('id');
        //articleUrl = self.betahostUrlLong+articleUrl;
        articleUrl = elId ? elId.textContent : false;

        elImg = entry.querySelector('link[type^="image"]');
        articleImage = imageUrl;
        articleImage = elImg ? elImg.getAttribute('href') : articleImage;

        articleImage = articleImage.replace('{snd:mode}/{snd:cropversion}', 'ALTERNATES/w380c34');

        title = entry.querySelector('title') ? entry.querySelector('title').textContent : 'Empty title';

        return {url: articleUrl, img: articleImage, title: title};
    }

    function parseArticlesXML(articles){

            var entries = articles.querySelectorAll('entry');
            var entry, article;
            var articlesList = [];

            for (var i = entries.length - 1; i >= 0; i--) {
                entry = entries[i];
                article = parseArticle(entry);
                //one article just return 404 for no reason, ommit it
                if(article.url.indexOf('24486') > -1) {
                    //console.log('ommit this article', articleUrl.indexOf('24486'));
                    continue;
                }
                articlesList.push(article);
            }

            return articlesList;

        }


    function parseRoot (data) {
        return data.baseURI + data.querySelector('link[rel="sections-common"]').getAttribute('href');
    }

    Crawler.prototype.god = function(downloadCallback, errorFun){
        var self = this;

        function err(){
            console.error('KABOOM!', arguments);
            errorFun.apply(null, arguments);
        }

        download.getRoot()
        .then(parseRoot)
        .then(download.getSection)
        .then(this.getDeskedLink.bind3(this))
        .then(download.getArticlesRoot)
        .then(parseArticlesXML)
        .then(this.saveArticlesList.bind(this))
        .then(download.getArticles)
        .then(this.mapArticles.bind(this))
        .then(filterArticles)
        .then(downloadCallback, err);
    };

    Crawler.prototype.saveArticlesList = function(articles) {
            this.articles = articles;
            //todo anything in list of articles
            // that is not visible in article itself?
            return articles;
    };

    Crawler.prototype.mapArticles = function(allArticles){
        console.log('end', allArticles);
        console.log('end', this.articles);

        for (var i = allArticles.length - 1; i >= 0; i--) {
            var docu = allArticles[i];
            if(!docu){
                //ommit broken articles
                this.articles[i] = false;
                continue;
            }
            var item = this.articles[i];

            if(docu.documentURI == item.url){
                console.log('urls are the same', docu.documentURI, i);
            }else{
                console.error('urls are different!!!', docu.documentURI, item.url, i);
            }

            item.bodytext = docu.querySelector('[name="bodytext"] div').innerHTML;
            item.lastModified = docu.lastModified;
            item.docu = docu;
        }

        return this;
    };


    Crawler.prototype.getDeskedLink = function(data) {

            var identity = data.querySelector('identityLabel[uniqueName="'+this.sectionName+'"]');

            var entry = identity.parentElement.parentElement;
            var desked = entry.querySelector('link[rel="http://www.snd.no/types/relation/desked"]');

            var link = desked.getAttribute('href').replace('{areaLimit}&', '');
            link = link.replace('{offset?}', 0);
            link = link.replace('{limit?}', 100);

            return link;

    };




    window.Crawler = Crawler;

})( window );