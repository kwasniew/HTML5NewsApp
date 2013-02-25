
(function (window) {

    //var imageEncoder = 'http://localhost:8005/?url=';
    var imageEncoder = 'http://tuxtest4.medianorge.no:34407/encoding';
    //var imageEncoder = 'http://192.168.20.169:8181/encoding';

    function startOffline(){

        var offlineStorage = new OfflineStorage();
        offlineStorage.getArticles(function(articles){

            articles.forEach(function(article){

                schibsted.download.makeRequest({
                    url: imageEncoder,
                    type: 'GET',
                    data: { source: encodeURI(article.img) },
                    dataType: "text",
                    headers: {}
                })
                .then(function(base){
                    //console.log(article, base);
                    article.base = base;
                    var text = base.substr(0, 40);
                    if(text.indexOf('html') !== -1){
                        console.log(article.url);
                        console.log(text);
                        console.log(article.img);
                    }
                    offlineStorage.updateArticleBase({url: article.url, base: base});
                })
                .done();

            });
        });

    }

    window.schibsted = window.schibsted || {};
    window.schibsted.images = {
        startOffline: startOffline
    };



}(this));