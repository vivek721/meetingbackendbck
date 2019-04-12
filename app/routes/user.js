const express = require('express');
const appConfig = require("./../../config/appConfig")
const userController = require("../controller/userController")
const fs = require("fs")
const auth = require("../middlewares/auth");


let countryName;
let countryCode;

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;
    /*  Send country Name */
    app.get(`${baseUrl}/countryName`, (req, res) => {
        fs.readFile('../Meeting-Backend/config/names.json', 'utf8', function (err, data) {
            if (err) throw err;
            countryName = JSON.parse(data);
        });

        res.send(countryName);
    });

    /*  Send country Name */
    app.get(`${baseUrl}/countryCode`, (req, res) => {
        fs.readFile('../Meeting-Backend/config/phone.json', 'utf8', function (err, data) {
            if (err) throw err;
            countryCode = JSON.parse(data);
        });

        res.send(countryCode);
    });

    /* signup param: firstname,lastname,emailid,phonenumber,password */
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    /* signin params: emailId,password */
    app.post(`${baseUrl}/login`, userController.loginFunction);

    /* to send password reset mail */
    app.post(`${baseUrl}/resetPassword`, userController.PasswordResetMail);

    /* to reset password */
    app.post(`${baseUrl}/resetNewPassword`, userController.resetPassword);

    //logout
    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);
}