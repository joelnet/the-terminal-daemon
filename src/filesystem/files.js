const files = [
  {
    name: 'bin',
    type: 'd',
    fs: [
      { name: 'adduser', type: 'f' },
      { name: 'clear', type: 'f' },
      { name: 'ls', type: 'f' },
      { name: 'passwd', type: 'f' },
      { name: 'pkg', type: 'f' },
      { name: 'pwd', type: 'f' },
      { name: 'time', type: 'f' },
      { name: 'train', type: 'f' },
      { name: 'whoami', type: 'f' }
    ]
  },
  { name: 'home', type: 'd', fs: [] }
]

module.exports = {
  files
}
