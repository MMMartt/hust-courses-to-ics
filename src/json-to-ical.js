const fs = require('fs');
const jsical = require('ical.js');
const uuid = require('node-uuid');


module.exports = {
  exportToJSON: (content) => {
    fs.writeFile("../build/out.json", content, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file saved!");
    });
  },
  exportToICAL: (content) => {
    const lessons = JSON.parse(content);
    //let comp = new ICAL.

    let comp = new ICAL.Component(['vcalendar', [], []]);
    comp.updatePropertyWithValue('prodid', '-//gayhub/MartinNey');
    const valueToSlice = (str, beg, end) => Number(String(str).slice(beg, end));
    console.log(lessons.length, 'lessons.');
    for (let i in lessons) {
      const lesson = lessons[i];
      let vevent = new jsical.Component('vevent'),
      event = new jsical.Event(vevent);
      event.summary = lesson['title'];
      event.uid = uuid.v1() + '@smaroad.com';
      event.description = [/'JGXM\':\'(.*?)'/.exec(lesson['txt'])[1], /'KTMC\':\'(.*?)'/.exec(lesson['txt'])[1]].join(' | ')
      event.startDate = new ICAL.Time({
        year: valueToSlice(lesson['start'], 0, 4),
        month: valueToSlice(lesson['start'], 5, 7),
        day: valueToSlice(lesson['start'], 8, 10),
        hour: valueToSlice(lesson['start'], 11, 13),
        minute: valueToSlice(lesson['start'], 14, 16),
        second: valueToSlice(lesson['start'], 8, 10),
        isDate: false
      });
      event.endDate = new ICAL.Time({
        year: valueToSlice(lesson['end'], 0, 4),
        month: valueToSlice(lesson['end'], 5, 7),
        day: valueToSlice(lesson['end'], 8, 10),
        hour: valueToSlice(lesson['end'], 11, 13),
        minute: valueToSlice(lesson['end'], 14, 16),
        second: valueToSlice(lesson['end'], 8, 10),
        isDate: false
      });
      event.location = /'JGXM\':\'(.*?)'/.exec(lesson['txt'])[1];
      //event
      //vevent.addPropertyWithValue('x-my-custom-property', 'custom');
      comp.addSubcomponent(vevent);
    }
    fs.writeFile("../build/out.ics", comp.toString(), function(err) {
        if(err) {
            return console.log(err);
        }
      console.log(".ics file is saved at 'build/out.ics', you can import you lessons into many other calendar app now!");
    });
  }
};
