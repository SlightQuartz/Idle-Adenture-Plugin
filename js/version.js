﻿var VersionID = "v0.87"
var updatelog;
function CheckVersion() {
    $("#versionID").html(VersionID);
    if (newVersionID != VersionID) {
        $("#updateModal .modal-body").html("Last Version: " + newVersionID);
        $("#updateModal").modal('show');
    }
}
function UpdateLog() {
    updatelog = $.get("http://raw.githack.com/SlightQuartz/Idle-Adenture-Plugin/" + versionLogID + "/README.md", function () {
        $("#updateLog").html(marked(updatelog.responseText));
    });
}