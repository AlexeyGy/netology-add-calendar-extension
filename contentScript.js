
// constants
const CALENDAR_BASE_URL =
      'https://calendar.google.com/calendar/u/0/r/eventedit?';

const courseName = window.location.toString().match('^.+/program/(.*?)($|/.*)')[1];
const DETAILS_BASE_URL =
      'https://netology.ru/profile/program/' + courseName;


// main loop
getAppointments().then(
      (appointments) => {
            appointments
                  .filter(appointment => (
                        ("starts_at" in appointment)
                        || ('lesson_task' in appointment && appointment.lesson_task.deadline !== null)))
                  .forEach(
                        (appointment) => {
                              // console.log(appointment);
                              const parsedAppointment = parseAppointment(appointment);
                              const calendarURL = getGoogleCalendarURL(parsedAppointment);
                              // using set interval here is a bit dirty since we will constantly try to redraw
                              // however, there seems to be no better way about this as the js could be reloaded when navigating around
                              setInterval(addButton, 2000, parsedAppointment, calendarURL);
                        },
                  );
      },
);

function addButton(parsedAppointment, calendarURL) {
      // only on calendar page
      if (!window.location.toString().match('.*calendar.*')) {
            return;
      }

      // console.log(calendarURL);
      const element = Array.from(document.querySelectorAll('div'))
            .find(el => el.textContent === parsedAppointment.title);

      // check if appointment block was found and if there is not already a button
      if (element == undefined) {
            return;
      }
      const previousIcons = element.parentElement.parentElement.parentElement.children;
      // check if already added
      let input_count = 0;
      for (i = 0; i < previousIcons.length; i++) {
            // console.log(previousIcons[i]);
            if (previousIcons[i].tagName !== "INPUT") {
                  continue;
            }
            input_count++;
            if (previousIcons[i].title == parsedAppointment.title) {
                  return;
            }
      }
      // console.log(input_count);
      // we know that the button was not added before
      element.parentElement.parentElement.parentElement.appendChild(
            createButtonElement(parsedAppointment.title, calendarURL, input_count * 25)
      );
}

function createButtonElement(title, calendarURL, offset) {
      const button = document.createElement('input');
      button.style.position = 'absolute';
      button.style.top = '10px';
      button.style.left = offset + 'px';
      button.style.width = '30px';
      button.style.zIndex = '100';
      button.title = title;
      button.setAttribute("class", "gcal_button");
      button.src = 'https://www.gstatic.com/calendar/images/dynamiclogo/2x/cal_06_v2.png';
      button.addEventListener("click", function () {
            window.open(calendarURL);
      });
      button.setAttribute('type', 'image');
      return button;
}


async function getAppointments() {
      const response = await fetch('https://netology.ru/backend/api/user/programs/' + courseName + '/calendar');
      const data = await response.json();

      return data.lesson_items;
}
function parseAppointment(appointment) {

      if (appointment.type === "webinar") {
            return {
                  title: appointment.title,
                  start: parseDate(appointment.starts_at),
                  end: parseDate(appointment.ends_at),
                  details: getDetailsUrl(appointment.id, appointment.lesson_id)
            };
      }
      // console.log('deadline', appointment);
      return {
            title: appointment.title,
            start: parseDate(appointment.lesson_task.deadline),
            end: parseDate(appointment.lesson_task.deadline),
            details: getDetailsUrl(appointment.id, appointment.lesson_id)
      };
}

function parseDate(dateString) {
      try {
            return dateString.replaceAll('-', '').replaceAll(':', '').slice(0, 15);
      }
      catch (error) {
            console.log(error);
      }
      return "";
}

function getDetailsUrl(item_id, lesson_id) {
      return DETAILS_BASE_URL + '/lessons/' + lesson_id + '/lesson_items/' + item_id
}

function getGoogleCalendarURL(parsed) {

      // example event
      // https://calendar.google.com/calendar/u/0/r/eventedit?text=Summary+of+the+event&dates=20201019T080000/20201019T100000&ctz=America/Los_Angeles&details=Description+of+the+event&location=Location+of+the+event

      return CALENDAR_BASE_URL +
            'text=' + parsed.title.replaceAll(' ', '+') +
            '&ctz=UTC' +
            '&dates=' + parsed.start +
            '/' + parsed.end +
            '&details=' + parsed.details;
}
