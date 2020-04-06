/**
 * yoho-activity-platform app
 * @author: leo<qi.li@yoho.cn>
 * @date: 2017/6/23
 */
'use strict';
const env = process.env.NODE_ENV || 'test';
const port = env === 'production' ? 9090 : 9080;
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static('dist'));
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});
app.listen(port, function() {
  console.log('started successfully, listening on port:' + port);
});
