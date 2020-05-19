const timeDiff = {};
timeDiff.oneSecond = 1000;
timeDiff.oneMinute = (() => timeDiff.oneSecond * 60)();
timeDiff.oneHour = (() => timeDiff.oneMinute * 60)();
timeDiff.oneDay = (() => timeDiff.oneHour * 24)();
timeDiff.oneWeek = (() => timeDiff.oneDay * 7)();
timeDiff.oneMonth = (() => timeDiff.oneWeek * 4)();
timeDiff.oneYear = (() => timeDiff.oneWeek * 12)();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const timeCalculator = (time) => {
  const _time = new Date(time);
  const diff = Date.now() - _time;
  const yearDiff = new Date().getFullYear() - _time.getFullYear();
  if (yearDiff > 1) {
    return _time.getFullYear();
  } else if (diff < timeDiff.oneMinute) {
    return `${Math.floor(diff / timeDiff.oneSecond)} seconds ago.`;
  } else if (diff < timeDiff.oneHour) {
    return `${Math.floor(diff / timeDiff.oneMinute)} minutes ago.`;
  } else if (diff < timeDiff.oneDay) {
    return `${Math.floor(diff / timeDiff.oneHour)} hours ago.`;
  } else if (diff < timeDiff.oneWeek) {
    return `${Math.floor(diff / timeDiff.oneDay)} days ago.`;
  } else if (diff < timeDiff.oneMonth) {
    return `${Math.floor(diff / timeDiff.oneWeek)} weeks ago.`;
  } else if (diff < timeDiff.oneYear) {
    return `${Math.floor(diff / timeDiff.oneMonth)} months ago.`;
  }
}
export {
  timeCalculator as default,
  months,
};