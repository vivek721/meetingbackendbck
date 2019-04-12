const express = require('express');
const appConfig = require("./../../config/appConfig")
const userController = require("../controller/userController");
const meetingController = require("./../controller/meetingController")

const fs = require("fs")
const auth = require("../middlewares/auth");


module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}/meeting`;

  //get all user List
  app.get(`${baseUrl}/allUsers`, auth.isAuthorized, userController.getAllUsers);

  //create event 
  app.post(`${baseUrl}/createEvent`, auth.isAuthorized, meetingController.createEvent)

  //get event 
  app.post(`${baseUrl}/getEvent`, auth.isAuthorized, meetingController.getEvents)

  // Edit Event
  app.post(`${baseUrl}/:id/editEvent`, auth.isAuthorized, meetingController.editEvent)

  //Delete Event
  app.get(`${baseUrl}/:id/deleteEvent`, auth.isAuthorized, meetingController.deleteEvent)

}