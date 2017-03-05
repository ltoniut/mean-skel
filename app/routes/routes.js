var express = require('express');
var token_authentication = require("../middleware/auth");

function setup(app, handlers) {

// ########## Authentication Route ##########
  var authenticationRouter = express.Router();

  // Without authentication
  authenticationRouter.post("/authenticate", handlers.users.authenticate)

  app.use("/api/users", authenticationRouter);

// ########## User Routes ##########
  var usersRouter = express.Router();

  // Without authentication
  usersRouter.post("/", handlers.users.createUser);
  usersRouter.post("/activate", handlers.users.activateAccount);

  app.use("/api/users", usersRouter);

  var userRouter = express.Router();
  // With Token authentication
  userRouter.use(token_authentication);
  userRouter.put("/", handlers.users.updateCurrentUser)

  app.use("/api/user", userRouter);

  // ########## More Routes ##########
  // Events

  var eventsRouter = express.Router();
  // With Token authentication
  //eventRouter.use(token_authentication);
  eventsRouter.post("/", handlers.events.createEvent);

  app.use("/api/events", eventsRouter);

  var eventRouter = express.Router();
  // With Token authentication
  //eventRouter.use(token_authentication);
  eventRouter.put("/", handlers.events.updateEvent);

  app.use("/api/event", eventRouter);

  // Invitations
  var invitationsRouter = express.Router();
  invitationsRouter.post("/", handlers.invitations.acceptInvitation);

  app.use("/api/invitations", invitationsRouter);
};

exports.setup = setup;
