import fs from 'fs'
import jsical from 'ical.js'
import uuid from 'uuid/v4'
import Log from './simple-log'

export const toJSON = (content) => {
  fs.writeFile('../build/out.json', content, (err) => {
    if (err) {
      return Log.error(err)
    }
    return Log.log('json saved.')
  })
}
export const toICAL = (content) => {
  const lessons = JSON.parse(content)
  //let comp = new ICAL.

  let comp = new jsical.Component(['vcalendar', [], []])
  comp.updatePropertyWithValue('prodid', '-//gayhub/MartinNey')
  Log.log(`${lessons.length} lessons.`)
  const timeSlice = (raw) => {
    const slice2num = (str, beg, end) => Number(String(str).slice(beg, end))
    return {
      year: slice2num(raw, 0, 4),
      month: slice2num(raw, 5, 7),
      day: slice2num(raw, 8, 10),
      hour: slice2num(raw, 11, 13),
      minute: slice2num(raw, 14, 16),
      second: slice2num(raw, 8, 10),
      isDate: false
    }
  }
  lessons.forEach((lesson) => {
    const vevent = new jsical.Component('vevent')

    const event = new jsical.Event(vevent)
    const props = {
      summary: lesson['title'],
      uid: uuid() + '@smaroad.com',
      description: [/'JGXM\':\'(.*?)'/.exec(lesson['txt'])[1], /'KTMC\':\'(.*?)'/.exec(lesson['txt'])[1]].join(' | '),
      startDate: new jsical.Time(timeSlice(lesson['start'])),
      endDate: new jsical.Time(timeSlice(lesson['end'])),
      location: /'JSMC\':\'(.*?)'/.exec(lesson['txt'])[1]
    }
    for (const prop in props) {
      event[prop] = props[prop]
    }
    //vevent.addPropertyWithValue('x-my-custom-property', 'custom');
    comp.addSubcomponent(vevent)
  })
  fs.writeFile('../build/out.ics', comp.toString(), (err) => {
    if (err) {
      return Log.error(err)
    }
    return Log.log(
      'lessons are saved as iCal file at \'build/out.ics\', it can be imported to multi calendar apps.'
    )
  })
}
