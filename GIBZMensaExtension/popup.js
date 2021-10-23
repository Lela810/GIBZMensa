document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['date', 'menu'], function(storage) {
        const currentDate = (new Date());
        document.getElementById('date').innerHTML = ('<strong>' + currentDate.getDate() + '.' + currentDate.getMonth() + '.' + currentDate.getFullYear() + '</strong>')
        document.getElementById('Tagesmenü').innerHTML = ('<strong>Tagesmenü:</strong> ' + storage.menu.Tagesmenü)
        document.getElementById('Vegimenü').innerHTML = ('<strong>Vegimenü:</strong> ' + storage.menu.Vegimenü)
        document.getElementById('Hit').innerHTML = ('<strong>Hit:</strong> ' + storage.menu.Hit)
    })
});

document.getElementById('gestern').onclick = function(event) {
    if (event === undefined) event = window.event;
    alert("test")
}