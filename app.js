if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const express = require('express');

const app = express()

// These id's and secrets come from .env file.

const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Hit the http://localhost:3002/send endpoint to send mail
// http://localhost:3002/send is a GET request 

app.get('/send', async (req, res) => {
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'your authorised email address',
      clientId: CLIENT_ID,
      clientSecret: CLEINT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken
    }
  });

  const mailOptions = {
    from: 'SENDER NAME <yours authorised email address@gmail.com>',
    to: 'to email address here',
    subject: 'Hello from gmail using API',
    text: 'Hello from gmail email using API',
    html: '<h1>Hello from gmail email using API</h1>',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.redirect(req.get('referer'));
})

app.listen(3002, () => {
  console.log('Serving on port 3002')
})



