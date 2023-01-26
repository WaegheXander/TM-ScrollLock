// TODO - add a comment to explain what this file does
// TODO - add a comment to explain how this file is structured
// TODO - fix draw with non selected routes

// #region ***  DOM references                           ***********
let wall,
  wallItem,
  routes,
  selectedPath = '',
  ropeId = 1,
  currentuser;

const fetchPromis = function (url, method = 'GET', body = null) {
  console.info(url);
  return fetch(url, {
    method: method,
    body: body,
  })
    .then((response) => {
      console.info('Data fetched');
      let res = response.json();
      return res;
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

const drawSelectedPath = function () {
  console.log('draw selected path: ', selectedPath);
  const topDiffrence = wallItem[20].getBoundingClientRect().top - wallItem[0].getBoundingClientRect().top;
  const leftDiffrence = wallItem[1].getBoundingClientRect().left - wallItem[0].getBoundingClientRect().left;
  let cords = [];

  for (let i = 0; i < routes.length; i++) {
    for (let j = 0; j < routes[i].grips.length; j++) {
      if (routes[i].routeID != selectedPath) {
        console.log('break');
        break;
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

// #region ***  Visualisation - show___         ***********
const showWall = function () {
  let html = '';

  for (let i = 0; i < 1420; i++) {
    html += '<div class="c-wall__grid--item js-grid-item"></div>';
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
        starSVG += `<svg xmlns="http://www.w3.org/2000/svg"class="c-wall__star c-wall__star--fill"width="40"height="38"viewBox="0 0 40 38"><path d="M11.65,44,14.9,29.95,4,20.5l14.4-1.25L24,6l5.6,13.25L44,20.5,33.1,29.95,36.35,44,24,36.55Z"transform="translate(-4 -6)"/></svg>`;
      } else {
        starSVG += `<svg xmlns="http://www.w3.org/2000/svg"class="c-wall__star"width="40"height="38"viewBox="0 0 40 38"><path d="M11.65,44,14.9,29.95,4,20.5l14.4-1.25L24,6l5.6,13.25L44,20.5,33.1,29.95,36.35,44,24,36.55Z"transform="translate(-4 -6)"/></svg>`;
      }
    }

    let checked = '';

    if (i == 0) {
      checked = 'checked';
      selectedPath = route_id;
      console.log('selected path: ', selectedPath);
    }

    html += `
    <input class="o-hide-accessible c-options c-option--hidden js-path-select"type="radio"id="${i + 1}"name="routes"data-id="${route_id}"${checked}/>
    <label class="c-label c-label--options c-custom-options"for="${i + 1}">
    <span class="u-mb-clear c-wall__rating--title">${routeName}</span>
    <span class="u-mb-clear c-wall__rating--subtitle">Niveu: <span>${difficulty}</span>
    </span><span class="u-mb-s c-wall__rating--subtitle">Builder: <span>${builder}</span>
    </span><span class="u-mb-clear c-wall__rating--subtitle">Rating:</span>
    <span>${starSVG}</span>
    </label>`;
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
      wallItem[index].setAttribute('data-id', routes[i].routeID);

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

  drawSelectedPath();
  listenToRouteClick();
};

const showRopes = function (ropes) {
  let wall = document.querySelector('.c-Routes__touw');
  let html = ``;
  for (let i = 0; i < ropes.length; i++) {
    html += `<div class="c-touw">
    <img src="${ropes[i].image}" class="c-touw__backgouround" alt="rope achtergrond" />
    <div class="c-touw__content">
      <h1 class="c-touw__content--title">Touw ${ropes[i].rope}</h1>
      <a href="touwDetail.html?touw=${ropes[i].rope}" class="c-touw__content--button">Bekijk routes</a>
    </div>
    </div>`;
  }
  wall.innerHTML = html;
};

// #endregion

// #region ***  Data Access - get___                     ***********
const getRopeId = function () {
  let url = window.location.search;
  let urlParams = new URLSearchParams(url);
  ropeId = urlParams.get('touw');
  console.log('ropeId: ' + ropeId);
  getWallRoutes(ropeId);
};

const getWallRoutes = async function (rope_id) {
  const url = 'https://meeclimb.be/api/routes?rope=' + rope_id;
  console.log(url);
  routes = await fetchPromis(url);
  console.log(routes);
  showRouteButtons();
};

const getRopes = async function () {
  const url = 'https://meeclimb.be/api/ropes';
  const ropes = await fetchPromis(url);
  console.log(ropes);
  showRopes(ropes);
};

// #endregion

// #region ***  Event Listeners - listenTo___            ***********
const listenToRouteClick = function () {
  let options = document.querySelectorAll('.js-path-select');

  options.forEach((option) => {
    option.addEventListener('change', function (event) {
      console.log('old ', selectedPath);
      selectedPath = this.getAttribute('data-id');
      drawSelectedPath();
    });
  });
};

const listenToWindowResize = function () {
  window.addEventListener('resize', function () {
    drawSelectedPath();
  });
};

const listenToLogout = function () {
  document.querySelector('.js-logout').addEventListener('click', function () {
    logout();
  });
};

// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
document.addEventListener('DOMContentLoaded', function () {
  toggleNav();
  GetLogin();

  if (document.querySelector('#ropes')) {
    getRopes();
  }

  if (document.querySelector('#ropeDetail')) {
    showWall();
    getRopeId();
    togggleStars();
    listenToWindowResize();
  }
  if (document.querySelector('#dashboard')) {
    getRopesSelect();
  }
  if (document.querySelector('#account')) {
    getActivityUser();
    listenToLogout();
  }
});
// #endregion

// #region ***  Dashboard  ***********
let selectedRope, selectedRoute;

const getRopesSelect = async function () {
  let url = 'https://meeclimb.be/api/ropes';
  const data = await fetchPromis(url);
  console.log(data);
  selectedRope = data[0].rope;
  showRopesDashboard(data);
};

const showRopesDashboard = function (ropes) {
  let html = ``;
  for (let i = 0; i < ropes.length; i++) {
    html += `<option value="${ropes[i].rope}">Touw ${ropes[i].rope}</option>`;
  }
  document.querySelector('.js-select-rope').innerHTML = html;
  console.log('ropes loaded');

  getRouteSelect();
};

const getRouteSelect = async function () {
  let url = 'https://meeclimb.be/api/routes?rope=' + selectedRope;
  const data = await fetchPromis(url);
  console.log(data);
  selectedRoute = data[0].routeID;
  showRoutesDashboard(data);
};

const showRoutesDashboard = function (data) {
  let html = ``;
  for (let i = 0; i < data.length; i++) {
    html += `<option value="${data[i].routeID}">${i + 1} | ${data[i].name == null ? 'geen naam' : data[i].name}</option>`;
  }
  document.querySelector('.js-select-route').innerHTML = html;
  console.log('routes loaded');
  getDetailRouteSelect();
};

const getDetailRouteSelect = async function () {
  let url = 'https://meeclimb.be/api/routes?routeID=' + selectedRoute;
  const data = await fetchPromis(url);
  console.log(data);
  showDetailRouteDashboard(data);
};

const showDetailRouteDashboard = function (data) {
  document.querySelector('.js-route-name').value = data.name;
  document.querySelector('.js-route-niveau').value = data.difficulty;
  document.querySelector('.js-route-color').value = data.color;
  console.log('route setting loaded');
  showGripsDashboard(data);
};

const addGrip = function (event) {
  let type = event.target.getAttribute('data-id');
  let items = document.querySelectorAll('.c-wall__grid--item');
  let index = 0;
  while (index != 'stop') {
    if (items[index].draggable == false) {
      items[index].classList.add('c-wall__grid--item--grip--' + type);
      items[index].classList.add('draggable');
      items[index].setAttribute('draggable', true);
      index = 'stop';
    } else {
      index++;
    }
  }

  removeEventListeners();
  listenToUIDashboard();
};

const dragstart = function (event) {
  event.dataTransfer.setData('text', event.target.id);
};

const dragover = function (event) {
  event.preventDefault();
};

const drop = function (event) {
  event.preventDefault();

  var data = event.dataTransfer.getData('text');
  var movable = document.getElementById(data);
  console.log('movable: ', movable);
  console.log('event.target: ', event.target);
  if (movable == null || event.target.classList == movable.classList || event.target.classList[3]) return;
  console.log('not the same');
  event.target.setAttribute('draggable', true);
  event.target.setAttribute('data-id', movable.getAttribute('data-id'));
  event.target.classList = movable.classList;
  movable.removeAttribute('draggable');
  movable.removeAttribute('data-id');
  movable.classList = 'c-wall__grid--item dropzone';
  removeEventListeners();
  listenToUIDashboard();
};

const listenToUIDashboard = async function () {
  let draggable = document.querySelectorAll('.draggable');
  draggable.forEach(function (movable) {
    movable.addEventListener('dragstart', dragstart);
  });

  let dropzone = document.querySelectorAll('.dropzone');
  dropzone.forEach(function (dropZone) {
    dropZone.addEventListener('dragover', dragover);
  });

  dropzone.forEach(function (dropZone) {
    dropZone.addEventListener('drop', drop);
  });

  let typeGrip = document.querySelectorAll('.js-add__grip');
  typeGrip.forEach(function (type) {
    type.addEventListener('click', addGrip);
  });

  let selectRopeElement = document.querySelector('.js-select-rope');
  selectRopeElement.addEventListener('change', ropeSelectChange);

  let selectRouteElement = document.querySelector('.js-select-route');
  selectRouteElement.addEventListener('change', routeSelectChange);

  let saveSettingsElement = document.querySelector('.js-save-settings');
  saveSettingsElement.addEventListener('click', saveSettings);

  let cancelSettingsElement = document.querySelector('.js-cancel-settings');
  cancelSettingsElement.addEventListener('click', cancelSettings);

  let deleteTouwElement = document.querySelector('.js-delete-rope');
  deleteTouwElement.addEventListener('click', deleteTouw);

  let deleteRouteElement = document.querySelector('.js-delete-route');
  deleteRouteElement.addEventListener('click', deleteRoute);

  let addRopeElement = document.querySelector('.js-add-rope');
  addRopeElement.addEventListener('click', addRope);

  let addRouteElement = document.querySelector('.js-add-route');
  addRouteElement.addEventListener('click', addRoute);
};

const addRope = function () {
  document.querySelector('.js-overlay--addrope').style.display = 'flex';
  listenToAddRope();
};

const listenToAddRope = function () {
  document.querySelector('.js-annuleren-rope').addEventListener('click', cancelAddRope);
  document.querySelector('.js-toevoegen-rope').addEventListener('click', toevoegenRope);
};

const cancelAddRope = function () {
  document.querySelector('.js-overlay--addrope').style.display = 'none';
  document.querySelector('.js-annuleren-rope').removeEventListener('click', cancelAddRope);
};

const toevoegenRope = async function () {
  let nummer = document.querySelector('.js-route-nummer').value;
  let res = fetch('/api/v1/touwen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      number: nummer,
    }),
  });
  console.log(res);
  if (res.ok) {
    console.log('touw toegevoegd');
    getRopeSelect();
    cancelAddRope();
  } else {
    alert('Er is iets misgegaan');
  }
};

const addRoute = function () {
  document.querySelector('.js-overlay--addroute').style.display = 'flex';
  listenToAddRoute();
};

const listenToAddRoute = function () {
  document.querySelector('.js-annuleren-route').addEventListener('click', cancelAddRoute);
};

const cancelAddRoute = function () {
  document.querySelector('.js-overlay--addroute').style.display = 'none';
  document.querySelector('.js-annuleren-route').removeEventListener('click', cancelAddRoute);
};

const ropeSelectChange = function (event) {
  selectedRope = event.target.value;
  getRouteSelect();
};

const routeSelectChange = function (event) {
  selectedRoute = event.target.value;
  getDetailRouteSelect();
};

const deleteRoute = async function () {
  let url = 'https://meeclimb.be/api/route/' + selectedRoute;
  const response = await fetch(url, {
    method: 'DELETE',
  });
  console.log(response.status);
};

const deleteTouw = async function () {
  let url = 'https://meeclimb.be/api/rope/' + selectedRoute;
  const response = await fetch(url, {
    method: 'DELETE',
  });
  console.log(response.status);
};

const saveSettings = async function () {
  let routeName = document.querySelector('.js-route-name').value;
  let routeNiveau = document.querySelector('.js-route-niveau').value;
  let routeColor = document.querySelector('.js-route-color').value;
  let coords = await getGripsCoords();

  let data = {
    routeID: selectedRoute,
    Name: routeName,
    difficulty: routeNiveau,
    color: routeColor,
    rope: selectedRope,
    grips: coords,
  };
  console.log(data);
  let url = 'https://meeclimb.be/api/routes';
  const response = await fetchPromis(url, 'PUT', data);
  console.log(response);
  removeEventListeners();
  listenToUIDashboard();
};

const getGripsCoords = function () {
  const items = document.getElementsByClassName('c-wall__grid--item');
  let data = [];
  for (let i = 0; i < items.length; i++) {
    let classes = items[i].classList;
    if (classes.length > 3) {
      let stone = classes[3].split('--');
      let id = items[i].getAttribute('id');
      let x = id % 20;
      let y = (id - x) / 20;
      let grip = {
        type: 'handgrip',
        handgriptype: stone[3],
        points: {
          x: x + 1,
          y: y + 1,
        },
      };
      data.push(grip);
    }
  }
  console.log(data);
  return data;
};

const cancelSettings = function () {
  getDetailRouteSelect();
};

const removeEventListeners = function () {
  let draggable = document.querySelectorAll('.draggable');
  let dropzone = document.querySelectorAll('.dropzone');

  draggable.forEach(function (movable) {
    movable.removeEventListener('dragstart', dragstart);
  });

  dropzone.forEach(function (dropZone) {
    dropZone.removeEventListener('dragover', dragover);
  });

  dropzone.forEach(function (dropZone) {
    dropZone.removeEventListener('drop', drop);
  });

  let typeGrip = document.querySelectorAll('.js-add__grip');
  typeGrip.forEach(function (type) {
    type.removeEventListener('click', addGrip);
  });

  let selectRopeElement = document.querySelector('.js-select-rope');
  selectRopeElement.removeEventListener('change', ropeSelectChange);

  let selectRouteElement = document.querySelector('.js-select-route');
  selectRouteElement.removeEventListener('change', routeSelectChange);

  let saveSettingsElement = document.querySelector('.js-save-settings');
  saveSettingsElement.removeEventListener('click', saveSettings);

  let cancelSettingsElement = document.querySelector('.js-cancel-settings');
  cancelSettingsElement.removeEventListener('click', cancelSettings);

  let deleteTouwElement = document.querySelector('.js-delete-rope');
  deleteTouwElement.removeEventListener('click', deleteTouw);

  let deleteRouteElement = document.querySelector('.js-delete-route');
  deleteRouteElement.removeEventListener('click', deleteRoute);
};

const showWallDashboard = function () {
  let html = '';
  for (let i = 0; i < 1420; i++) {
    html += `<div class="c-wall__grid--item dropzone " id=${i}></div>`;
  }
  document.querySelector('.js-wall').innerHTML = html;
  console.info('Grid loaded');
};

const showGripsDashboard = function (data) {
  showWallDashboard();
  wall = document.querySelectorAll('.c-wall');
  wallItem = document.querySelectorAll('.c-wall__grid--item');

  for (let j = 0; j < data.grips.length; j++) {
    let index = data.grips[j].points.x - 1 + (data.grips[j].points.y - 1) * 20;
    wallItem[index].setAttribute('data-id', data.routeID);
    wallItem[index].setAttribute('draggable', 'true');
    wallItem[index].classList.add('draggable');

    switch (data.grips[j].handgriptype) {
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
  console.log('Grips loaded');
  removeEventListeners();
  listenToUIDashboard();
};

// #endregion

// #region ***  User / login  ***********
const GetLogin = async function () {
  console.log('Checking login');
  let url = 'https://meeclimb.be/auth/login';

  await fetch(url).then((res) => {
    if (res.status == 200) {
      console.log('logged in');
      getUserData();
    } else {
      console.log('not logged in');
    }
  });
};

const getUserData = async function () {
  let url = 'https://meeclimb.be/api/user';
  currentuser = await fetchPromis(url);
  showLogin();
};

const showLogin = function () {
  let htmlDesktop = `<a href="#notifications" class="c-nav__notification has-notification" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" class="c-nav__notification--symbole" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </a>
          <a href="account.html" class="c-nav__profileimg--meta">
            <img src="${currentuser.image}" alt="profile image form ${currentuser.lastname} ${currentuser.firstname}" class="c-nav__profileimg" />
          </a>`;
  let htmlMobile = `<a href="#notifications" class="c-nav__notification has-notification" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" class="c-nav__notification--symbole" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </a>
          <a href="account.html" class="c-nav__profileimg--meta">
            <img src="${currentuser.image}" alt="profile image form ${currentuser.lastname} ${currentuser.firstname}" class="c-nav__profileimg" />
          </a>`;
  let profile = document.querySelectorAll('.js-profile');
  profile[0].innerHTML = htmlDesktop;
  profile[1].innerHTML = htmlMobile;

  if (document.querySelector('.account')) {
    document.querySelector('.js-profile-name').innerHTML = `${currentuser.firstname} ${currentuser.lastname}`;
    document.querySelector('.js-profile-nickname').innerHTML = `${currentuser.nickname}`;
    document.querySelector('.js-profile-img').innerHTML = `${currentuser.image}`;
    document.querySelector('.js-profile-friends').innerHTML = `${currentuser.friends}`;
    document.querySelector('.js-profile-climbs').innerHTML = `${currentuser.climbs}`;
    document.querySelector('.js-profile-likes').innerHTML = `${currentuser.likes}`;
  }
};

const getActivityUser = async function () {
  let url = 'https://meeclimb.be/api/activities';
  const activity = await fetchPromis(url);
  showActivityUser(activity);
};

const showActivityUser = function (activity) {
  let html = '';
  for (let i = 0; i < activity.length; i++) {
    let comments = activity[i].comments;
    let length;
    length = comments.length > 3 ? 3 : comments.length;
    for (let j = 0; j < lengte; j++) {
      commentshmtl += `<div class="c-comments">
            <div class="c-comment">
              <div class="c-comment-top">
                <img src="${comments[j].commentedby.image}" alt="profiel foto van ${comments[j].firstname} ${comments[j].lastname}" class="c-comment__img" />
                <div>
                  <p class="c-comment__name u-mb-xs">${comments[j].firstname} ${comments[j].lastname}</p>
                  <p class="c-comment__date u-mb-clear">${comments[j].timestsamp}</p>
                </div>
              </div>
              <div class="c-comment__text">${comments[j].comment}</div>
            </div>
          </div>`;
    }
    html += `<div class="c-activity">
            <div class="c-activity__top">
              <div class="c-activity__top--left">
                <img src="${currentuser.image}" alt="profiel foto van ${currentuser.firstname} ${currentuser.lastname}" class="c-activity__top--img" />
                <div>
                  <p class="u-mb-clear c-activity__top--naam">${currentuser.firstname} ${currentuser.lastname}</p>
                  <p class="u-mb-clear c-activity__top--date">${new Date(currentuser.startTime)}</p>
                </div>
              </div>
              <input type="checkbox" name="heart" id="heart" class="o-hide-accessible c-heart-checkbox" />
              <label for="heart" class="c-activity__heart">
                <svg xmlns="http://www.w3.org/2000/svg" class="c-activity__heart--symbol" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                <span>${activity.amountLikes}</span>
              </label>
            </div>
            <h5 class="u-mb-clear c-activity__intro">Heeft beklommen:</h5>
            <div class="c-activity__stats">
              <div>
                <div>Touw: <span class="c-activity__stats--meta">${activity.rope}</span></div>
                <div>Route: <span class="c-activity__stats--meta">${activity.route}</span></div>
              </div>
              <div>
                <div>Niveau: <span class="c-activity__stats--meta">${activity.Niveau}</span></div>
                <div>Snelheid: <span class="c-activity__stats--meta">${activity.prestation}</span>m/s</div>
              </div>
            </div>
            <span class="c-activity__line"></span>
            <div class="c-activity__comment--add">
              <textarea name="comment" id="comment" class="c-comment__area" rows="1" placeholder="Voeg een reactie toe"></textarea>
              <label for="send_comment" class="c-commen__button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </label>
              <input type="submit" name="send_comment" id="send_comment" class="o-hide-accessible" />
              ${commentshmtl}
            </div>
          </div>`;
  }
  document.querySelector('.js-activity').innerHTML = html;
};

const logout = function () {
  console.log('logout');
  let url = 'https://meeclimb.be/auth/logout';

  fetch(url, {
    method: 'DELETE',
  });
};
// #endregion
