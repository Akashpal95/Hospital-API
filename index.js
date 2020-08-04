const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000; //port 80 for production level code
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
const passport = require('passport');
//Although these are not directly being used here, it needs to loaded here to work
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');

const db = require(`./config/${process.env.NODE_ENV}`);
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');

app.use(express.urlencoded());
app.use(cookieParser());
//The order of these middlewares are very important
//mongo store is used to store the session in the db rather in the local
app.use(session({
    name:'codeial', 
    //TODO change the secret before deployment
    secret:'blahsomething',
    saveUninitialized: false, //When there is a session is not initialised i.e. user didn't login don't send extra data in cookie
    resave:false, //Identity is already established session data is present don't re-write the same thing
    cookie: {
        maxAge : (1000*60 *100)
    },
    store: new MongoStore({
        mongooseConnection : db,
        autoRemove: 'disabled'
    }, function(err){
        console.log(err || 'connect-mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

//Sets the user from the session cookie to locals
app.use(passport.setAuthenticatedUser);

//use express router
app.use('/', require('./routes'))

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});

module.exports = app;