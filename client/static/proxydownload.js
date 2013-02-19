/*global console:true, $:true, RSVP:true  */
;(function (window, undefined) {
    "use strict";

    var articleUrl = "/news/publication/common/searchContents/instance?id=24517&contentType=article";
    var imageUrl = 'http://ap.mnocdn.no/incoming/article7122344.ece/ALTERNATES/w580cFree/sovedekk-xshEl7UtjK.jpg?updated=150220131021';

    function errorFun(){
        console.error('promise root error', arguments);
    }

    function Downloader(){
        var self = this;
        this.localhostUrl = 'http://localhost:8001';
        this.betahostUrlLong = 'http://apitestbeta3.medianorge.no:80';

        this.betahostUrl = 'http://apitestbeta3.medianorge.no';
        this.rootUrl = this.betahostUrl+'/news/';
        this.sectionName = 'sport_bt';
        //this.sectionName = 'frontpage';
        this.articles = [];


    }

    Downloader.prototype.start = function (downloadCallback) {
        var self = this;

        var rootPromise = this.makeRequest(this.rootUrl);

        rootPromise.then(function(data){
            return data.baseURI + data.querySelector('link[rel="sections-common"]').getAttribute('href');
        }).then(function(url){
            return self.makeRequest(url);
        }).then(function(data){
            return self.makeRequest(self.getDeskedLink(data));
        }).then(function(articles){
            var promises = [];
            var entries = articles.querySelectorAll('entry');
            var len = entries.length;
            var entry, article;
            var articlesList = [];

            for (var i = len - 1; i >= 0; i--) {
                entry = entries[i];
                article = parseArticle(entry);
                //one article just return 404 for no reason, ommit it
                if(article.url.indexOf('24486') > -1) {
                    //console.log('ommit this article', articleUrl.indexOf('24486'));
                    continue;
                }

                self.articles.push(article);

                promises.push(self.makeRequest(article.url));

            }

            return RSVP.all(promises);

        }).then(function(allArticles){

            console.log('end', allArticles);
            console.log('end', self.articles);

            for (var i = allArticles.length - 1; i >= 0; i--) {
                var docu = allArticles[i];
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

            if(downloadCallback) downloadCallback(self);

        }, errorFun);

    };

    Downloader.prototype.getDeskedLink = function (data) {

        var identity = data.querySelector('identityLabel[uniqueName="'+this.sectionName+'"]');

        var entry = identity.parentElement.parentElement;
        var desked = entry.querySelector('link[rel="http://www.snd.no/types/relation/desked"]');

        var link = desked.getAttribute('href').replace('{areaLimit}&', '');
        link = link.replace('{offset?}', 0);
        link = link.replace('{limit?}', 100);

        return link;
    };

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

    Downloader.prototype.makeRequest = function(url){
        var promise = new RSVP.Promise();
        var self = this;

        console.log('makeRequest to url: ', url);
        /** UUU tralalala local hacking */
        url = url.replace(this.betahostUrlLong, this.localhostUrl);
        url = url.replace(this.betahostUrl, this.localhostUrl);


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

    window.Downloader = Downloader;

})( window );