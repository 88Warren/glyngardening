// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

const express = require('express');
const bodyParser = require('body-parser');
const { getDefaultSettings } = require('http2');
const path = require('path');
const ejsMate = require('ejs-mate');
const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport")
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
        let transporter = nodemailer.createTransport(smtpTransport ({
            //domain host where website is held
            service: "gmail",
            // host: 'stmp.mail.yahoo.com', //smtp.
            // port: 465,
            // secure: true,
            auth:  {
                user: 'lauramwar88@gmail.com',
                pass: 'Cy3k5jz7x?'
            }
        })
        );

        var fname = req.body.fname
        var lname= req.body.lname
        var email = req.body.email
        var phone = req.body.phone
        var message =req.body.message

        const ejs = require("ejs");

//   ejs.renderFile(__dirname + "/views/home.ejs", { fname: fname, lname: lname, phone: phone }, function (err, data) {
//     if (err) {
//         console.log(err);
//     } else {
        
            let mailOptions = {
                from: 'lauramwar88@gmail.com',
                to: email,
                subject: `Message from ${req.body.fname}: ${req.body.lname}: ${req.body.phone}`,
            text:req.body.message
            
        };
    

        // let mailOptions = {
        //     from: 'lauramwar88@gmail.com',
        //     to:req.body.to,
        //     subject: `Message from ${req.body.fname}: ${req.body.lname}: ${req.body.phone}`,
        //     text: req.body.message
        // };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                 console.log("there was an error", error)
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
              
            // return res.status(200).json({message: "message sent"})
        });
    // }
        //redirects here 
            res.writeHead(301, { Location: '/' });
            res.end();
    })
// });