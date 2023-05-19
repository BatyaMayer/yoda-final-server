const express = require('express');
const router = express.Router();
const User = require('../mongo/userSchema');
const utils = require('../passport/utils');

router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ success: false, data: null, error: 'user not found' });
    }

    const isValid = utils.validPassword(password, user.password, user.salt);

    if (isValid) {
      const { firstName, lastName, email } = user;
      const tokenObject = utils.issueJWT(user);
      const token = tokenObject.token.split(' ')[1];

      res.status(200).json({
        success: true,
        data: { firstName, lastName, email, token },
        error: null,
      });
    } else {
      res.status(401).json({ success: false, data: null, error: 'wrong password' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
