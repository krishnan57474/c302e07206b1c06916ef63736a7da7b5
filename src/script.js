(function () {
    "use strict";

    var camera = (function () {
        function camera() {}

        camera.getPicture = function (callback) {
            if (!navigator.camera) {
                callback("");
                return;
            }

            navigator.camera.getPicture(function (data) {
                callback("data:image/jpeg;base64," + data);
            }, function () {
                callback("");
            },
            {
                destinationType: Camera.DestinationType.DATA_URL
            });
        };

        return camera;
    })();

    var message = (function () {
        function message(iawin) {
            var obj = this;

            this.iawin = iawin;

            iawin.addEventListener("message", function (e) {
                if (e.type !== "message" || !e.data || !e.data.action) {
                    return;
                }

                obj.action(e.data);
            });
        }

        message.prototype = {
            action: function (data) {
                var obj = this;

                switch (data.action) {
                    case "getPicture": {
                        camera.getPicture(function (image) {
                            obj.send({
                                action: data.action,
                                data: image
                            });
                        });

                        break;
                    }
                }
            },
            send: function (data) {
                var msg = "(window._iap = window._iap || []).push(";
                msg += JSON.stringify(data);
                msg += ");";

                this.iawin.executeScript({
                    code: msg
                });
            }
        };

        return message;
    }());

    function init() {
        var url = atob("aHR0cHM6Ly93d3cuYnJpdGVzb2x1dGlvbi5jb20v"),
        iawin = window.open(url, "_blank", "location=no,clearcache=yes,zoom=no,footer=no"),
        error = false;

        new message(iawin);

        iawin.addEventListener("loaderror", function () {
            error = true;
            navigator.splashscreen.show();
            iawin.close();
        });

        iawin.addEventListener("exit", function () {
            navigator.splashscreen.show();

            if (!error) {
                navigator.notification.confirm("Confirm close", function (exit) {
                    if (exit === 1) {
                        navigator.app.exitApp();
                    } else {
                        location.reload();
                    }
                }, "Confirm");
            } else {
                document.querySelector("#error").classList.remove("hide");
            }

            navigator.splashscreen.hide();
        });
    }

    init();
}());
