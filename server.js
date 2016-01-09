var express = require('express');
var app = express();
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var session = require('express-session');


passport.use(new SteamStrategy({
        returnURL: 'http://localhost:3000/auth/steam/return',
        realm: 'http://localhost:3000/',
        apiKey: 'Your Api Key here'
    },
    function(identifier, profile, done) {
        process.nextTick(function() {
            profile.identifier = identifier;
            return done(null, profile);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.use(session({
    secret: 'secret secret Haha',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/steam',
    passport.authenticate('steam', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        // The request will be redirected to Steam for authentication, so
        // this function will not be called.
    });

app.get('/auth/steam/return',
    passport.authenticate('steam', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.get('/login', function(req, res) {
    res.send('Failed to Login');
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/', function(req, res) {
    if (req.user)
        res.send('Stored in session when logged : <br><br> ' + 
            JSON.stringify(req.user) + '<br><br>' +
            '<a href="/logout">Logout</a>');
    else
        res.send('Not connected : <a href="/auth/steam"><img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_small.png"></a>');
});



app.listen(3000);
console.log('running on port 3000');