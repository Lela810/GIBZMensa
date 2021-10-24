function resetMenu(apiDate) {
    chrome.storage.local.get([apiDate], function(storage) {
        document.getElementById('menu').innerHTML = (`
            <p id="error"></p>
            <p id="Tagesmenü"></p>
            &nbsp;
            <p id="Vegimenü"></p>
            &nbsp;
            <p id="Hit"></p>
             &nbsp;
            <p id="Topping des Tages"></p>
            `);
    })
}

function setMenu(arrayPosition) {
    chrome.storage.local.get(['apiDates', 'month'], function(dates) {
        const apiDate = dates.apiDates[arrayPosition]
        const month = dates.month
        const currentDate = (new Date())

        resetMenu(apiDate);

        chrome.storage.local.get([apiDate], function(storage) {
            document.getElementById('date').innerHTML = ('<strong>' + (currentDate.getDate() + arrayPosition) + '.' + month + '.' + currentDate.getFullYear() + '</strong>')
            if (storage[apiDate].hasOwnProperty('error')) {
                document.getElementById('error').innerHTML = (`<strong>Error:</strong> ` + storage[apiDate].error)
            } else {
                for (const menu in storage[apiDate].menu) {
                    document.getElementById(menu).innerHTML = (`<strong>${menu}:</strong> ` + storage[apiDate].menu[menu])
                }
            }

        })
    })
}


function navbarSetActive(navbarElementNumber) {
    const navbarElements = [
        "heute",
        "morgen",
        "übermorgen"
    ]
    navbarElements.forEach(function(navbarElement) {
        document.getElementById(navbarElement).className = "";
    })
    document.getElementById(navbarElements[navbarElementNumber]).className = "is-active";
};

document.addEventListener('DOMContentLoaded', function() {
    navbarSetActive(0)
    setMenu(0);
});

document.getElementById('heute').onclick = function(event) {
    if (event === undefined) event = window.event;
    navbarSetActive(0)
    setMenu(0);
}
document.getElementById('morgen').onclick = function(event) {
    if (event === undefined) event = window.event;
    navbarSetActive(1)
    setMenu(1);
}
document.getElementById('übermorgen').onclick = function(event) {
    if (event === undefined) event = window.event;
    navbarSetActive(2)
    setMenu(2);
}