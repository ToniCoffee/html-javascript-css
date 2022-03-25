const formatType = {
  long: 'long',
  short: 'short',
};

const options = {
  weekDayFormat: formatType.short,
  monthFormat: formatType.long,
  year: parseInt(new Date().getFullYear(), 10),
};

const createCalendar = (
  locale = 'en',
  {
    weekDayFormat = formatType.short,
    monthFormat = formatType.long,
    year = parseInt(new Date().getFullYear(), 10),
  } = options
) => {
  const today = new Date();
  const months = [...Array(12).keys()];
  const weekDays = [...Array(7).keys()];

  const intlMonths = new Intl.DateTimeFormat(locale, { month: monthFormat });
  const intlWeekDays = new Intl.DateTimeFormat(locale, {
    weekday: weekDayFormat,
  });

  const weekDaysNames = weekDays.map((weekDay) => {
    const date = new Date(2022, 7, weekDay + 1);
    const weekDayName = intlWeekDays.format(date);
    return weekDayName;
  });

  const calendar = months.map((monthKey) => {
    const monthName = intlMonths.format(new Date(year, monthKey));
    const nextMonthIndex = monthKey + 1;
    const daysOfMonth = new Date(year, nextMonthIndex, 0).getDate();
    const startsOn = new Date(year, monthKey, 0).getDay();

    return {
      monthName,
      daysOfMonth,
      startsOn: startsOn + 1,
    };
  });

  const body = document.querySelector('body');
  const divWrapper = document.createElement('div');
  divWrapper.classList.add('calendar-wrapper');
  body.appendChild(divWrapper);

  calendar.forEach(({ monthName, daysOfMonth, startsOn }, mounthIndex) => {
    const div = document.createElement('div');
    div.classList.add('mounth');
    div.setAttribute('style', 'height: 100vh; padding: .5rem 0');

    const h2 = document.createElement('h2');
    h2.innerText = `${
      monthName.charAt(0).toUpperCase() + monthName.slice(1)
    } ${year}`;

    const ol = document.createElement('ol');
    ol.classList.add('calendar');

    weekDaysNames.forEach((weekDay) => {
      const li = document.createElement('li');
      li.classList.add('calendar-day-name');
      li.innerText = `${weekDay.charAt(0).toUpperCase() + weekDay.slice(1)}`;
      ol.appendChild(li);
    });

    const days = [...Array(daysOfMonth).keys()];

    days.forEach((day, index) => {
      const li = document.createElement('li');
      li.classList.add('calendar-day');
      if (index === 0) {
        li.classList.add('first-day');
        li.setAttribute('style', `--first-day-start: ${startsOn}`);
      }
      if (mounthIndex === today.getMonth() && day + 1 === today.getDate()) {
        li.setAttribute('style', 'background-color: green; color: white');
      }
      li.innerText = `${day + 1}`;
      ol.appendChild(li);
    });

    div.appendChild(h2);
    div.appendChild(ol);
    divWrapper.appendChild(div);
  });

  const btnUp = document.createElement('button');
  btnUp.classList.add('btn');
  btnUp.setAttribute('id', 'btnUp');
  btnUp.innerText = '👆';

  btnUp.addEventListener('click', () => {
    const el = document.querySelector('div');
    el.scrollTo({ top: el.scrollTop - window.innerHeight, behavior: 'smooth' });
  });

  const btnDown = document.createElement('button');
  btnDown.classList.add('btn');
  btnDown.setAttribute('id', 'btnDown');
  btnDown.innerText = '👇';

  btnDown.addEventListener('click', () => {
    const el = document.querySelector('div');
    el.scrollTo({ top: el.scrollTop + window.innerHeight, behavior: 'smooth' });
  });

  divWrapper.appendChild(btnUp);
  divWrapper.appendChild(btnDown);
};

createCalendar('es');
