// Main.js is the principal "controller" of the application
// a controller represents the "business logic of the application"
// we load the various javascript "dependencies" here in the -order- that they need to be loaded
// this ensures that we have everything loaded appropriately

// created by Edward Apostol
// last revised November 2019.
// subject to MIT license.

var LoaderJS = (function (urlsToLoad, callbackFns, locationsToPlaceScript) {
    // loaderJS takes a url. creates a script tag, and attaches it to the DOM; it returns true once the script is loaded
    // the good thing is that you don't need jquery or promises or whatnot. its really simple.

    var urls = urlsToLoad;
    var callbacks = callbackFns;
    var locations = locationsToPlaceScript;

    var loaderJSObj = {
        name: "loaderJSObj",
        urls: urls,
        locations: locations,
        result: null,
        callbacks: callbacks,

        _getContents: function (file) {
            var xhr = new XMLHttpRequest();
            var result = null;
            xhr.open('get', file, false, null, null);
            xhr.onreadystatechange = function (e) {
                var currentState = this.readyState;
                var currentStatus = this.status;
                switch (currentState) {
                    case 0:
                        break;
                    case 1:
                        console.log('connection to server established');
                        break;
                    case 2:
                        console.log('server has received request for data');
                        break;
                    case 3:
                        console.log('processing request');
                        break;
                    case 4:
                        console.log('request has been processed, response is here');
                        if (currentStatus == 200) {
                            result = this.responseText;
                        }
                        break;
                    default:
                        break;
                }
            };
            xhr.send();
            // return the code
            // console.log('result returned is ... \n', result);
            return result;
            // return xhr.responseText;
        },

        loadUrls: function () {
            var returnedContent, file, scriptTag;
            for (var i = 0; i < this.urls.length; i++) {
                file = this.urls[i];
                returnedContent = this._getContents(file);
                console.log('the content returned from loading the file is \n\n', returnedContent);
                scriptTag = document.createElement('script');
                scriptTag.setAttribute('type', 'text/javascript');
                scriptTag.innerHTML = returnedContent; // yeah it's JS, but when content is returned it's 'text'

                if (typeof scriptTag != "undefined") {
                    document.getElementsByTagName('head')[0].appendChild(scriptTag);
                }
                // check if there are any callbacks for the given javascript file that you loaded
                // it could be a passed function call.
                if (this.callbacks[i] !== null) {
                    this.callbacks[i]();
                }

            }
        },
        init: function () {
            console.log("initializing LoaderJS...");
            return this;
        }
    };
    return loaderJSObj.init();

})();


// reminder: don't proceed until jQuery, bootstrap and other stuff is loaded!
// var Main = (function () {
//     var mainObj = {
//         data: null,
//         init: function () {
//             // this is the constructor function that creates this object
//             // Load your dependencies with LoaderJS above;
//             this._loadDependencies();
//             // after you load your dependencies, do whatever other logic your application needs
//             this._loadInitialData();
//             this._populateGUI();
//             return this;
//         },
//         _loadDependencies: function () {
//             var filesToLoad = [
//                 "js/controllers/API.js",
//                 "js/controllers/SomeOtherController.js"
//             ];
//             // also pass any callbacks that might need to be called after each file is loaded
//             var callBackFns = [
//                 function () {
//                     API.test('API file is loaded!')
//                 },
//                 null
//             ];
//             // send loaderJS all the URLs to load, and the callbacks;
//             LoaderJS.urls = filesToLoad; // this should be a getter/setter...but beyond scope for now
//             LoaderJS.callbacks = callBackFns;
//             // then load the URLs;
//             LoaderJS.loadUrls();
//         },
//         _loadInitialData: function () {
//             // maybe in here I will use the API.js library that I loaded earlier to get data
//             // data = API.getData(url,method,callBack);
//         },
//         _populateGUI: function () {
//             // hypothetical method used to popular various components with the data I retrieved from API

//         },
//         start: function () {
//             // publicly accessible method to start the application.
//         },
//         /* add additional methods here that represent the logic of your app (like adding a user, etc!) */

//     };
//     return mainObj.init();
// })();


// Main.start(); // call the start function to finish "bootstrapping the app" and launch the site.