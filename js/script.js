$(document).ready(function() {
    $('header').load('html/header.html');
    $('main').load('html/main.html', function() {$.getScript('js/main.js');});
    $('footer').load('html/footer.html');
});

