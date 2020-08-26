const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://admin:test12345@cluster0.de7xv.mongodb.net/auth?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then((result) => {
    console.log('DB connection established');
    app.listen(3000, () => console.log("Lesitening for requests on port 3000"));
  }).catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);

//Cookies
// app.get('/set-cookies', (req, res) => {

//   //res.setHeader('Set-Cookie', 'newUser=true');

//   //name, valapp.get('/set-cookies', (req, res) => {

//   // 3rd param is options object
//   res.cookie('newUser', false, { maxAge: 1000 * 3600, httpOnly: true });

//   res.send('Cookie sent!');

// });

// app.get('/read-cookies', (req, res) => {

//   const cookies = req.cookies;
//   console.log(cookies);

//   res.json(cookies);

// });
