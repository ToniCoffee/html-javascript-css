const formatType = {
  long: 'long',
  short: 'short',
};

const options = {
  weekDayFormat: formatType.short,
  monthFormat: formatType.long,
  year: parseInt(new Date().getFullYear(), 10),
};

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const getMonths = (
  locale = 'en',
  year = options.year,
  format = formatType.long
) => {
  const intl = new Intl.DateTimeFormat(locale, { month: format });
  const months = [];

  for (let month = 0; month < 12; month++) {
    const daysOfMonth = new Date(year, month + 1, 0).getDate();
    const startsOn = new Date(year, month, 0).getDay();
    const days = [];
    const daysOffset = [];
    let offset = 1;

    if (startsOn + 1 !== 1) {
      const previousMonthDays = new Date(year, month, 0).getDate();
      offset = previousMonthDays - startsOn + 1;

      for (let offsetDays = 0; offsetDays < startsOn; offsetDays++) {
        daysOffset.push(offset + offsetDays);
      }
    }

    for (let day = 1; day <= daysOfMonth; day++) days.push(day);

    months.push({
      name: intl.format(new Date(year, month)),
      days,
      daysOffset,
      startsOn: startsOn + 1,
    });
  }

  return months;
};

const getWeekDays = (locale = 'en', format = formatType.short) => {
  const intl = new Intl.DateTimeFormat(locale, { weekday: format });
  const weekDays = [];

  for (let weekDay = 0; weekDay < 7; weekDay++) {
    weekDays.push(intl.format(new Date(2022, 7, weekDay + 1)));
  }

  return weekDays;
};

const createButton = (idAttribute = '', icon = '', factor = 1) => {
  const btn = document.createElement('button');
  btn.classList.add('btn');
  btn.setAttribute('id', idAttribute);
  btn.innerText = icon;

  btn.addEventListener('click', () => {
    const el = document.querySelector('div');
    el.scrollTo({
      top: el.scrollTop + window.innerHeight * factor,
      behavior: 'smooth',
    });
  });

  return btn;
};

const createDiv = () => {
  const div = document.createElement('div');
  div.classList.add('month');
  return div;
};

const createH2 = (month, year = options.year) => {
  const h2 = document.createElement('h2');
  h2.innerText = `${capitalize(month.name)} ${year}`;
  return h2;
};

const createOl = () => {
  const ol = document.createElement('ol');
  ol.classList.add('calendar');
  return ol;
};

const createWeekDays = (weekDay) => {
  const li = document.createElement('li');
  li.classList.add('calendar-day-name');
  li.innerText = `${capitalize(weekDay)}`;
  return li;
};

const createDays = (day, today, monthIndex /* , index, startsOn */) => {
  const li = document.createElement('li');
  li.classList.add('calendar-day');
  /* if (index === 0) {
    li.classList.add('first-day');
    li.setAttribute('style', `--first-day-start: ${startsOn}`);
  } */
  if (monthIndex === today.getMonth() && day === today.getDate()) {
    li.classList.add('today');
  }
  li.innerText = `${day}`;
  return li;
};

const changeLanguage = (locale = 'en') => {
  const headers = document.querySelectorAll('h2');
  const weeksDays = document.querySelectorAll('.calendar-day-name');

  const intlMonths = new Intl.DateTimeFormat(locale, {
    month: options.monthFormat,
  });

  headers.forEach((value, index) => {
    const monthName = intlMonths.format(new Date(options.year, index));
    value.innerText = `${capitalize(monthName)} ${options.year}`;
  });

  const weekDays = getWeekDays(locale);

  let weekDayIndex = 0;

  weeksDays.forEach((value) => {
    if (weekDayIndex % 7 === 0) weekDayIndex = 0;
    value.innerText = `${capitalize(weekDays[weekDayIndex])}`;
    weekDayIndex++;
  });
};

const createCalendar = (
  locale = 'en',
  {
    weekDayFormat = options.weekDayFormat,
    monthFormat = options.monthFormat,
    year = options.year,
  } = options
) => {
  const today = new Date();
  const body = document.querySelector('body');
  const divWrapper = document.createElement('div');
  divWrapper.classList.add('calendar-wrapper');
  body.appendChild(divWrapper);

  const months = getMonths(locale, year, monthFormat);
  months.forEach((month, monthIndex) => {
    const div = createDiv();
    const h2 = createH2(month, year);
    const ol = createOl();

    getWeekDays(locale, weekDayFormat).forEach((weekDay) => {
      const li = createWeekDays(weekDay);
      ol.appendChild(li);
    });

    month.daysOffset.forEach((day) => {
      const li = createDays(day, today, monthIndex);
      li.classList.add('days-offset');
      ol.appendChild(li);
    });

    month.days.forEach((day) => {
      const li = createDays(day, today, monthIndex);
      ol.appendChild(li);
    });

    div.appendChild(h2);
    div.appendChild(ol);
    divWrapper.appendChild(div);
  });

  const btnUp = createButton('btnUp', '👆', -1);
  const btnDown = createButton('btnDown', '👇');

  divWrapper.appendChild(btnUp);
  divWrapper.appendChild(btnDown);
};

createCalendar('es');
// console.log(getMonths('es'));

const selector = document.getElementById('selector');
selector.addEventListener('change', (e) => {
  // console.log(e.target.value);
  changeLanguage(e.target.value);
});
// console.log(selector.value);
