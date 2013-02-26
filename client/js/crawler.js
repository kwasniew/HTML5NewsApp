/*global console:true, download:true Q:true */

(function (window, undefined) {
    "use strict";

    var articleUrl = "/news/publication/common/searchContents/instance?id=24517&contentType=article";
    var imageUrl = 'http://ap.mnocdn.no/incoming/article7122344.ece/ALTERNATES/w580cFree/sovedekk-xshEl7UtjK.jpg?updated=150220131021';

    var betahostUrl = 'http://apitestbeta3.medianorge.no';
    var rootUrl = betahostUrl+'/news/';

    var download;

    function Crawler(){
        this.sectionName = 'sport_bt';
        //this.download = Download;
        download = window.schibsted.download;
    }



    function filterArticles(data){
            data.articles = data.articles.filter(function(element){
                return !!element;
            });

            console.log('CRAWLER succedded', data.articles);

            return data.articles;
    }

    function parseArticle(entry){
        var articleImage, elId, elImg, title;

        function getByName( from, target, srcName, targetName){
            if(!targetName) targetName = srcName;
            srcName = srcName.replace(':', '\\:');
            target[targetName] = from.querySelector(srcName) ? from.querySelector(srcName).textContent : '';
        }
        var result = {};
        var get = getByName.bind(null, entry, result);

        elImg = entry.querySelector('link[type^="image"]');
        articleImage = (elImg && elImg.getAttribute('href')) ? elImg.getAttribute('href') : imageUrl;
        articleImage = articleImage.replace('{snd:mode}/{snd:cropversion}', 'ALTERNATES/w380c34');
        result.img = articleImage;

        get('id', 'url');
        get('title');
        get('published');
        get('updated');
        get('snd:deskedMode', 'deskedMode');

        return result;
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

    Crawler.prototype.getRoot = function(){
        return download.getRoot(rootUrl)
        .then(parseRoot);
    };

    Crawler.prototype.getArticles = function() {
        var self = this;

        return this.getRoot()
        .then(download.getSection)
        .then(this.getDeskedLink.bind(this))
        .then(download.getArticlesRoot)
        .then(parseArticlesXML)
        .then(this.saveArticlesList.bind(this))
        .then(download.getArticles)
        .then(this.mapArticles.bind(this))
        .then(filterArticles);
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