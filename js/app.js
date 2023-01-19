// #region ***  DOM references                           ***********
let wall,
  wallItem,
  routes,
  selectedPath = 1,
  ropeId = 1;

const fetchPromis = function (url) {
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
};

const toggleNav = function () {
  let toggleTrigger = document.querySelectorAll('.js-toggle-nav');
  for (let i = 0; i < toggleTrigger.length; i++) {
    toggleTrigger[i].addEventListener('click', function () {
      document.querySelector('body').classList.toggle('has-mobile-nav');
    });
  }
};

const togggleStars = function () {
  const starEls = document.querySelectorAll('.star.rating');

  starEls.forEach((star) => {
    star.addEventListener('click', function (e) {
      let starEl = e.currentTarget;
      let starRating = starEl.dataset.rating;
      starEl.parentNode.setAttribute('data-stars', starRating);
    });
  });
};

const drawSelectedPath = function (selectedPath) {
  const topDiffrence = wallItem[20].getBoundingClientRect().top - wallItem[0].getBoundingClientRect().top;
  const leftDiffrence = wallItem[1].getBoundingClientRect().left - wallItem[0].getBoundingClientRect().left;
  let cords = [];
  for (let i = 0; i < routes.length; i++) {
    for (let j = 0; j < routes[i].grips.length; j++) {
      if (routes[i].routeID !== selectedPath) {
        continue;
      }
      let top = routes[i].grips[j].points.x * topDiffrence - topDiffrence;
      if (top < 0) {
        top = 0;
      }
      let left = routes[i].grips[j].points.y * leftDiffrence - leftDiffrence;
      if (left < 0) {
        left = 0;
      }
      cords.push({
        xpoint: top,
        ypoint: left,
      });
    }
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

// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const listenToWindowResize = function () {
  window.addEventListener('resize', function () {
    drawSelectedPath(+selectedPath);
  });
};

const showWall = function () {
  let html = '';
  for (let i = 0; i < 1420; i++) {
    html += '<div class="c-wall__grid--item"></div>';
  }
  html += '<svg id="gfg" width="200" height="200" class="c-wall__svg"></svg>';
  document.querySelector('.js-wall').innerHTML = html;
  console.info('Grid loaded');
};

const showRouteButtons = function () {
  let html = '';
  for (let i = 0; i < routes.length; i++) {
    let route_id = routes[i].routeID;
    let routeName = 'Route: ' + (i + 1);
    let difficulty = routes[i].difficulty;
    let builder = routes[i].builder.lastname + ' ' + routes[i].builder.firstname;
    let rating = Math.round(routes[i].avgRating);
    let starSVG = '';
    for (let j = 0; j < 5; j++) {
      if (j < rating) {
        starSVG += `<svg xmlns="http://www.w3.org/2000/svg" class="c-wall__star c-wall__star--fill" width="40" height="38" viewBox="0 0 40 38"><path d="M11.65,44,14.9,29.95,4,20.5l14.4-1.25L24,6l5.6,13.25L44,20.5,33.1,29.95,36.35,44,24,36.55Z" transform="translate(-4 -6)" /></svg>`;
      } else {
        starSVG += `<svg xmlns="http://www.w3.org/2000/svg" class="c-wall__star" width="40" height="38" viewBox="0 0 40 38"><path d="M11.65,44,14.9,29.95,4,20.5l14.4-1.25L24,6l5.6,13.25L44,20.5,33.1,29.95,36.35,44,24,36.55Z" transform="translate(-4 -6)" /></svg>`;
      }
    }
    let checked = '';
    if (i == 0) {
      checked = 'checked';
      selectedPath = route_id;
    }
    html += `
    <input class="o-hide-accessible c-options c-option--hidden js-path-select" type="radio" id="${i + 1}" name="routes" data-id="${route_id}" ${checked} /><label class="c-label c-label--options c-custom-options" for="${i + 1}">
              <span class="u-mb-clear c-wall__rating--title">${routeName}</span><span class="u-mb-clear c-wall__rating--subtitle">Niveu: <span>${difficulty}</span></span>
              <span class="u-mb-s c-wall__rating--subtitle">Builder: <span>${builder}</span></span>
              <span class="u-mb-clear c-wall__rating--subtitle">Rating:</span>
              <span>
                ${starSVG}
              </span>
            </label>
    `;
  }
  document.querySelector('.js-wall_route--options').innerHTML = html;
  console.info('Route buttons loaded');
  showGrips();
};

const showGrips = async function () {
  wall = document.querySelectorAll('.c-wall');
  wallItem = document.querySelectorAll('.c-wall__grid--item');
  for (let i = 0; i < routes.length; i++) {
    for (let j = 0; j < routes[i].grips.length; j++) {
      let index = routes[i].grips[j].points.x - 1 + (routes[i].grips[j].points.y - 1) * 20;
      wallItem[index].classList.add('c-wall__grid--item--grip');
      switch (routes[i].grips[j].handgriptype) {
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
  }
  drawSelectedPath(selectedPath);
  listenToRouteClick();
};

const showRopes = function (ropes) {};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const GetLoggin = async function () {
  let url = 'https://func-westeur-klimapp2.azurewebsites.net/auth/login';
  await fetch(url).then((res) => {
    console.log(res.json());
    if (res.status == 200) {
      console.log('logged in');
    } else {
      console.log('not logged in');
    }
  });
};

const getRopeId = function () {
  let url = window.location.search;
  let urlParams = new URLSearchParams(url);
  ropeId = urlParams.get('touw');
  console.log('ropeId: ' + ropeId);
  getWallRoutes(ropeId);
};

const getWallRoutes = async function (rope_id) {
  const url = 'https://func-westeur-klimapp2.azurewebsites.net/api/rope/' + rope_id + '/routes';
  routes = await fetchPromis(url);
  console.log(routes);
  showRouteButtons();
};

const getRopes = async function () {
  // const url = 'https://func-westeur-klimapp2.azurewebsites.net/api/rope';
  const ropes = await fetchPromis(url);
  showRopes(ropes);
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
const listenToRouteClick = function () {
  let options = document.querySelectorAll('.js-path-select');
  options.forEach((option) => {
    option.addEventListener('change', function (event) {
      selectedPath = this.dataset.id;
      drawSelectedPath(selectedPath);
    });
  });
};
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
document.addEventListener('DOMContentLoaded', function () {
  toggleNav();
  // GetLoggin();
  if (document.querySelector('#ropes')) {
    getRopes();
  }
  if (document.querySelector('#ropeDetail')) {
    getRopeId();
    showWall();
    togggleStars();
    listenToWindowResize();
  }
  if (document.querySelector('#dashboard')) {
    logout();
  }
});
// #endregion

const logout = function () {
  console.log('logout');
  let url = 'https://func-westeur-klimapp2.azurewebsites.net/auth/logout';
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
