(function () {
    "use strict";

    function init() {
        var url = atob("aHR0cHM6Ly93d3cuYnJpdGVzb2x1dGlvbi5jb20v"),
        iawin = window.open(url, "_blank", "location=no,clearcache=yes,zoom=no,footer=no"),
        error = false;

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
