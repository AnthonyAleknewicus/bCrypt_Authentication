const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const User = require('./models/user')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/authDemo', { autoIndex: false });
    await console.log('Database CONNECTED!')
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
}

app.get('/', (req, res) => {
    res.send('THIS IS THE HOMEPAGE!');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    })
    await user.save()
    req.session.user_id = user._id;
    res.redirect('/secret');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    const validPassword = await bcrypt.compare(password, user.password);
    if(validPassword) {
        req.session.user_id = user._id;
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }
    
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    //Another option to get rid of everything rather than setting one property to null
    // req.session.destroy()
    res.redirect('login');
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret')    
})




app.listen(3000, () => {
    console.log("CONNECTED ON PORT 3000!")
})