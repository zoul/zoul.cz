function submitPassword() {
    var pwd = document.getElementById("password").value;
    var solutionURL = "solutions/" + md5(pwd) + ".html";
    var container = $('.output');
    container.empty();
    jQuery.ajax({
        url: solutionURL,
        success: function(data) {
            container.html(data);
        },
        error: function() {
            container.html('Nene.');
        },
    });
    return false;
}
