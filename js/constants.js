// Variables
const topOffsetBig = 80
const topOffsetSmall = 48
const smallWidth = 480
const mediumWidth = 768
const largeWidth = 900

// Elements
const navBar = document.getElementById('navbar')
const dialog = document.getElementById('dialog')
const dialogContent = document.getElementById('dialog-content')
const logo = document.getElementById('logo')

const projectFragment = (name, project, index) => {
    return `<div class="col clickable ${index > 5 ? 'hidden' : ''}" onclick="onProjectClick(this.dataset.name)" 
                 data-name="${name}" data-team="${project.team}" data-tech="${project.tech}">
             <img class="img" alt="${name} project" src="../projects/${name}/${name}.webp" onerror="this.src='../tile.webp'"/>
             <h1>${project.name} - ${project.suffix}</h1>
          </div>`
}

export {
    topOffsetBig,
    topOffsetSmall,
    smallWidth,
    mediumWidth,
    largeWidth,
    navBar,
    dialog,
    dialogContent,
    logo,
    projectFragment
}
