function submitPassword() {
    var checkpointCode = document.getElementById("checkpoint").value;
    var password = document.getElementById("password").value;
    var token = checkpointCode + "#" + password;
    var solutionURL = "solutions/" + md5(token) + ".html";
    var container = $('.output');
    container.html('Zkouším…');
    jQuery.ajax({
        url: solutionURL,
        success: function(data) {
            container.html(data);
        },
        error: function() {
            container.html('Máte špatně kód stanoviště, heslo, nebo obojí.');
        },
    });
    return false;
}

$(document).ready(function() {
    $('#checkpoint').focus();
})
