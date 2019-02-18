var express = require('express');
var exphbs  = require('express-handlebars');
var PORT = process.env.PORT || 3000; 
var app = express();
var models = require("./models");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
 
app.get('/', function (req, res) {
    res.render('home');
});

models.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log(`Server now listening on port: ${PORT}`);
    });
});