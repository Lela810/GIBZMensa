chrome.runtime.onInstalled.addListener(async() => {
    const currentDate = (new Date());
    let month;
    if ((currentDate.getMonth() + 1) < 10) {
        month = ('0' + (currentDate.getMonth() + 1))
    } else {
        month = (currentDate.getMonth() + 1)
    }
    const apiDate = (currentDate.getFullYear() + '-' + month + '-' + (currentDate.getDate() - 1)) // TODO: remove -1 
    const url = ('https://gibzmensa.lklaus.ch/api/v1/?date=' + apiDate)

    try {
        const api = await fetch(url);
        const gibz = await api.json();
        chrome.storage.local.set(gibz);

    } catch (err) {
        console.error(err);
    }

});