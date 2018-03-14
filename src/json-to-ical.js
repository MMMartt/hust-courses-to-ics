/*
 * @todo: remove side effect
 */
import fs from 'fs'
import jsIcal from 'ical.js'
import uuid from 'uuid/v4'
import Log from './simple-log'

const exportToFile = path => content => log => {
  fs.writeFile(`${path}`, content, (err) => {
    if (err) {
      return Log.error(err)
    }
    return Log.log(log)
  })
}

export const toJSON = content => exportToFile('../build/out.json')(content)('Json file saved.')

const timeSlice = raw => {
  const rawString = String(raw)
  const slice2num = (beg, end) => Number(rawString.slice(beg, end))
  return {
    year: slice2num(0, 4),
    month: slice2num(5, 7),
    day: slice2num(8, 10),
    hour: slice2num(11, 13),
    minute: slice2num(14, 16),
    second: slice2num(8, 10),
    isDate: false
  }
}

const genProps = lesson => ({
  summary: lesson['title'],
  uid: uuid() + '@smaroad.com',
  description: [/'JGXM\':\'(.*?)'/.exec(lesson['txt'])[1], /'KTMC\':\'(.*?)'/.exec(lesson['txt'])[1]].join(' | '),
  startDate: new jsIcal.Time(timeSlice(lesson['start'])),
  endDate: new jsIcal.Time(timeSlice(lesson['end'])),
  location: /'JSMC\':\'(.*?)'/.exec(lesson['txt'])[1]
})

const singleLessonEvent = lesson => {
  const vevent = new jsIcal.Component('vevent')
  const event = new jsIcal.Event(vevent)
  const props = genProps(lesson)
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
      []
    ]
  )
  vevent.addSubcomponent(alarm)
  return vevent
}

export const toICAL = (content, configure) => {
  const lessons = JSON.parse(content)
  const { alarm = false, triggerTime = 30, duration = 5, repeat = 2 } = configure || {}

  const comp = new jsIcal.Component(['vcalendar', [], []])

  comp.updatePropertyWithValue('prodid', '-//github/MMMartt')

  lessons.forEach((lesson) => {
    const vevent = singleLessonEvent(lesson)
    comp.addSubcomponent(alarm ? addAlarm(vevent, triggerTime, duration, repeat) : vevent)
  })

  return exportToFile('../build/out.ics')(comp.toString())(
    `${lessons.length} lessons are saved into iCal file at \'build/out.ics\', it can be imported to multi calendar apps.`
  )
}
