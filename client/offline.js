/*global console:true, $:true, RSVP:true */
;(function (window, undefined) {
    "use strict";

    function Offline(){
        PubSub.subscribe( "downloaded:articles-list", function(name, articles){
            console.log('downloaded:articles-list and store offline', arguments);

            var articlesList = articles.list;

        });
    }

    var db;

    function dbError(){
        console.log('db error', arguments);
    }

    /* websql ft: b=e?window.openDatabase('fthtml5app','','FT HTML5 App Content',41943040) */
    // 41943040 == 40 * 1024 * 1024   ~ 40MB
    function start(successCallback, errorCallback){


        console.log('start');
         try{
            if(false && window.sqlitePlugin){
                console.log('sqlitePlugin');
                db = window.sqlitePlugin.openDatabase('test-db7', '', 'aftenposten database', (40 * 1024 * 1024) );
            }else{
                db = openDatabase('test-db7', '', 'aftenposten database', (40 * 1024 * 1024) );
            }
         }catch(e){
             console.log('catched e', e);
             console.error(e);
             errorCallback();
             return;
         }


        function migration1(t){
            //console.log('first version', db);
            t.executeSql('CREATE TABLE IF NOT EXISTS foo (id INTEGER PRIMARY KEY ASC, name TEXT)');
        }
        function migration2(t){
            //console.log('migrate to 1.1', db);
            t.executeSql('CREATE TABLE IF NOT EXISTS Articles(id INTEGER PRIMARY KEY ASC, date TIMESTAMP, headline TEXT, body TEXT)');
            t.executeSql('CREATE TABLE IF NOT EXISTS ArticleImages(id INTEGER PRIMARYKEY KEY ASC, base BLOB, alt TEXT, artid INTEGER)');

        }

        function changeVersionTo2(){
            console.log('before 2', db);
            db.changeVersion('1', '2', function (t) {
                migration2(t);
            }, dbError, successCallback);
        }

        console.log('create callback', db);

        if(db.version === ""){
            db.changeVersion('', '1', function (t) {
                migration1(t);
            }, dbError, function(){
                changeVersionTo2();
            });
        }else if(db.version === '1'){
            changeVersionTo2();
        }else{
            successCallback();
        }

    }

    window.Offline = Offline;

}(this));

