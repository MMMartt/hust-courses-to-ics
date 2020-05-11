/* istanbul ignore file */
import chalk from 'chalk'

const stringifyHeaders = headers =>
  JSON.stringify(
    headers,
    [
      'date',
      'Host',
      'Referer',
      'User-Agent',
      'cookie',
      'set-cookie',
      'expires',
      'location',
    ],
    2
  )
const response = r => {
  // Since fetch doesn't have request headers in its return,
  // this part won't work anymore
  // console.log(
  //   chalk.blue('==== req ====>\n'),
  //   stringifyHeaders(r.request.headers),
  //   chalk.blue('\n==== req ====>')
  // )
  console.log(
    chalk.bold('==== status ====\n'),
    r.status,
    chalk.bold('\n==== status ====')
  )
  console.log(
    chalk.yellow('<==== res ====\n'),
    stringifyHeaders(r.headers),
    chalk.yellow('\n<==== res ====')
  )
}
const error = e =>
  console.log(chalk.red('==== error ====\n'), e, chalk.red('\n==== error ===='))
const log = (l, t = 'log') =>
  console.log(chalk.bold(`==== ${t} ====\n`), l, chalk.bold(`\n==== ${t} ====`))
const Log = {
  response,
  error,
  log,
}
export default Log
