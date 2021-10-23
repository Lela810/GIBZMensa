chrome.runtime.onInstalled.addListener(function() {
    const currentDate = (new Date());
    let month;
    if (currentDate.getMonth() < 10) {
        month = ('0' + currentDate.getMonth())
    } else {
        month = currentDate.getMonth()
    }
    const apiDate = (currentDate.getFullYear() + '-' + month + '-' + currentDate.getDate())
    const url = ('https://gibzmensa.lklaus.ch/api/v1/?date=' + apiDate)

    try {
        const api = fetch(url);
        const menu = api.json();
        console.log(menu)
    } catch {

    }

});