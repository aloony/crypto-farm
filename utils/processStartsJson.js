const fs = require('fs')

module.exports = (method, profile, date) => {

  if (method == 'read') {

    if (fs.existsSync('./starts.json')) {
      let starts = fs.readFileSync('./starts.json', { encoding: 'utf-8' })
      return JSON.parse(starts)
    } else {
      let starts = new Array(process.env.PROFILE_COUNT).map((v, i) => ({ profile: `${process.env.PROFILE_NAME}-${i + 1}`, date: new Date() }))
      fs.writeFileSync('./starts.json', JSON.stringify(starts), { encoding: 'utf-8' })
      return starts
    }

  } else {

    let starts = JSON.parse(fs.readFileSync('./starts.json', { encoding: 'utf-8' }))

    starts = starts.map(v => v.profile == profile ? { ...v, date } : v);

    fs.writeFileSync('./starts.json', JSON.stringify(starts), { encoding: 'utf-8' })

  }

}