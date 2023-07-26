const express = require('express');
const router = express.Router();
const User = require('../db/userSchema');
const { signupValidationSchema } = require('../db/validationSchema');
const utils = require('../passport/utils');
const upload = require('../middleware/upload');

router.post('/', upload.single('profileImage'), async (req, res) => {
  console.log('*********************', req.body);

  const validationResult = await signupValidationSchema.validate(req.body);

  if (validationResult.error) {
    console.log(validationResult);

    return res.status(422).json({
      success: false,
      data: null,
      error: validationResult.error.details[0].message,
    });
  } else {
    const { email, password, firstName, lastName, agreeToTerms, type, subjects, about } = req.body;

    const saltHash = utils.genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    try {
      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          data: null,
          error: { email: 'email already exists' },
        });
      }

      const profileImage = req.file ? req.file.filename : (type === 'student' ? 'student-profile.png' : 'mentor-profile.png');

      const newUser = await User.create({
        email,
        password: hash,
        salt: salt,
        firstName,
        lastName,
        agreeToTerms,
        type,
        subjects,
        about,
        profileImage,
      });

      try {
        newUser.save().then((user) => {
          const tokenObject = utils.issueJWT(user);

          res.status(200).json({
            success: true,
            data: {
              token: tokenObject.token.split(' ')[1],
              expiresIn: tokenObject.expires,
            },
            error: null,
          });
          console.log(newUser);
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, data: null, error: err });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, data: null, error: err });
    }
  }
});

module.exports = router;
