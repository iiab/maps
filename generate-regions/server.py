#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Fetch Menu Data from Database
# server.py

import os
from flask import Flask,request
from flask_mysqldb import MySQL
import json


application = Flask(__name__)
# Config MySQL
application.config['MYSQL_HOST'] = 'localhost'
application.config['MYSQL_USER'] = 'menus_user'
application.config['MYSQL_PASSWORD'] = 'g0adm1n'
application.config['MYSQL_DB'] = 'menus_db'
application.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(application)


@application.route('/')
def one():
    cur = mysql.connection.cursor()
    cur.execute('''SELECT name,title,id FROM menus limit 5''')
    rv = cur.fetchone()
    return str(rv)

@application.route('/all')
def all():
    cur = mysql.connection.cursor()
    lang2=request.args.get('lang')
    if not lang2 or lang2 == "":
         lang2 = 'en'
    cur.execute("SELECT id,lang,title,name FROM menus "+\
               " WHERE lang = %s ORDER BY title",(lang2,))
    rv = cur.fetchall()
    '''if len(rv) == 0:
       return "[]"'''
    rtn_str = "["
    for row in rv:
       rtn_str += "{\"name\" : \"" + row['name'] + '\",'
       rtn_str += "\"title\" : \"" + row['title'] + '\",'
       rtn_str += "\"lang\" : \"" + row['lang'] + '\",'
       rtn_str += "\"id\" : \"" + str(row['id']) + '\"},'
    rtn_str = rtn_str[:-1]
    rtn_str += "]"
    return rtn_str

@application.route('/menuitemlist')
def users():
    cur = mysql.connection.cursor()
    cur.execute('''SELECT name,title,id FROM menus''')
    rv = cur.fetchall()
    rtn_str = "["
    for row in rv:
       rtn_str += "{ \"name\" : \"" + row['name'] + '\" },'
    rtn_str = rtn_str[:-1]
    rtn_str += "]"
    return rtn_str

@application.route('/visible')
def visible():
    cur = mysql.connection.cursor()
    siterequest = request.args.get('site','default')
    cur.execute('''SELECT name,title,m.id,seq,lang,c.id as chosenid FROM menus as m,chosen as c WHERE c.menus_id = m.id ORDER BY seq''')
    #cur.execute('''SELECT name,title,id,seq FROM menus where visible=true''')
    line = 0
    rv = cur.fetchall()
    rtn_str = "["
    numrows = len(rv);
    for row in rv:
       rtn_str += "{\"name\" : \"" + row['name'] + '\" ,'
       rtn_str += "\"title\" : \"" + row['title'] + '\",'
       rtn_str += "\"lang\" : \"" + row['lang'] + '\",'
       rtn_str += "\"line\" : \"" + str(line) + '\",'
       rtn_str += "\"numrows\" : \"" + str(numrows) + '\",'
       rtn_str += "\"chosenid\" : \"" + str(row['chosenid']) + '\",'
       rtn_str += "\"seq\" : \"" + str(row['seq']) + '\",'
       rtn_str += "\"id\" : \"" + str(row['id']) + '\"},'
       line += 1
    rtn_str = rtn_str[:-1]
    rtn_str += "]"
    return rtn_str

@application.route('/extra_html')
def extra_html():
    cur = mysql.connection.cursor()
    req_name=request.args.get('name')
    cur.execute("SELECT extra_html FROM menus where name='%s'"%req_name)
    row = cur.fetchone()
    if row:
       rtn_str = row['extra_html'].replace('"','\"')
    else:
       rtn_str = ""
    return rtn_str

@application.route('/js')
def getjson():
    cur = mysql.connection.cursor()
    req_name=request.args.get('name')
    cur.execute("SELECT js FROM menus where name='%s'"%req_name)
    row = cur.fetchone()
    if row:
       nibble = row['js']
       nibble = nibble.replace('/','\/')
       nibble = nibble.replace('\n','\\n')
       nibble = nibble.replace('\r','\\r')
       nibble = nibble.replace('\t','\\t')
    else:
       nibble = "{}"
    return nibble

@application.route('/lang')
def lang():
    cur = mysql.connection.cursor()
    lang2=request.args.get('lang')
    if not lang2:
       lang2 = 'en'
    site=request.args.get('site')
    cur.execute("SELECT name,title,id FROM menus where lang=%s",(lang2,))
    rv = cur.fetchall()
    return str(rv)

@application.route('/langsavail')
def languages_available():
    cur = mysql.connection.cursor()
    lang2=request.args.get('lang')
    cur.execute("SELECT m.id,m.lang, l.name, count(m.lang) as num FROM menus as m,languages as l where m.lang = l.lang2 GROUP BY m.lang order by num desc")
    rv = cur.fetchall()
    rtn_str = "["
    for row in rv:
       rtn_str += "{ \"name\" : \"" + row['name'] + '\",'
       rtn_str += "\"lang\" : \"" + row['lang'] + '\",'
       rtn_str += "\"num\" : \"" + str(row['num']) + '\",'
       rtn_str += "\"id\" : \"" + str(row['id']) + '\"},'
    rtn_str = rtn_str[:-1]
    rtn_str += "]"
    return rtn_str

@application.route('/available')
def available():
    cur = mysql.connection.cursor()
    lang2=request.args.get('lang')
    if not lang2 or lang2 == "":
         lang2 = 'en'
    cur.execute("SELECT id,lang,title,name FROM menus "+\
               " WHERE lang = %s ORDER BY title",(lang2,))
    rv = cur.fetchall()
    '''if len(rv) == 0:
       return "[]"'''
    rtn_str = "["
    for row in rv:
       rtn_str += "{\"name\" : \"" + row['name'] + '\",'
       rtn_str += "\"title\" : \"" + row['title'] + '\",'
       rtn_str += "\"lang\" : \"" + row['lang'] + '\",'
       rtn_str += "\"id\" : \"" + str(row['id']) + '\"},'
    rtn_str = rtn_str[:-1]
    rtn_str += "]"
    return rtn_str

@application.route('/choose')
def makevisible():
    cur = mysql.connection.cursor()
    menusid=request.args.get('id')
    siterequest = request.args.get('site')
    if not siterequest:
        siterequest = 'default'
    # get the max of seq for the site
    sql = "SELECT max(seq) as max FROM menus as m, chosen as c " +\
          "WHERE c.menus_id = m.id AND c.site = %s GROUP by c.site" 
    cur.execute(sql,(siterequest,))
    rv = cur.fetchone()
    if rv and rv['max']:
         seq = rv['max'] + 1
    else:
         seq = 1
    # check to see if the required record exists
    sql = "SELECT menus_id, c.site FROM chosen as c,menus as m " +\
            "WHERE menus_id = %s AND c.site = %s"
    num = cur.execute(sql,(menusid,siterequest,))
    if num == 0: # record exists, just do update
       sql = "INSERT INTO  chosen SET menus_id = %s, site = %s, seq = %s"
    try:
       cur.execute(sql,(menusid,siterequest,seq,))
       cur.commit()
    except:
       return "{\"status\":\"fail\"}"
    return "{\"status\":\"success\"}"

@application.route('/unchoose')
def makeinvisible():
    cur = mysql.connection.cursor()
    menusid=request.args.get('id')
    if not menusid:
       return "{\"status\":\"fail\"}"
    siterequest = request.args.get('site')
    if not siterequest:
        siterequest = 'default'
    sql = "DELETE FROM chosen where menus_id = %s and site = %s"
    cur.execute(sql,(menusid,siterequest,))
    return "{\"status\":\"success\"}"

@application.route('/upchosen')
def moveup():
    cur = mysql.connection.cursor()
    menusid=request.args.get('id')
    if not menusid:
       return "{\"status\":\"fail\"}"
    # get the list of visible items
    visible_str = visible()    
    visible_list = json.loads(visible_str)
    item_num = '' 
    for item in visible_list:
       if item['id'] == menusid:
          item_num = item['line']
    if item_num == '':
       print("item not found id:%s"%menusid)
       return "{\"status\":\"fail\"}"
    item_num = int(item_num)
    if visible_list[item_num]['line'] == 0:
       return "{\"status\":\"fail\"}"
       # item_num is the item that is to be moved up 
    sql = "UPDATE chosen SET seq = %s where id = %s"
    print("updating db. %s|%s"%(visible_list[item_num]['seq'],visible_list[item_num-1]['chosenid']))
    try:
       cur.execute(sql,(visible_list[item_num]['seq'],\
                        visible_list[item_num-1]['chosenid'],))
       cur.execute(sql,(visible_list[item_num - 1]['seq'],\
                        visible_list[item_num]['chosenid'],))
    except:
       return "{\"status\":\"fail\"}"
    return "{\"status\":\"success\"}"
    
@application.route('/downchosen')
def movedown():
    cur = mysql.connection.cursor()
    menusid=request.args.get('id')
    if not menusid:
       return "{\"status\":\"fail\"}"
    # get the list of visible items
    visible_str = visible()    
    visible_list = json.loads(visible_str)
    item_num = '' 
    for item in visible_list:
       if item['id'] == menusid:
          item_num = item['line']
    if item_num == '':
       print("item not found id:%s"%menusid)
       return "{\"status\":\"fail\"}"
    item_num = int(item_num)
    if int(visible_list[item_num]['line']) == int(visible_list[item_num]['numrows']) - 1:
       return "{\"status\":\"fail\"}"
       # item_num is the item that is to be moved up 
    sql = "UPDATE chosen SET seq = %s where id = %s"
    print("updating db. %s|%s"%(visible_list[item_num]['seq'],visible_list[item_num+1]['chosenid']))
    try:
       cur.execute(sql,(visible_list[item_num]['seq'],\
                        visible_list[item_num+1]['chosenid'],))
       cur.execute(sql,(visible_list[item_num+1]['seq'],\
                        visible_list[item_num]['chosenid'],))
    except:
       return "{\"status\":\"fail\"}"
    return "{\"status\":\"success\"}"
    
if __name__ == "__main__":
    application.run(host='0.0.0.0',port=9458)

#vim: tabstop=3 expandtab shiftwidth=3 softtabstop=3 background=dark
