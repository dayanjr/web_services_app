const db = require('../models');
const User = db.user;
const passwordUtil = require('../util/passwordComplexityCheck');
const usernameUtil = require('../util/usernameComplexity');

module.exports.create = (req, res) => {
  try{// Validate request
  if (!req.body.username || !req.body.password) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  //const password = req.params.password;
  //const userName = req.params.username;
  const passwordCheck = passwordUtil.passwordPass(req.body.password);
  const usernameCheck = usernameUtil.usernamePass(req.body.username);
    if (passwordCheck.error) {
      res.status(400).send({ message: passwordCheck.error });
      return;
    }
    if (usernameCheck.error) {
      res.status(400).send({ message: usernameCheck.error });
      return;
    }
  const user = new User(req.body);
  user
    .save()
    .then((data) => {
      console.log(data);
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the user.'
      });
    });
}catch (err){
  res.status(500).json(err);
}
};

module.exports.getAll = (req, res) => {
 try{
  User.find({})
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving users.'
    });
  });
 }catch(err){
  res.status(500).json(err);
 }
};

module.exports.getUser = (req, res) => {
  try{
    const username = req.params.username;
    const usernameCheck = usernameUtil.usernamePass(username);
    if (usernameCheck.error) {
      res.status(400).send({ message: usernameCheck.error });
      return;
    }
    if (!req.params.username) {
      res.status(400).send({ message: 'Content can not be empty!' });
      return;
    }
    User.find({ username: username })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving users.'
        });
      });
  }catch(err){
    res.status(500).json(err);
  }
};
module.exports.updateUser = async (req, res) => {
  try {
    const username = req.params.username;
    const usernameCheck = usernameUtil.usernamePass(username);
    if (usernameCheck.error) {
      res.status(400).send({ message: usernameCheck.error });
      return;
    }
    if (!req.params.username) {
      res.status(400).send({ message: 'Content can not be empty!' });
      return;
    }
    if (!username) {
      res.status(400).send({ message: 'Invalid Username Supplied' });
      return;
    }
    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).send({ message: passwordCheck.error });
      return;
    }
    User.findOne({ username: username }, function (err, user) {
      user.username = req.params.username;
      user.password = req.body.password;
      user.displayName = req.body.displayName;
      user.info = req.body.info;
      user.profile = req.body.profile;
      user.save(function (err) {
        if (err) {
          res.status(500).json(err || 'Some error occurred while updating the contact.');
        } else {
          res.status(204).send();
        }
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const username = req.params.username;
    const usernameCheck = usernameUtil.usernamePass(username);
    if (usernameCheck.error) {
      res.status(400).send({ message: usernameCheck.error });
      return;
    }
    if (!req.params.username) {
      res.status(400).send({ message: 'Content can not be empty!' });
      return;
    }
    if (!username) {
      res.status(400).send({ message: 'Invalid Username Supplied' });
      return;
    }
    User.deleteOne({ username: username }, function (err, result) {
      if (err) {
        res.status(500).json(err || 'Some error occurred while deleting the contact.');
      } else {
        res.status(204).send(result);
      }
    });
  } catch (err) {
    res.status(500).json(err || 'Some error occurred while deleting the contact.');
  }
}; 