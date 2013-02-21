/*global console:true, $:true, RSVP:true  */

(function (window, undefined) {
    "use strict";

    var articleUrl = "/news/publication/common/searchContents/instance?id=24517&contentType=article";
    var imageUrl = 'http://ap.mnocdn.no/incoming/article7122344.ece/ALTERNATES/w580cFree/sovedekk-xshEl7UtjK.jpg?updated=150220131021';

    function errorFun(){
        console.error('promise root error', arguments);
    }

    function Download(){
        var self = this;

        this.betahostUrl = 'http://apitestbeta3.medianorge.no';
        this.rootUrl = this.betahostUrl+'/news/';
        this.sectionName = 'sport_bt';
        //this.sectionName = 'frontpage';
        this.articles = [];

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

    Download.prototype.getArticles = function(){
        var promise = new RSVP.Promise();

        this.start(function(data){
            promise.resolve(data.articles);
        });

        return promise;

    };

    Download.prototype.start = function (downloadCallback) {
        var self = this;

        var rootPromise = this.makeRequest(this.rootUrl);

        rootPromise.then(function(data){
            return data.baseURI + data.querySelector('link[rel="sections-common"]').getAttribute('href');
        }).then(function(sectionUrl){
            return self.makeRequest(sectionUrl);
        }).then(function(data){
            return self.makeRequest(self.getDeskedLink(data));
        })
        .then(parseArticlesXML)
        .then(function (articles){
            self.articles = articles;
            return articles;

        }).then(function(articles){
            var promises = [];
            for (var i = articles.length - 1; i >= 0; i--) {
                promises.push(self.getArticle(articles[i].url));
            }
            return RSVP.all(promises);

        }).then(function(allArticles){

            console.log('end', allArticles);
            console.log('end', self.articles);

            for (var i = allArticles.length - 1; i >= 0; i--) {
                var docu = allArticles[i];
                if(!docu){
                    //ommit broken articles
                    self.articles[i] = false;
                    continue;
                }
                var item = self.articles[i];

                if(docu.documentURI == item.url){
                    console.log('urls are the same', docu.documentURI, i);
                }else{
                    console.error('urls are different!!!', docu.documentURI, item.url, i);
                }

                item.bodytext = docu.querySelector('[name="bodytext"] div').innerHTML;
                item.lastModified = docu.lastModified;
                item.docu = docu;
            }

            return self;

        }).then(function(self){

            self.articles = self.articles.filter(function(element){
                return !!element;
            });

            if(downloadCallback) downloadCallback(self);

        }, errorFun);

    };

    Download.prototype.getDeskedLink = function (data) {

        var identity = data.querySelector('identityLabel[uniqueName="'+this.sectionName+'"]');

        var entry = identity.parentElement.parentElement;
        var desked = entry.querySelector('link[rel="http://www.snd.no/types/relation/desked"]');

        var link = desked.getAttribute('href').replace('{areaLimit}&', '');
        link = link.replace('{offset?}', 0);
        link = link.replace('{limit?}', 100);

        return link;
    };



    Download.prototype.makeRequest = function(url){
        var promise = new RSVP.Promise();
        var self = this;

        console.log('makeRequest to url: ', url);

        $.ajax({
            url: url,
            dataType: "xml",
            headers: {
                'accept':"application/atom+xml"
            },
            success: function(data){
                //console.log('makeRequest ok', data);
                promise.resolve( data );
            },
            error: function(xhr, type){
                console.error('makeRequest root error');
                promise.reject(new Error( arguments ) );
            }
        });

        return promise;
    };

    Download.prototype.getArticle = function(url){
        var promise = new RSVP.Promise();
        var self = this;

        console.log('makeRequest to url: ', url);

        var req = this.makeRequest(url);

        req.then(function(data){
            promise.resolve(data);
        }, function (error){
            //ignore article errors
            promise.resolve(false);
        });

        return promise;
    };

    window.Download = Download;

})( window );