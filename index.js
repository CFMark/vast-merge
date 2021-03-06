require('dotenv').config();
var express = require('express');
var exphbs  = require('express-handlebars');
var PORT = process.env.PORT || 3000; 
var app = express();
var models = require("./models");
var htmlRoutes = require("./controllers/html_controller");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static("public"));
app.use(htmlRoutes);
models.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log(`Server now listening on port: ${PORT}`);
    });
});