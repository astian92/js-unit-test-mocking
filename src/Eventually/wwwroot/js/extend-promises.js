
function PromiseWrapper(promise) {
    var self = this;
    self.promise = promise;
    self.done = function (successCallback) {
        self.promise.then(successCallback, function () { });
        return self;
    }
    self.fail = function (errorCallback) {
        self.promise.then(function () { }, errorCallback);
        return self;
    }
}