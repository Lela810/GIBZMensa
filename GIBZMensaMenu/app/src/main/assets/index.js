async function requestMenu() {
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



    apiDates.forEach(async(apiDate) => {
        const url = ('https://gibzmensa.lklaus.ch/api/v1/?date=' + apiDate)
        let menu;

        try {
            console.log('url ' + url + ' requested')
            const api = await fetch(url);
            const menuSingle = await api.json();
            menu += {
                [apiDate]: menuSingle
            };

        } catch (err) {
            console.error(err);
        }
    });

    return ({ apiDates, month, menu })
}

function resetMenu(apiDate) {
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
}

async function setMenu(arrayPosition) {
    const request = await requestMenu()
    const apiDate = request.apiDates[arrayPosition]
    const month = request.month
    const currentDate = (new Date())

    resetMenu();


    document.getElementById('date').innerHTML = ('<strong>' + (currentDate.getDate() + arrayPosition) + '.' + month + '.' + currentDate.getFullYear() + '</strong>')
    if (storage[apiDate].hasOwnProperty('error')) {
        document.getElementById('error').innerHTML = (`<strong>Error:</strong> ` + request[apiDate].error)
    } else {
        for (const menu in storage[apiDate].menu) {
            document.getElementById(menu).innerHTML = (`<strong>${menu}:</strong> ` + request[apiDate].menu[menu])
        }
    }
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