const loader = document.getElementById('loader');

function showLoader()  {
    loader.classList.add('active');
}

function hideLoader()  {
    loader.classList.remove('active');
}

export { showLoader, hideLoader }
