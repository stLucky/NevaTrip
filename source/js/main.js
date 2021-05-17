const DESKTOP_WIDTH = '(min-width: 1440px)';
const MOBILE_HEIGHT_DEPARTURES = 24;
const DESKTOP_HEIGHT_DEPARTURES = 28;

const isUpperDesktop = window.matchMedia(DESKTOP_WIDTH).matches;

// mark - изменение стиля меток карточек на десктопной ширине

const marks = document.querySelectorAll('.mark');

marks.forEach((mark) => {
  if (isUpperDesktop) {
    if (mark.classList.contains('mark--sun')) {
      mark.classList.remove('mark--sun');
      mark.classList.add('mark--ocean');
    }

    if (mark.classList.contains('mark--dark')) {
      mark.classList.remove('mark--dark');
      mark.classList.add('mark--sun');
      mark.style.top = '60px';
      mark.textContent = 'Круглый год';
    }
  }

  if (getComputedStyle(mark).top === '0px') {
    mark.style.borderBottomRightRadius = '12px';
  }
});

//departure buttons and btn-more - добавление интерактивности кнопкам времени отправления и реализация
// логики работы кнопки еще

const departuresContainers = document.querySelectorAll('.card__departures');

const getMoreItem = () => {
  const li = document.createElement('li');
  const a = document.createElement('a');

  li.className = 'card__departure';
  a.href = '#URL';
  a.className = 'card__departure-btn';
  a.textContent = 'eще...';

  li.append(a);

  return li;
};

const moreItem = getMoreItem();

departuresContainers.forEach((container) => {
  const departureItems = container.querySelectorAll('.card__departure');
  const btns = container.querySelectorAll('.card__departure-btn');

  const removeActiveBtns = () => {
    for (let btn of btns) {
      btn.classList.remove('card__departure-btn--active');
    }
  };

  const onBtnClick = (btn) => {
    return (evt) => {
      evt.preventDefault();

      removeActiveBtns();

      btn.classList.add('card__departure-btn--active');
    };
  };

  btns.forEach((btn) => {
    btn.addEventListener('click', onBtnClick(btn));
  });

  //btn-more
  const findLastElInFirstLine = () => {
    const itemsInFirstLine = Array.from(departureItems).filter(btn => btn.offsetTop === 0);
    return itemsInFirstLine.length - 1;
  };

  const onBtnMoreClick = (evt) => {
    evt.preventDefault();

    moreItem.remove();
    container.style.height = 'unset';
    container.style.overflowY = 'visible';

    removeEventListener('click', onBtnMoreClick);
  };

  const setDepartures = (height) => {
    if (container.offsetHeight > height) {
      container.style.height = `${height}px`;
      container.style.overflowY = 'hidden';

      departureItems.forEach((item, i) => {
        if (item.offsetTop === 0 && i === findLastElInFirstLine()) {
          item.before(moreItem);

          const btnMore = moreItem.querySelector('.card__departure-btn');

          btnMore.addEventListener('click', onBtnMoreClick);
        }
      });
    }
  };

  isUpperDesktop ? setDepartures(DESKTOP_HEIGHT_DEPARTURES) : setDepartures(MOBILE_HEIGHT_DEPARTURES);
});

//title-mark - скрытие надписи Акция на десктопных устройствах

const titleMarks = document.querySelectorAll('.card__title-mark');

if (isUpperDesktop) {
  titleMarks.forEach((mark) => {
    mark.style.display = 'none';
  });
}

//main btns - изменение стиля кнопок на десктопных устройствах

const secondaryBtns = document.querySelectorAll('.btn--secondary');

if (isUpperDesktop) {
  secondaryBtns.forEach((btn) => {
    btn.classList.remove('btn--secondary');
    btn.classList.add('btn--primary');
  });
}

//symbol - добавление знака рубля на десктопных устройствах

const symbols = document.querySelectorAll('.symbol');

if (isUpperDesktop) {
  symbols.forEach((symbol) => {
    symbol.innerHTML = '&#8381;';
  });
}

//alt img - замена alt на десктопе

const imgs = document.querySelectorAll('.card__img');
if (isUpperDesktop) {
  imgs.forEach((img, i) => {
    if (i === 0) {
      img.alt = 'Раздвижной мост Санкт Петербурга';
    }

    if (i === 1) {
      img.alt = 'Храм Спаса на Крови Санкт Петербурга';
    }
  });
}









