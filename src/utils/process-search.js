export const processSearch = () => {
    const s = window.location.search.substring(1);
    const acc = s.split('&').reduce((acc, p) => {
        const [key, value] = p.split("=");
        acc[key] = value;
        return acc;
    }, {});
    return acc;
}