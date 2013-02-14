/*global console:true */
;(function( window, basket ) {
    'use strict';

    function load(list, itemCallback){
        var items = list.shift();
        if(items){

            basket.require.apply(basket, items).then(function(){
                itemCallback();
                load(list, itemCallback);
            }, function(){

                list.unshift(items);
                for (var i = items.length - 1; i >= 0; i--) {
                    basket.remove(items[i].url);
                }

                console.log('error', this, arguments);

                load(list, itemCallback);
            });
        }else{
            itemCallback();
        }
    }

    var loadItems = function( requiredList, progressCallback) {
        var progress = 0;
        var max = requiredList.length;

        var itemCallback = function(){
            progress++;

            if(progressCallback){

                progressCallback(progress/max);

            }
        };

        load(requiredList, itemCallback);
    };


    window.basketLoader = {
        load: loadItems
    };


})( this, basket );