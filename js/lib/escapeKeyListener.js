function escapeKeyListener(evt) {
    evt = evt || window.event;
    let isEscape;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        closeDialog()
    }
}

export { escapeKeyListener }
