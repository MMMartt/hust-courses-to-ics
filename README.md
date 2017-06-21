# hust courses to ics
Get Courses From Hub(HUST)

**Prerequisite**
+ Node.js

**Usage**
```sh
# clone this repo
git clone https://github.com/MartinNey/hust-courses-to-ics.git
# change dir
cd hust-courses-to-ics
# install packages
npm i
# edit and save it as 'student-info.json'
cp configs/student-info-sample.json configs/student-info.json
vi configs/student-info.json
# ps: you should be using vim
# if you are using Emacs, there is probably somthing wrong with you
# if you are using something that is not a real code editor, that is even worse
# :)

# run
npm start
# lessons should be saved as iCal file at 'build/out.ics'
# it can imported to multi calendar apps.
```
