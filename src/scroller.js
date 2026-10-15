// Shared handles for the page's smooth scroller, so sections can pause it while they
// take over scrolling (the Services reel) and so link clicks can scroll without fighting it.
export const scroller = {
  lenis: null,
  // true while a link click is smoothly scrolling the page somewhere
  nav: false,
}
