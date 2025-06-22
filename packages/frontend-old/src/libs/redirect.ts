export default function redirectToURL(url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.click();
}