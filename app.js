if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const { getDefaultSettings } = require('http2');
const path = require('path');
const ejsMate = require('ejs-mate');
const nodemailer = require('nodemailer');

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
});

//View engine setup
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');

//body Parser replacement Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Additional file directories
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home.ejs', {title: "Glyn's Gardening Service"})
})

app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.fname}</li>
            <li>Name: ${req.body.lname}</li>
            <li>Name: ${req.body.phone}</li>
            <li>Name: ${req.body.email}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
    // console.log(req.body);

    let transporter = nodemailer.createTransport({
        //domain host where website is held
        host: 'mail.yahoo.com', //smtp.
        port: 587,
        secure: false,
        auth:  {
            user: 'warren_laura@yahoo.co.uk',
            pass: 'ayjddsgkvkyztsko'
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: `${req.body.email}`,
        to: 'warren_laura@yahoo.co.uk',
        subject: `Message from ${req.body.fname}: ${req.body.lname}: ${req.body.phone}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            return console.log(error);
        }
            console.log('Email sent: %s', info.messageId);
            console.log('Preview URL: %s', node.mailer.getTestMeassageUrl(info));

            res.render('home')
        });
 });