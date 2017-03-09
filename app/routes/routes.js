const express = require('express');
const token_authentication = require("../middleware/auth");

function setup(app, handlers) {

// ########## Authentication Route ##########
  const authenticationRouter = express.Router();

  // Without authentication
  authenticationRouter.post("/authenticate", handlers.users.authenticate)

  app.use("/api/users", authenticationRouter);

// ########## User Routes ##########
  const usersRouter = express.Router();

  // Without authentication
  usersRouter.post("/", handlers.users.createUser);
  usersRouter.post("/activate", handlers.users.activateAccount);

  app.use("/api/users", usersRouter);

  const userRouter = express.Router();
  // With Token authentication
  userRouter.use(token_authentication);
  userRouter.put("/", handlers.users.updateCurrentUser)

  app.use("/api/user", userRouter);

  // ########## More Routes ##########
  // Events

  const eventsRouter = express.Router();
  // With Token authentication
  //eventRouter.use(token_authentication);
  eventsRouter.post("/", handlers.events.createEvent);

  app.use("/api/events", eventsRouter);

  const eventRouter = express.Router();
  // With Token authentication
  //eventRouter.use(token_authentication);
  eventRouter.put("/", handlers.events.updateEvent);

  app.use("/api/event", eventRouter);

  const eventInvitationsRouter = express.Router();

  eventInvitationsRouter.post("/", handlers.events.addInvitee);
  app.use("/api/eventInvitations", eventInvitationsRouter);

  const eventInvitationRouter = express.Router();

  eventInvitationRouter.post("/", handlers.events.cancelInvitation);
  app.use("/api/eventInvitation", eventInvitationRouter);

  // Invitations
  const invitationsRouter = express.Router();
  invitationsRouter.post("/", handlers.invitations.acceptInvitation);

  app.use("/api/invitations", invitationsRouter);
};

exports.setup = setup;
