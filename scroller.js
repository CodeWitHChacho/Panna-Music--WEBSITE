const scroller = document.getElementById("imageScroller");
const track = scroller.querySelector(".scroll-track");

let isDragging = false;
let startX = 0;
let scrollLeft = 0;

// Mouse drag scroll
track.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.pageX - track.offsetLeft;
  scrollLeft = scroller.scrollLeft;
  track.style.cursor = "grabbing";
});

track.addEventListener("mouseleave", () => {
  isDragging = false;
  track.style.cursor = "grab";
});

track.addEventListener("mouseup", () => {
  isDragging = false;
  track.style.cursor = "grab";
});

track.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - track.offsetLeft;
  const walk = (x - startX) * 1.5;
  scroller.scrollLeft = scrollLeft - walk;
});

// Touch support
track.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  scrollLeft = scroller.scrollLeft;
});

track.addEventListener("touchend", () => {
  isDragging = false;
});

track.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const x = e.touches[0].clientX;
  const walk = (x - startX) * 1.5;
  scroller.scrollLeft = scrollLeft - walk;
});
