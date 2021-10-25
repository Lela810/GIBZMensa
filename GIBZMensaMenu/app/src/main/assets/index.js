async function api(apiDate) {
    const url = ('https://gibzmensa.lklaus.ch/api/v1/?date=' + apiDate)
    console.log('url ' + url + ' requested')
    const api = await fetch(url)
    const menu = await api.json();
    return menu
}


function requestDates() {
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

    const year = currentDate.getFullYear()

    const days = [
        today,
        tomorrow,
        theDayAfterTomorrow
    ]

    const apiDates = [
        (currentDate.getFullYear() + '-' + month + '-' + today),
        (currentDate.getFullYear() + '-' + month + '-' + tomorrow),
        (currentDate.getFullYear() + '-' + month + '-' + theDayAfterTomorrow)
    ];


    return ({ apiDates, year, month, days })
}

function resetMenu() {
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

    const { apiDates, year, month, days } = requestDates()
    const apiDate = apiDates[arrayPosition]
    const day = days[arrayPosition]
    const request = (await api(apiDate))
    resetMenu();

    let alertData = {};

    document.getElementById('date').innerHTML = ('<strong>' + day + '.' + month + '.' + year + '</strong>')
    if (request.hasOwnProperty('error')) {
        document.getElementById('error').innerHTML = (`<strong>Error:</strong> ` + request.error)
    } else {
        for (const menu in request.menu) {
            alertData += (`${menu}:\n${request.menu[menu]}`)
            document.getElementById(menu).innerHTML = (`<strong>${menu}:</strong> ` + request.menu[menu])
        }
    }
    return ({ alertData, apiDate })
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

function isoToObj(s) {
    var b = s.split(/[-TZ:]/i);

    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));

}

function timeToGo(s) {


    // Convert string to date object
    var d = isoToObj(s);
    var diff = d - new Date();

    // Allow for previous times
    var sign = diff < 0 ? '-' : '';
    diff = Math.abs(diff);

    // Get time components
    var hours = diff / 3.6e6 | 0;
    var mins = diff % 3.6e6 / 6e4 | 0;
    var secs = Math.round(diff % 6e4 / 1e3);

    // Return formatted string
    return (secs + (hours * 3600) + (mins * 60));
}

document.addEventListener('DOMContentLoaded', async function() {
    navbarSetActive(0)
    const alertDetails = (await setMenu(0));
    //TODO Create notification implementation

    //const dateTo = (`${alertDetails.apiDate}T01:50:00Z`)
    //const timeTo = (await timeToGo(dateTo))
    //console.log(timeTo)
    //setTimeout(() => {
    //    alert(alertDetails.alertData)
    //}, (timeTo * 1000));


});

document.getElementById('heute').onclick = function(event) {
    navbarSetActive(0)
    setMenu(0);
}
document.getElementById('morgen').onclick = function(event) {
    navbarSetActive(1)
    setMenu(1);
}
document.getElementById('übermorgen').onclick = function(event) {
    navbarSetActive(2)
    setMenu(2);
}