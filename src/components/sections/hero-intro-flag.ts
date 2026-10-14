/**
 * The "this tab has already seen the hero intro" flag. No directive: the root
 * layout renders the script on the server and `HeroIntro` writes the flag on
 * the client, so both sides need these values.
 */

export const INTRO_FLAG = "tws:intro-seen";

/** `:root[data-intro="seen"]` keys off this. */
export const INTRO_SEEN = "seen";

/**
 * The blocking script in the root layout. Reads the flag, never writes it, so
 * a reload part way through replays the intro rather than swallowing it. Runs
 * before the body is parsed, so the wall is never painted and then removed.
 */
export const INTRO_FLAG_SCRIPT = `try{if(sessionStorage.getItem(${JSON.stringify(
  INTRO_FLAG,
)})==="1")document.documentElement.dataset.intro=${JSON.stringify(
  INTRO_SEEN,
)}}catch(e){}`;
