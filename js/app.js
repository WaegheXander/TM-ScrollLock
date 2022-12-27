let slider;

const GetDomElements = function () {
    slider = document.querySelector('.js-slider');
}

const listenToSlider = function () {
    const array_values = [0,232,464,696,928];
    //set transistion ptoperty to slider value
    slider.addEventListener('input', function () {
        document.querySelector('.js-active-item').style.setProperty('transform', 'translateX(' + array_values[slider.value] + 'px)');
    });

    //change opacity of item based on slider value
    slider.addEventListener('input', function () {
        checkOpacity();
    });
};

const checkOpacity = function () {
  document.querySelectorAll(".c-item__inner").forEach(function (item) {
    item.style.setProperty("opacity", "0.2");
  });
  const activeElement =
    document.querySelectorAll(".c-item__inner")[slider.value];
  activeElement.style.setProperty("opacity", "1");
};

document.addEventListener('DOMContentLoaded', function() {
    GetDomElements();
    checkOpacity();
    listenToSlider();
});
