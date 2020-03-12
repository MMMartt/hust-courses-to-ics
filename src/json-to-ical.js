/*
 * @todo: remove side effect
 */
import { writeFile } from 'fs'
import { normalize } from 'path'
import jsIcal from 'ical.js'
import { v4 as uuid } from 'uuid'
import Log from './simple-log'

/**
 * deduplicate array
 * @param {Object[]} raw
 * @returns {Object[]}
 */
const deduplicate = raw => {
  let lessions = new Map()
  ;[...new Set(raw.map(c => JSON.stringify(c)))]
    .map(c => JSON.parse(c))
    .forEach(c => {
      const regax = /'JGXM':'(.*)','KTMC'/
      const merge = (s, c) => {
        s['txt'] = s['txt'].replace(
          regax.exec(s['txt'])[1],
          regax.exec(s['txt'])[1] + ',' + regax.exec(c['txt'])[1]
        )
        return s
      }
      let s = lessions.get(c['start'] + c['title'])
      lessions.set(c['start'] + c['title'], s ? merge(s, c) : c)
    })
  return [...lessions.values()]
}

/* istanbul ignore next */
const exportToFile = path => content => log => {
  writeFile(`${path}`, content, err => {
    if (err) {
      return Log.error(err)
    }
    return Log.log(log)
  })
}

const toJSON = content =>
  exportToFile('../build/out.json')(content)('Json file saved.')

const timeSlice = raw => {
  const rawString = String(raw)
  const slice2num = (beg, end) => Number(rawString.slice(beg, end))
  return {
    year: slice2num(0, 4),
    month: slice2num(5, 7),
    day: slice2num(8, 10),
    hour: slice2num(11, 13),
    minute: slice2num(14, 16),
    second: 0,
    isDate: false,
  }
}

const genProps = lesson => {
  return {
    summary: lesson['title'],
    uid: uuid() + '@smaroad.com',
    description: [
      /'JGXM':'(.*?)'/.exec(lesson['txt'])[1],
      /'KTMC':'(.*?)'/.exec(lesson['txt'])[1],
    ].join(' | '),
    startDate: new jsIcal.Time(timeSlice(lesson['start'])),
    endDate: new jsIcal.Time(timeSlice(lesson['end'])),
    location: /'JSMC':'(.*?)'/.exec(lesson['txt'])[1],
  }
}

const singleLessonEvent = lesson => {
  const vevent = new jsIcal.Component('vevent')
  const event = new jsIcal.Event(vevent)
  const props = genProps(lesson)
  // props is a plain object, don't need `hasOwnProperty`
  for (const prop in props) {
    event[prop] = props[prop]
  }

  return vevent
}
const addAlarm = (vevent, triggerTime, duration, repeat) => {
  const formatNum = num => `000${num}`.slice(-2)
  const alarm = new jsIcal.Component(
    /*
    BEGIN:VALARM
    TRIGGER:-PT30M
    REPEAT:2
    DURATION:PT15M
    ACTION:DISPLAY
    END:VALARM
    */
    [
      'valarm',
      [
        ['trigger', {}, 'duration', `-PT${formatNum(triggerTime)}M`],
        ['duration', {}, 'duration', `PT${formatNum(duration)}M`],
        ['action', {}, 'text', 'AUDIO'],
        ['reapeat', {}, 'text', `${repeat}`],
      ],
      [],
    ]
  )
  vevent.addSubcomponent(alarm)
  return vevent
}

const parseToICal = (lessons, configure) => {
  const { alarm = false, triggerTime = 30, duration = 5, repeat = 2 } =
    configure || {}

  const comp = new jsIcal.Component(['vcalendar', [], []])

  comp.updatePropertyWithValue('prodid', '-//github/MMMartt')

  lessons.forEach(lesson => {
    const vevent = singleLessonEvent(lesson)
    comp.addSubcomponent(
      alarm ? addAlarm(vevent, triggerTime, duration, repeat) : vevent
    )
  })
  return comp.toString()
}

/* istanbul ignore next */
const toICAL = (content, configure) => {
  const lessons = deduplicate(JSON.parse(content))
  const path = __dirname + '/../build/out.ics'
  return exportToFile(normalize(path))(parseToICal(lessons, configure))(
    `${lessons.length} lessons are saved into iCal file at \'build/out.ics\', it can be imported to multi calendar apps.`
  )
}

export { toJSON, toICAL, parseToICal, deduplicate }
