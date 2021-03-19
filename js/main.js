const navHeight = document.getElementById('navbar').offsetHeight;
let navIsCollapsed = false;
const topOffsetBig = 80;
const topOffsetSmall = 48;

// Elems
const navBar = document.getElementById('navbar');

// Files
CVEnglish = require('/img/Curriculum Vitae Jan-Willem van Bremen 500779265 - English.pdf')
CVDutch = require('/img/Curriculum Vitae Jan-Willem van Bremen 500779265.pdf')

document.querySelectorAll(".menu a").forEach(item => {
  item.addEventListener('click', handleMenuClick);
})

function handleMenuClick(elem) {
  const targetElem = document.getElementById(elem.dataset.linkTo);
  window.scrollTo({top: targetElem.offsetTop - topOffsetSmall, behavior: 'smooth'});

  if (isDialogOpen()) {
    closeDialog();
  }
}

function openCV() {
  if (confirm("Open English version?")) {
    window.open(CVEnglish, '_blank', 'fullscreen=yes');
  } else {
    if (confirm("Open Dutch version?")) {
      window.open(CVDutch, '_blank', 'fullscreen=yes');
    }
  }
}

function scrollToTop() {
  window.scrollTo({top: 0, behavior: 'smooth'});
}

window.onscroll = function () {
  if (!navBar.classList.contains('shown')) {
    if (window.scrollY > topOffsetBig) {
      if (!navIsCollapsed) {
        document.getElementById('navbar').classList.add('collapsed');
      }
      navIsCollapsed = true;
    } else {
      if (navIsCollapsed) {
        document.getElementById('navbar').classList.remove('collapsed');
      }
      navIsCollapsed = false;
    }
  }
};

function showMenu() {
  navBar.classList.toggle('shown');
  if (!navBar.classList.contains('shown')) {
    window.onscroll();
  }
}

function buildDialogContents(projectName) {
    document.querySelectorAll('#dialog .title')[0].innerHTML = projectName;
}

function openDialog(projectName) {
  console.log(projectName)
  buildDialogContents(projectName);
  document.body.style.overflow = 'hidden';
  document.getElementById('dialog').classList.add('active');
}

function closeDialog() {
  document.body.style.overflow = 'auto';
  document.getElementById('dialog').classList.remove('active');
}

function isDialogOpen() {
  return document.getElementById('dialog').classList.contains('active');
}

document.getElementById('cover').playbackRate = .5;

window.handleMenuClick = handleMenuClick;
window.openCV = openCV;
window.scrollToTop = scrollToTop;
window.showMenu = showMenu;
window.openDialog = openDialog;
window.closeDialog = closeDialog;
