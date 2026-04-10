// const { auto } = require("async");
// // const { default: Swiper } = require("swiper");

const items = document.querySelectorAll(".product-item");

items.forEach((item) => {
  const btn = item.querySelector("button");
  const product_info = item.querySelector(".product-info");

  btn.addEventListener("click", () => {
    const isOpen = product_info.classList.contains("active");
    items.forEach((i) => {
      i.querySelector(".product-info").classList.remove("active");
    });
    if (!isOpen) {
      product_info.classList.add("active");
    }
  });
});

const swiper = new Swiper(".slider-image", {
  loop: true,
  // autoplay: {
  //   delay: 3000,
  // },
  pagination: {
    el: ".berries-fruits-frozen .swiper-pagination",
    clickable: true,
  },
});
