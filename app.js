
const express = require('express')
const Controller = require('./Controllers/Controller')
const app = express()
const port = 3000
const session = require(`express-session`)
const multer  = require('multer')
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });




app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: true }
}));

app.get('/',Controller.showLandingPage)
app.get('/register',Controller.showRegister)
app.post('/register',Controller.postRegister)
app.get('/login',Controller.showLogin)
app.post('/login',Controller.postLogin)

app.use((req, res, next) => {
  if (req.session) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.get('/home', Controller.showHome);
app.get('/addTweet', Controller.addTweet);
app.post('/addTweet', upload.single('image'), Controller.postTweet);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})