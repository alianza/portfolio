function calculateYearsSinceDate(date) {
    const now = new Date();
    const diff = Math.abs(now - date );
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365)); // Years since date
}

export {calculateYearsSinceDate}
