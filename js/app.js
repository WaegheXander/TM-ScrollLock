document.addEventListener('DOMContentLoaded', function () {
  toggleNav();
  showWall();
});

function toggleNav() {
  let toggleTrigger = document.querySelectorAll('.js-toggle-nav');
  for (let i = 0; i < toggleTrigger.length; i++) {
    toggleTrigger[i].addEventListener('click', function () {
      document.querySelector('body').classList.toggle('has-mobile-nav');
    });
  }
}

const showWall = function () {
  let html = '';
  for (let i = 0; i < 1420; i++) {
    html += '<div class="c-wall__grid--item"></div>';
  }
  html += '<svg id="gfg" width="200" height="200" class="c-wall__svg"></svg>';
  document.querySelector('.js-wall').innerHTML = html;
  showGrips();
};

const getWallRoutes = function () {
  return fetch('https://waeghexander.github.io/TeamProject_Proto/js/dummydata.json').then((response) => response.json().catch((error) => console.log(error)));
};

const showGrips = async function () {
  let wall = document.querySelectorAll('.c-wall');
  let wallItem = document.querySelectorAll('.c-wall__grid--item');
  const routes = await getWallRoutes();

  const topDiffrence = wallItem[20].getBoundingClientRect().top - wallItem[0].getBoundingClientRect().top;
  const leftDiffrence = wallItem[1].getBoundingClientRect().left - wallItem[0].getBoundingClientRect().left;

  let cords = [];
  for (let i = 0; i < routes.length; i++) {
    let top = routes[i].point[0] * topDiffrence - topDiffrence;
    if (top < 0) {
      top = 0;
    }
    let left = routes[i].point[1] * leftDiffrence - leftDiffrence;
    if (left < 0) {
      left = 0;
    }
    cords.push({ xpoint: top, ypoint: left });
  }

  var points = cords;

  var Gen = d3
    .line()
    .x((p) => p.xpoint)
    .y((p) => p.ypoint)
    .curve(d3.curveCardinal);

  d3.select('#gfg').append('path').attr('d', Gen(points)).attr('fill', 'none').attr('stroke', '#5804f4').attr('stroke-width', '2').attr('class', 'js-path');

  for (let i = 0; i < routes.length; i++) {
    let x = routes[i].point[0];
    let y = routes[i].point[1];
    let index = x - 1 + (y - 1) * 20;
    wallItem[index].classList.add('c-wall__grid--item--grip');
  }

  animatePath();
};

const animatePath = function () {
  const path = document.querySelector('.js-path');
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = 0 - length;
};
