import isBrowser from "./is-browser";

function isSmallScreen(): boolean {
  return isBrowser() && window.innerWidth < 768;
}

export default isSmallScreen;
