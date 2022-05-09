import {fs,R,S,cheerio,util} from '../common'

const objs = []

const sort = R.curry((packageName, end) => {
  S.log(`Sorting results... please allow a few minutes`, {})
  let csv = "author, repo, repoUrl, stars, forks\r\n";
  R.times((i) => {
    const res = fs.readFileSync(`./dataset/${packageName}/${i}.html`, { encoding: 'utf-8' })
    const $ = cheerio.load(res)
    const els = $(`div.Box > div.Box-row`).toArray()
    els.map(el => {
      const user = $('a[data-hovercard-type="user"]', el).text()
      const org = $('a[data-hovercard-type="organization"]', el).text()
      const author = user || org
      const repo = $('a[data-hovercard-type="repository"]', el).text()
      const repoUrl = `https://github.com` + $('a[data-hovercard-type="repository"]', el).attr('href')
      const noOf = $('.pl-3', el).text()
      const [stars, forks] = R.map(Number.parseInt, R.match(/\d+/g, noOf))
      if(stars >= 50){
        csv += `${author}, ${repo}, ${repoUrl}, ${stars}, ${forks}\r\n`;
      }
    })
  }, end)

/*   const sorted = R.pipe(
    R.uniq,
    R.sortBy(R.prop(`stars`)),
    R.reverse,
    R.slice(0, 10),
    util.inspect,
  )(objs)
  S.log(`sorted`, sorted) */

  fs.writeFile("output.csv", csv, 'utf8', function (err) {
    if (err) {
      console.log("An error occurred while writing JSON Object to File.");
      return console.log(err);
    }
  })
})

export default sort

