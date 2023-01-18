const fetchPromis = function (url) {
  // return fetch('https://waeghexander.github.io/TeamProject_Proto/js/dummydata.json').then((response) => response.json().catch((error) => console.log(error)));
  return fetch(url).then((response) => response.json().catch((error) => console.log(error)));
};

document.addEventListener('DOMContentLoaded', function () {
  toggleNav();

  if (document.querySelector('#ropeDetail')) {
    getWallRoutes();
    stars();
  }
});

const stars = function () {
  const starEls = document.querySelectorAll('.star.rating');

  starEls.forEach((star) => {
    star.addEventListener('click', function (e) {
      let starEl = e.currentTarget;
      let starRating = starEl.dataset.rating;
      starEl.parentNode.setAttribute('data-stars', starRating);
    });
  });
};

function toggleNav() {
  let toggleTrigger = document.querySelectorAll('.js-toggle-nav');

  for (let i = 0; i < toggleTrigger.length; i++) {
    toggleTrigger[i].addEventListener('click', function () {
      document.querySelector('body').classList.toggle('has-mobile-nav');
    });
  }
}

const getWallRoutes = async function () {
  routes = await getWallRoutes('http://127.0.0.1:5500/js/dummydata.json');
  console.log(routes);
  showWall();
};

const showWall = function () {
  let html = '';
  for (let i = 0; i < 1420; i++) {
    html += '<div class="c-wall__grid--item"></div>';
  }
  html += '<svg id="gfg" width="200" height="200" class="c-wall__svg"></svg>';
  document.querySelector('.js-wall').innerHTML = html;
  showGrips();
};
let wall, wallItem, routes;

const showGrips = async function () {
  wall = document.querySelectorAll('.c-wall');
  wallItem = document.querySelectorAll('.c-wall__grid--item');
  routes = await getWallRoutes();

  for (let i = 0; i < routes.length; i++) {
    let x = routes[i].point[0];
    let y = routes[i].point[1];
    let index = x - 1 + (y - 1) * 20;
    wallItem[index].classList.add('c-wall__grid--item--grip');

    switch (routes[i].handgriptype) {
      case 'Bak':
        wallItem[index].classList.add('c-wall__grid--item--grip--bak');
        break;
      case 'Sloper':
        wallItem[index].classList.add('c-wall__grid--item--grip--sloper');
        break;
      case 'Crimp':
        wallItem[index].classList.add('c-wall__grid--item--grip--crimp');
        break;
      case 'Pocket':
        wallItem[index].classList.add('c-wall__grid--item--grip--pocket');
        break;
      case 'Jug':
        wallItem[index].classList.add('c-wall__grid--item--grip--jug');
        break;
      case 'Undercling':
        wallItem[index].classList.add('c-wall__grid--item--grip--undercling');
        break;
      case 'Mono':
        wallItem[index].classList.add('c-wall__grid--item--grip--mono');
        break;
      case 'Bidoigt':
        wallItem[index].classList.add('c-wall__grid--item--grip--bidoigt');
        break;
    }
  }

  drawSelectedPath(1);
  listenToRouteClick();
};

const listenToRouteClick = function () {
  let options = document.querySelectorAll('.js-path-select');

  options.forEach((option) => {
    option.addEventListener('change', function (event) {
      let selectedPath = this.dataset.id;
      drawSelectedPath(+selectedPath);
    });
  });
};

const drawSelectedPath = function (selectedPath) {
  const topDiffrence = wallItem[20].getBoundingClientRect().top - wallItem[0].getBoundingClientRect().top;
  const leftDiffrence = wallItem[1].getBoundingClientRect().left - wallItem[0].getBoundingClientRect().left;

  let cords = [];

  for (let i = 0; i < routes.length; i++) {
    if (routes[i].route !== selectedPath) {
      continue;
    }

    let top = routes[i].point[0] * topDiffrence - topDiffrence;

    if (top < 0) {
      top = 0;
    }

    let left = routes[i].point[1] * leftDiffrence - leftDiffrence;

    if (left < 0) {
      left = 0;
    }

    cords.push({
      xpoint: top,
      ypoint: left,
    });
  }

  var points = cords;

  var Gen = d3
    .line()
    .x((p) => p.xpoint)
    .y((p) => p.ypoint)
    .curve(d3.curveCardinal);

  d3.select('#gfg').selectAll('path').remove();
  d3.select('#gfg').append('path').attr('d', Gen(points)).attr('fill', 'none').attr('stroke', '#5804f4').attr('stroke-width', '2').attr('class', 'js-path');

  animatePath();
};

const animatePath = function () {
  const path = document.querySelector('.js-path');
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = 0 - length;
};
