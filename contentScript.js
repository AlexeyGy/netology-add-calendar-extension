// window.addEventListener('load', function () {
//     setTimeout(addGcalButtons, 2000);
// })
// var imgURL = chrome.runtime.getURL("images/calendar.ico");


// get the course name from the tab url, e.g. https://netology.ru/profile/program/inst-13/calendar => inst-13

const appointments = getAppointments(); // will use the internal API to fetch data

let base_url =
    'https://calendar.google.com/calendar/u/0/r/eventedit?';

function addGcalButtons() {
    let events = findElements('.*event-module__root.*');
    console.log(events);

    events.forEach(
        el => {
            let button = document.createElement("input");

            let text = el.innerText;
            let start = text.slice(0, 5).replace(":", "");
            let end = text.slice(6, 11).replace(":", "");
            let title = text.slice(11);
            let day = el.parentElement.parentElement.parentElement.firstChild.textContent;

            console.log(start);
            console.log(end);

            console.log(day);

            // button.setAttribute("class", "gcal_button");
            // button.style.width = "100%";
            button.style.position = "absolute";
            button.style.top = "15px";
            button.style.right = "15px";
            button.style.zIndex = '10';
            button.src = "http://www.gravatar.com/avatar/a4d1ef03af32c9db6ee014c3eb11bdf6?s=32&d=identicon&r=PG";
            button.setAttribute("type", "image");
            button.addEventListener("click", function () {
                window.open(
                    base_url
                    + "text=" + "af"
                    + "&ctz=Europe/Moscow"
                    + "&dates=202010" + day + "T" + start + "00"
                    + "/202010" + day + "T" + end + "00"
                );
            }, false);

            el.appendChild(button);
        }
    );
}
function findElements(className) {   // https://stackoverflow.com/questions/3184093/getelementbyname-regex
    var elArray = [];
    var tmp = document.getElementsByTagName("*");

    var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
    for (var i = 0; i < tmp.length; i++) {

        if (regex.test(tmp[i].className)) {
            elArray.push(tmp[i]);
        }
    }

    return elArray;

}


//&dates=20201019T080000/20201019T100000&ctz=America/Los_Angeles&details=Description+of+the+event&location=Location+of+the+event&pli=1&uid=1601935181addeventcom&sf=true&output=xml


function getAppointments() {

    let courseName = window.location.toString().match('^.+\/(.+)\/calendar')[1];
    let data = fetch('https://netology.ru/backend/api/user/programs/' + courseName + '/calendar').then(res =>
        res.json()).then(d => {
            console.log(d)
        });

    return data.lesson_items;
}