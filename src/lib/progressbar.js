const { map, range } = require('mojiscript')

const progressBar = ({ size, percent = 0 } = {}) => {
  const progress = Math.round(size * percent)
  return `[${'='.repeat(progress)}${'-'.repeat(size - progress)}] ${Math.round(
    percent * 100
  )}%`
}

const animateProgressBar = ({ steps = 1, size = 10 }) =>
  map(i => progressBar({ size, percent: i / (steps - 1) }))(range(0)(steps))

module.exports = {
  animateProgressBar
}
