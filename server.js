//Install express server
const express = require('express');
const path = require('path');

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
     );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
  next();
});

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/todo-app'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/todo-app/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
