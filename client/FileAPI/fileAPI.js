/*global window: false */

var schibsted = {
    FileAPI:function FileAPI(config) {
        "use strict";

        if (!(this instanceof FileAPI)) {
            return new FileAPI();
        }

        // possible values: window.PERSISTENT, window.TEMPORARY
        this.type = config && (config.persistence || window.TEMPORARY);
        // 5MB by default
        this.quota = config && (config.quota || 5 * 1024 * 1024);

        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

        if (!window.requestFileSystem) {
            throw new Error("File API is not supported");
        }
    }
};

schibsted.FileAPI.prototype.errorHandler = function (e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    }


    console.log('Error: ' + msg);

    return msg;
};

schibsted.FileAPI.prototype.usingFilesystem = function (onInitFs) {
    var self = this;

    if (window.webkitStorageInfo) {
        window.webkitStorageInfo.requestQuota(window.PERSISTENT, self.quota, function (grantedBytes) {
            window.requestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, self.errorHandler);
        }, function (e) {
            console.log('Error', e);
        });
    } else {
        window.requestFileSystem(window.PERSISTENT, self.quota, onInitFs, self.errorHandler);
    }
};

schibsted.FileAPI.prototype.readFile = function (config) {
    var self = this;
    var deferred = Q.defer();

    self.usingFilesystem(function (fs) {
        fs.root.getFile(config.name, {}, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    console.log('Read file content: ' + this.result);
//                    config.onSuccess(this.result, e);
                    deferred.resolve(this.result, e);
                };

                reader.readAsText(file);
            }, self.errorHandler);
        }, self.errorHandler);
    });

    return deferred.promise;
};

schibsted.FileAPI.prototype.writeFile = function (config) {
    console.log('writing file using config ' + JSON.stringify(config));
    var self = this;
    var deferred = Q.defer();

    function error(e) {
        var msg = self.errorHandler(e);
        deferred.reject(new Error(msg));
    }

    this.usingFilesystem(function (fs) {
        fs.root.getFile(config.name, {
            create:true,
            exclusive:false
        }, function (fileEntry) {

            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function (e) {
                    deferred.resolve(e);
                };

                fileWriter.onerror = function (e) {
                    deferred.reject(e);
                };

                var blob = new Blob([config.content], {
                    type:config.type
                });

//                fileWriter.seek(fileWriter.length);
//                fileWriter.seek(0);
                fileWriter.write(blob);

            }, error);

        }, error);
    });

    return deferred.promise;

};

function fileWriteSuccess(e) {
    console.log('published file write success event to pubsub ' + e);
}

function fileWriteError(e) {
    console.log('published file write error event to pubsub ' + e);
}

function fileReadSuccess(e) {
    console.log('published file read success event to pubsub ' + e);
}

function fileReadError(e) {
    console.log('published file read error event to pubsub ' + e);
}


//var fileAPI = new schibsted.FileAPI({persistence:window.PERSISTENT, quota:5 * 1024 * 1024});
//
//fileAPI.writeFile({
//    name:"test.txt",
//    content:'This line was generated on ' + new Date() + '\n',
//    type:'text/plain',
//    onSuccess:fileWriteSuccess,
//    onError:fileWriteError
//});
//
//fileAPI.readFile({
//    name:"test.txt",
//    onSuccess:fileReadSuccess,
//    onError:fileReadError
//});