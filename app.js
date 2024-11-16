if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport")
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home.ejs', {title: "Glyn's Gardening Service"})
})

app.post('/send', (req, res) => {
    let transporter = nodemailer.createTransport(smtpTransport ({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }));

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: `New Contact Form Submission from ${req.body.fname} ${req.body.lname}`,
        text: `
            Name: ${req.body.fname} ${req.body.lname}
            Email: ${req.body.email}
            Phone: ${req.body.phone}
            Message: ${req.body.message}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
            res.status(500).redirect('/');
            return;
        }
        console.log('Email sent successfully');
        res.redirect('/');
    });
});
