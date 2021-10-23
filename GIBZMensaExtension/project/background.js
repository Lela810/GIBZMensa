chrome.runtime.onInstalled.addListener(async() => {

    const currentDate = (new Date());

    const today = currentDate.getDate();

    let tomorrow = (new Date())
    tomorrow.setDate(currentDate.getDate() + 1)
    tomorrow = tomorrow.getDate()

    let theDayAfterTomorrow = (new Date())
    theDayAfterTomorrow.setDate(currentDate.getDate() + 2)
    theDayAfterTomorrow = theDayAfterTomorrow.getDate()

    let month = (currentDate.getMonth() + 1);
    if (month < 10) {
        month = ('0' + month)
    }

    const apiDates = [
        (currentDate.getFullYear() + '-' + month + '-' + today),
        (currentDate.getFullYear() + '-' + month + '-' + tomorrow),
        (currentDate.getFullYear() + '-' + month + '-' + theDayAfterTomorrow)
    ];

    chrome.storage.local.set({
        'apiDates': apiDates
    });

    chrome.storage.local.set({
        'month': month
    });

    apiDates.forEach(async(apiDate) => {
        const url = ('https://gibzmensa.lklaus.ch/api/v1/?date=' + apiDate)

        try {
            console.log('url ' + url + ' requested')
            const api = await fetch(url);
            const menu = await api.json();
            chrome.storage.local.set({
                [apiDate]: menu
            });

        } catch (err) {
            console.error(err);
        }
    });


});