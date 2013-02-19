/*global window: false */

var schibsted = {
    FileAPI:function FileAPI(config) {
        "use strict";

        if (!(this instanceof FileAPI)) {
            return new FileAPI();
        }

        this.type = config && (config.persistence || window.TEMPORARY); // possible values: PERSISTENT, TEMPORARY
        this.quota = config && (config.quota || 5 * 1024 * 1024); // 5MB by default

        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
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

    self.usingFilesystem(function (fs) {
        fs.root.getFile(config.name, {}, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    console.log('Read file content: ' + this.result);
                    config.onSuccess(e);
                };

                reader.readAsText(file);
            }, self.errorHandler);
        }, self.errorHandler);
    });
};

schibsted.FileAPI.prototype.writeFile = function (config) {
    console.log('writing file using config ' + JSON.stringify(config));
    var self = this;

    this.usingFilesystem(function (fs) {
        fs.root.getFile(config.name, {
            create:true,
            exclusive:false
        }, function (fileEntry) {

            console.log("created file " + fileEntry.fullPath);

            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function (e) {
                    console.log('Write completed');
                    config.onSuccess(e);
                };

                fileWriter.onerror = function (e) {
                    console.log('Write failed: ' + e.toString());
                    config.onError(e);
                };

                var blob = new Blob([config.content], {
                    type:config.type
                });

                fileWriter.seek(fileWriter.length);
                fileWriter.write(blob);

            }, self.errorHandler);

        }, self.errorHandler);
    });

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


var fileAPI = new schibsted.FileAPI({persistence:window.PERSISTENT, quota:5 * 1024 * 1024});

fileAPI.writeFile({
    name:"test.txt",
    content:'This line was generated on ' + new Date() + '\n',
    type:'text/plain',
    onSuccess:fileWriteSuccess,
    onError:fileWriteError
});

fileAPI.readFile({
    name:"test.txt",
    onSuccess:fileReadSuccess,
    onError:fileReadError
});
