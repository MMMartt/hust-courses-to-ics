import fs from 'fs'
import jsical from 'ical.js'
import uuid from 'uuid/v4'

export const toJSON = (content) => {
  fs.writeFile('../build/out.json', content, (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('json saved.')
  })
}
export const toICAL = (content) => {
  const lessons = JSON.parse(content)
  //let comp = new ICAL.

  let comp = new jsical.Component(['vcalendar', [], []])
  comp.updatePropertyWithValue('prodid', '-//gayhub/MartinNey')
  console.log(`${lessons.length} lessons.`)
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
    const vevent = new jsical.Component('vevent'),

      event = new jsical.Event(vevent)

    event.summary = lesson['title']

    event.uid = uuid() + '@smaroad.com'

    event.description = [/'JGXM\':\'(.*?)'/.exec(lesson['txt'])[1], /'KTMC\':\'(.*?)'/.exec(lesson['txt'])[1]].join(' | ')

    //TODO:convert timezone
    event.startDate = new jsical.Time(timeSlice(lesson['start']))
    event.endDate = new jsical.Time(timeSlice(lesson['end']))

    event.location = /'JSMC\':\'(.*?)'/.exec(lesson['txt'])[1]
    //event
    //vevent.addPropertyWithValue('x-my-custom-property', 'custom');
    comp.addSubcomponent(vevent)
  })
  fs.writeFile('../build/out.ics', comp.toString(), (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('lessons are saved as iCal file at \'build/out.ics\', it can be imported to multi calendar apps.')
  })
}
