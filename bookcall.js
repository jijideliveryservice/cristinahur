//side menu

const openMenuTag = document.querySelector(".open-menu")
const closeMenuTag = document.querySelector(".close-button")
const menuPanelTag = document.querySelector(".menuPanel")
const mainTag = document.querySelector("main")
const bodyTag = document.querySelector("body")

openMenuTag.addEventListener("click", function () {
  menuPanelTag.classList.add("open")
  bodyTag.classList.add("menu-open")

  if (menuPanelTag.classList.contains("open")) {
    
    closeMenuTag.addEventListener("click", function () {
    menuPanelTag.classList.remove("open")
    menuPanelTag.style.transition = `right .8s ease`
    closeMenuTag.style.transition = `right .8s ease`
    bodyTag.classList.remove('menu-open'); 

    })
  }

})