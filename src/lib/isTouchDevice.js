const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
const mq = (query) => window.matchMedia(query).matches;

// Source: https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
export default () => {
  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  return mq(query);
}
