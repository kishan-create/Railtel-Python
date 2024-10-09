// controllers/userController.js
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const utilsConfig = require("../config/utils.config.js");
const utils = require("../helpers/utils.js");
const log = require("../helpers/log.js");
const tablename = "user_info";

// Controller method to retrieve all users
exports.getAllUsers = (req, res) => {
  User.getAll((err, data, message) => {
    if (!utils.isNullOrEmpty(err)) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    } else {
      res.send(data);
    }
  });
};

// Controller method to retrieve a user by id
exports.getUserById = (req, res) => {
  User.getById(req.params.id, (err, data, message) => {
    if (!utils.isNullOrEmpty(err)) {
      if (err.message === "User not found") {
        res.status(404).send({
          message: `User with id ${req.params.userId} not found.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id " + req.params.userId,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Controller method to create a user
exports.createUser = (req, res) => {
  if (!req.body.first_name || !req.body.last_name || !req.body.email_id) {
    res.status(400).send({ message: "Name and email_id cannot be empty!" });
    return;
  }

  const reqObj = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone_number: req.body.phone_number,
    email_id: req.body.email_id,
    password: req.body.password,
    country_id: req.body.country_id,
  });

  User.create(reqObj, (err, data, message) => {
    console.log("data:err", { data, err });
    console.log("first", err, data, message);
    if (!utils.isNullOrEmpty(err)) {
      log.Excecption(
        JSON.stringify(err),
        `${utilsConfig.APP_ERROR_HEAD}: User signup`,
        null,
        `${tablename}`,
        null
      );
      console.log("create", err);
      res.status(500).send({
        message:
          !utils.isNullOrEmpty(err) &&
          !utils.isNullOrEmpty(err.message) &&
          utils.findStringIgnoreCase(err.message, "duplicate")
            ? "Email is duplicated"
            : "Error occurred while creating the User.",
      });
      return;
    } else {
      if (utils.isNullOrEmpty(data)) data = { id: null };
      log.Activity("User signed up", data.id, `${tablename}`, data.id);
      res.send({ message });
    }
  });
};

// Controller method to login validate a user
exports.userLogin = (req, res) => {
  if (!req.body.password || !req.body.email_id) {
    res.status(400).send({ message: "email id/password cannot be empty!" });
    return;
  }

  const reqObj = new User({
    email_id: req.body.email_id,
    password: req.body.password,
  });

  User.userLogin(reqObj, (err, data, message) => {
    if (!utils.isNullOrEmpty(err)) {
      log.Excecption(
        err.message || "Invalid user credentials.",
        `${utilsConfig.APP_ERROR_HEAD}: User signin`,
        null,
        `${tablename}`,
        null
      );
      res.status(404).send({
        message: err.message || "Invalid user credentials.",
      });
      return;
    }

    // Create a JWT token
    const payload = {
      userId: data.id,
      username: data.email_id,
    };
    const token = utils.generateToken(payload);

    log.Activity(
      "User Logged in",
      payload.userId,
      `${tablename}`,
      payload.userId
    );

    console.log("Authorization", `Bearer ${token}`);
    res.header("Authorization", `Bearer ${token}`);
    data.token = `Bearer ${token}`;
    res.send({ authorization: `Bearer ${token}` });
  });
};

// Controller method to login validate a user
exports.userLogout = (req, res) => {
  log.Activity("User logged out", data.id, `${tablename}`, data.id);
  res.json({ message: "Token revoked successfully" });
};

// Controller method to login validate a user
exports.resetPassword = (req, res) => {
  const email_id = req.params.email_id;
  const password = req.body.password;

  const user = {
    email_id: email_id,
    password: password,
  };

  User.resetPassword(user, (err, data, message) => {
    let msg = "Reset user password";
    if (!utils.isNullOrEmpty(err)) {
      log.Excecption(
        JSON.stringify(err),
        `${utilsConfig.APP_ERROR_HEAD}: ${msg}`,
        data.id,
        `${tablename}`,
        data.id
      );
      res.status(500).send({
        message: err.message || "Unable to reset the user password.",
      });
      return;
    }
    log.Activity(`${msg}`, data.id, `${tablename}`, data.id);
    res.send({ message });
  });
};

// Controller method to login validate a user
exports.changePassword = (req, res) => {
  const password = req.body.password;
  const token = utils.getToken(req);

  if (!password) {
    res.status(400).send({ message: "Unable to reset the user password." });
    return;
  }

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, utilsConfig.SECRET_KEY, (err, decoded) => {
    if (utils.unauthorized(err, res, decoded) === 401) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    console.log("decoded", decoded);

    const user = {
      id: decoded.userId,
      password: password,
    };

    User.changePassword(user, (err, data, message) => {
      let msg = "Changed user password";
      if (!utils.isNullOrEmpty(err)) {
        log.Excecption(
          JSON.stringify(err),
          `${utilsConfig.APP_ERROR_HEAD}: ${msg}`,
          decoded.userId,
          `${tablename}`,
          decoded.userId
        );
        res.status(500).send({
          message: err.message || "Unable to Change the user password.",
        });
        return;
      }
      log.Activity(`${msg}`, data.id, `${tablename}`, data.id);
      res.send({ message });
    });
  });
};
