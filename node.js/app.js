/**
 * app.js
 * @type {createApplication}
 * 最后修改时间: 2020年2月8日00:35:52
 */


var express = require('express')
var fs = require('fs')
var path = require('path')

var app = express()


// var {
//     getFileDir, 
//     recentPositionDir,
//     allow_cross_domain,
//     formatDateTime
//     } = require('./data/baseFunc.js/index.js.js')



/**
 *  允许跨域
 */
app.all('*', require('./baseFunc').allow_cross_domain );



const bodyParser = require('body-parser');
app.use(bodyParser.json());//数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }));//解析post请求数据


// 导入路由
require('./routes/index')(app);


app.listen(3000)

