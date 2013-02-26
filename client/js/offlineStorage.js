/*global console:true Q:true */

(function (window, undefined) {
    "use strict";

    var noCompression = true;

    function OfflineStorage(){
        var self = this;
        this.db = undefined;


        this.start(function(){
            console.log("offline started");
        },function(){
            console.log("offline error");
        });


        //this.clearDB();
    }

    function dbError(){
        console.log('offline db error', arguments);
    }

    /* websql ft: b=e?window.openDatabase('fthtml5app','','FT HTML5 App Content',41943040) */
    // 41943040 == 40 * 1024 * 1024   ~ 40MB
    OfflineStorage.prototype.start = function(successCallback, errorCallback){

        var db;

        console.log('offline start');
         try{
                this.db = openDatabase('articles5', '', 'aftenposten database', (40 * 1024 * 1024) );
                db = this.db;
         }catch(e){
             console.log('catched e', e);
             console.error(e);
             errorCallback();
             return;
         }

        function migration1(t){
            console.log('migrate to 1', db);
            t.executeSql('CREATE TABLE IF NOT EXISTS Articles(url TEXT PRIMARY KEY, date TIMESTAMP, title TEXT, bodytext TEXT, img TEXT, compressedbase BLOB)');

        }

        console.log('create callback', db, this.db);

        if(db.version === ""){
            db.changeVersion('', '1', function (t) {
                migration1(t);
            }, dbError, successCallback);
        }else{
            successCallback();
        }

    };

    function compress(s) {
        if(noCompression) return s;
        var i, l, out='';
        if (s.length % 2 !== 0) s += ' ';
        for (i = 0, l = s.length; i < l; i+=2) {
            out += String.fromCharCode((s.charCodeAt(i)*256) + s.charCodeAt(i+1));
        }
        // Add a snowman prefix to mark the resulting string as encoded (more on this later)
        return String.fromCharCode(9731)+out;
    }

    function decompress(s) {
        if(noCompression) return s;
        var i, l, n, m, out = '';

        // If not prefixed with a snowman, just return the (already uncompressed) string
        if (s.charCodeAt(0) !== 9731) return s;

        for (i = 1, l = s.length; i < l; i++) {
            n = s.charCodeAt(i);
            m = Math.floor(n/256);
            out += String.fromCharCode(m, n%256);
        }
        return out;
    }

    function toArray(data){
        var output = [];
        // HACK Convert row object to an array to make our lives easier
        for (var i = 0, l = data.length; i < l; i = i + 1) {
            output.push(data.item(i));
        }
        return output;
    }

    OfflineStorage.prototype.addArticles = function(articles){
        var self = this;
        articles.map(self.addArticle.bind(self));
    };

    OfflineStorage.prototype.addArticle = function(article){
        var db = this.db;
        //TODO this should be done after success of changeVersion....
        // console.log('before adding', db);

        db.transaction(function (tx) {
            // console.log('insert into articles', db, tx);
            // url: articleUrl, img: articleImage, title
            tx.executeSql('INSERT INTO Articles (url, date, title, bodytext, img, compressedbase) VALUES (?, ?, ?, ?, ?, ?)',
                [article.url, article.lastModified, article.title, article.bodytext, article.img, compress(article.base)],
                function(tx, resultSet){
                    console.log('saved article', arguments);
                },function(){
                     console.log("error: cant add article", arguments);
                });
        });

    };

    OfflineStorage.prototype.updateArticleBase = function(article){
        var db = this.db;
        //TODO this should be done after success of changeVersion....
        // console.log('before adding', db);
        //


        db.transaction(function (tx) {
            tx.executeSql('UPDATE Articles SET compressedbase = ? WHERE url = ?',
                [compress(article.base), article.url],
                function(tx, resultSet){
                    console.log('saved article', arguments);
                },function(){
                     console.log("error: cant add article", arguments);
                });
        });

    };

    OfflineStorage.prototype.clearDB = function() {
        var db = this.db;
        db.transaction(function (tx) {
            console.log('delete data', db, tx);
            tx.executeSql('DELETE FROM Articles');
        });

    };



    OfflineStorage.prototype.getArticles = function(successCallback){
        var db = this.db;
        db.readTransaction(function(tx){
            //SELECT city as cityname, currency as currency FROM places, currency where places.country = currency.country
            tx.executeSql('SELECT * FROM Articles LIMIT 80', [], function (tx, results) {
                var result = toArray(results.rows);

                result.forEach(function(article){
                    article.base = decompress(article.compressedbase);
                });

                successCallback(result);


            }, function(){
                //console.log('not selected?', arguments);
                successCallback([]);
            });
        });

    };

    OfflineStorage.prototype.getArticlesPromise = function(){
        var deferred = Q.defer();
        this.getArticles(function(data){
            if(data.length)
                deferred.resolve(data);
            else
                deferred.reject('empty db');
        });
        return deferred.promise;
    };

    window.OfflineStorage = OfflineStorage;

}(this));

