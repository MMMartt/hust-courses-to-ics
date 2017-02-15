# hust courses to ics
Get Courses From Hub(HUST)

**Prerequisite**
+ nodejs

**Usage**
```sh
# clone this repo
git clone https://github.com/MartinNey/hust-courses-to-ics.git
# change dir
cd hust-courses-to-ics
# install packages
npm install
# edit and save it as 'student-info.json'
vi src/student-info-sample.json
# ps: you should be using vim
# if you are using Emacs, there is probably somthing wrong with you
# if you are using something that is not a real code editor, that is even worse
# :)

# run
node index.js
```
If there is no error, there should be an 'out.ics' at 'build/'. Check it and import it to app you like.
