# hust courses to ics

Get Courses From Hub(HUST)

**Prerequisite**
+ `Node.js`
+ `npm/yarn`
+ `ImageMagick`: [offcial website](https://imagemagick.org/script/download.php)

**Usage**
```sh
# clone this repo
git clone https://github.com/MMMartt/hust-courses-to-ics.git
# change dir
cd hust-courses-to-ics
# install packages
npm i
# replace sample configuration with yours
cp configs/student-info-sample.js configs/student-info.js
vi configs/student-info.js
# use vi or other editors
# ps: you should be using vim
# if you are using Emacs, there is probably somthing wrong with you
# if you are using something that is not a real code editor, that is even worse
# :)

# tesseract will automatically download its training data
# however, you can download it manually, then put it in ./

# run, if it fails, you can check your configuration and retry it.
npm start
# lessons should be saved as iCal file at 'build/out.ics'
# it can be imported to multi calendar apps. XD
```

**Test**
```sh
npm test
# or
npm test-watch
```
