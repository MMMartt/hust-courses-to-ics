#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json
import re
import os
import sys
import os.path
import base64
from datetime import datetime



class HubGetLessons(object):
    """Get Hub From The URL"""
    HOMEPAGEURL = r'http://s.hub.hust.edu.cn/hub.jsp'
    LOGINURL = r'http://s.hub.hust.edu.cn/hublogin.action'
    LESSONSURL = r'http://s.hub.hust.edu.cn/aam/score/CourseInquiry_ido.action'
    HEADERS = {
            'User-Agent': r'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36',
            'Connection': 'keep-alive',
            'Referer': 'http://s.hub.hust.edu.cn/index.jsp',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
    COOKIEPATH = os.path.join(sys.path[0], 'cookie')
    CAPTCHAPATH = os.path.join(sys.path[0], 'captcha.gif')
    OUTICSPATH = os.path.join(sys.path[0], 'Lessons.ics')
    def __init__(self):
        os.chdir(sys.path[0])
        self.__session = requests.Session()
        self.__session.headers = self.HEADERS
        self.__cookie = self.__loadCookie()
        if self.__cookie:
            print('Cookie Found')
            self.__session.cookies.update(self.__cookie)
            ReOfName = re.compile(r'<div class="name3">欢迎! (.*?)<\/div>')
            Name = re.findall(ReOfName, self.open(self.HOMEPAGEURL).text)
            if len(Name) > 0:
                print('Login Success!')
                print('User:', Name[0])
            else:
                print('Login Fail(Cookie Wrong), Please Login')
                self.Login()
        else:
            print('No Cookie, Login Please.')
            self.Login()

    def Login(self):
        """Login Hub System
        :returns: TODO

        """
        while True:
            self.__username = input('Please Input Your Student ID:')
            self.__password = input('Please Input Your Password:').encode('ascii')

            data = {
                    'username': self.__username,
                    'password': base64.b64encode(self.__password),
                    'ln':'app42.dc.hust.edu.cn'
                    }
            print(data)
            res = self.__session.post(self.LOGINURL, data=data)
            ReOfName = re.compile(r'<div class="name3">欢迎! (.*?)<\/div>')
            print(self.open(self.HOMEPAGEURL).text)
            Name = re.findall(ReOfName, self.open(self.HOMEPAGEURL).text)
            print(Name)
            if len(Name) > 0:
                print('Login Success!')
                print('User:', Name[0])
                self.__saveCookie()
                break
            else:
                print('Login Fail, Again Please.')


    def __loadCookie(self):
        """Load Cookie In Locale File
        :returns: Dict Or None

        """
        if os.path.exists(self.COOKIEPATH):
            print('-'*30)
            with open(self.COOKIEPATH, 'r') as File:
                return json.load(File)
        return None
    def __saveCookie(self):
        """Save Cookie
        save cookies by dict to str
        """
        with open(self.COOKIEPATH, 'w') as File:
            cookie = self.__session.cookies.get_dict()
            json.dump(cookie, File)
            print('-'*30)
            print('Cookie saved as', self.COOKIEPATH)
    def open(self, url, delay=0, timeout=10):
        """open url
        :url: str
        :returns: response
        """
        if delay:
            time.sleep(delay)
        return self.__session.get(url, timeout=timeout)
    def GetSession(self):
        """Get Session
        :returns: TODO
        """
        return self.__session
    def ICSAddLine(self, String):
        """Add one Line To ics

        :String: TODO
        :returns: TODO

        """
        with open(self.OUTICSPATH, 'a') as File:
            File.write(String)
            File.write('\n')

        
    def GetLesson(self):
        """Get Lessons Json
        :returns: TODO

        """
        def WriteSingleEvent(uid, EventList):
            """Write One Event To ICS

            :uid: TODO
            :returns: TODO

            """
            def FormatTime(Time):
                TimeTmp  = datetime.strptime(Time, '%Y-%m-%d %H:%M')
                return TimeTmp.strftime(';TZID=Asia/Shanghai:%Y%m%dT%H%M%S')
            self.ICSAddLine('BEGIN:VEVENT')
            self.ICSAddLine('DTSTART%s' % FormatTime(EventList[0]))
            self.ICSAddLine('DTSTAMP%s' % FormatTime(EventList[0]))
            self.ICSAddLine('DTEND%s' % FormatTime(EventList[1]))
            self.ICSAddLine('UID:wowo1024uid%d@smaroad.com' % uid)
            self.ICSAddLine('DESCRIPTION:老师: %s  |%s' % (EventList[4], EventList[5]))
            self.ICSAddLine('LOCATION:%s' % EventList[3])
            self.ICSAddLine('SEQUENCE:0')
            self.ICSAddLine('STATUS:CONFIRMED')
            self.ICSAddLine('SUMMARY:%s' % EventList[2])
            self.ICSAddLine('TRANSP:OPAQUE')
            self.ICSAddLine('END:VEVENT')

        ReOfLesson = re.compile(r'(?:\{"start":")(.*?)(?:","end":")(.*?)(?:","title":").*?(?:KCMC\':\')(.*?)(?:\',\'JSMC\':\')(.*?)(?:\',\'JGXM\':\')(.*?)(?:\',\'KTMC\':\')(.*?)(?:\'}")')
        
        LessonData = {
                    'start': '2016-06-30',
                    'end': '2017-03-11'
                }
        res = self.__session.post(self.LESSONSURL, data=LessonData)
        res.encoding = res.apparent_encoding
        self.ICSAddLine('BEGIN:VCALENDAR')
        self.ICSAddLine('VERSION:2.0')
        self.ICSAddLine('PRODID:-//hacksw/handcal//NONSGML v1.0//EN')
        cnt = 0
        for lesson in re.findall(ReOfLesson, res.text):
            WriteSingleEvent(cnt, lesson)
            cnt += 1
        self.ICSAddLine('END:VCALENDAR')


def main():
    """Main Function
    :returns: TODO

    """
    HubSessin = HubGetLessons()
    HubSessin.GetLesson()


if __name__ == "__main__":
    main()



