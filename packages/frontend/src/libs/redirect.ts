interface RedirectToURLExtraSettings {
  pageReload?: boolean;
}

export default function redirectToURL(url: string, { pageReload }: RedirectToURLExtraSettings = {}) {
  if (!pageReload) {
    history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  } else {
    window.location.href = url;
  }
}
