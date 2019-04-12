const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')


const AuthModel = mongoose.model('Auth');
const UserModel = mongoose.model('User');
const EventModel = mongoose.model('Event');


let getEvents = (req, res) => {
  let validateParams = () => {
    return new Promise((resolve, reject) => {
      if (check.isEmpty(req.body.userId)) {
        logger.info('parameters missing', 'getEvent handler', 9)
        let apiResponse = response.generate(true, 'parameters missing.', 403, null)
        reject(apiResponse)
      } else {
        resolve()
      }
    })
  } // end of the validateParams function.

  // function to get chats.
  let findEvent = () => {
    return new Promise((resolve, reject) => {
      EventModel.find({
          userId: req.body.userId
        })
        .select('-_id -__v')
        .lean()
        .exec((err, result) => {
          if (err) {
            console.log(err)
            logger.error(err.message, 'meeting Controller: findEvent', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            reject(apiResponse)
          } else if (check.isEmpty(result)) {
            logger.info('No event Found', 'meeting Controller: findEvent')
            let apiResponse = response.generate(true, 'No events Found', 404, null)
            reject(apiResponse)
          } else {
            console.log('event found and listed.')
            resolve(result)
          }
        })
    })
  } // end of the findEvent function.

  // making promise call.
  validateParams()
    .then(findEvent)
    .then((result) => {
      let apiResponse = response.generate(false, 'All Events Listed', 200, result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })
}

let createEvent = (req, res) => {
  let findUser = () => {
    console.log("findUser");
    return new Promise((resolve, reject) => {
      if (req.body.userId) {
        console.log("req body userId is there");
        console.log(req.body);
        UserModel.findOne({
          userId: req.body.userId
        }, (err, userDetails) => {
          /* handle the error here if the User is not found */
          if (err) {
            console.log(err)
            logger.error('Failed To Retrieve User Data', 'meetingController: findUser()', 10)
            /* generate the error message and the api response message here */
            let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
            reject(apiResponse);
            /* if Company Details is not found */
          } else if (check.isEmpty(userDetails)) {
            /* generate the response and the console error message here */
            logger.error('No User Found', 'meetingController: findUser()', 7)
            let apiResponse = response.generate(true, 'No User Details Found', 404, null)
            reject(apiResponse);
          } else {
            /* prepare the message and the api response here */
            logger.info('User Found', 'meetingController: findUser()', 10)
            resolve(userDetails);
          }
        });

      } else {
        let apiResponse = response.generate(true, '"userId" parameter is missing', 400, null)
        reject(apiResponse);
      }
    });
  }

  let saveEvent = (userDetails) => {
    return new Promise((resolve, reject) => {
      let newEvent = new EventModel({
        id: shortid.generate(),
        title: req.body.title,
        start: req.body.startDate,
        end: req.body.endDate,
        userId: req.body.userId,
        creatorId: req.body.creatorId
      });
      newEvent.save((err, newUser) => {
        if (err) {
          console.log(err)
          logger.error(err.message, 'meetingController: saveEvent', 10)
          let apiResponse = response.generate(true, 'Failed to create new Event', 500, null)
          reject(apiResponse)
        } else {
          let newUserObj = newUser.toObject();
          resolve(newUserObj)
        }
      })
    })
  }


  findUser(req, res)
    .then(saveEvent)
    .then((resolve) => {
      let apiResponse = response.generate(false, 'User created', 200, resolve)
      res.send(apiResponse)
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    })

}

let editEvent = (req, res) => {
  let options = req.body;
  console.log(req.params.id);
  console.log(options)
  EventModel.update({
    'id': req.params.id
  }, {
    $set: options
  }, {
    upsert: true
  }).exec((err, result) => {
    if (err) {
      console.log(err)
      logger.error(err.message, 'User Controller:editUser', 10)
      let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
      res.send(apiResponse)
    } else if (check.isEmpty(result)) {
      logger.info('No User Found', 'User Controller: editUser')
      let apiResponse = response.generate(true, 'No User Found', 404, null)
      res.send(apiResponse)
    } else {
      let apiResponse = response.generate(false, 'User details edited', 200, result)
      res.send(apiResponse)
    }
  }); // end Event model update
}

let deleteEvent = (req, res) => {
  EventModel.findOneAndRemove({
    'id': req.params.id
  }).exec((err, result) => {
    if (err) {
      console.log(err)
      logger.error(err.message, 'Meeting Controller: deleteEvent', 10)
      let apiResponse = response.generate(true, 'Failed To delete Event', 500, null)
      res.send(apiResponse)
    } else if (check.isEmpty(result)) {
      logger.info('No Event Found', 'Meeting Controller: deleteEvent')
      let apiResponse = response.generate(true, 'No User Found', 404, null)
      res.send(apiResponse)
    } else {
      let apiResponse = response.generate(false, 'Deleted the event successfully', 200, result)
      res.send(apiResponse)
    }
  }); // end user model find and remove
}


module.exports = {
  getEvents: getEvents,
  createEvent: createEvent,
  editEvent: editEvent,
  deleteEvent: deleteEvent
}