const User = require("../model/userSchema");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { send } = require("./sendMail");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

//signup for users

exports.signup = async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;
  if (!name) {
    return res
      .status(422)
      .json({ status: 422, error: "name feilds is require" });
  } else if (!email) {
    return res
      .status(422)
      .json({ status: 422, error: "email feilds is require" });
  } else if (!password) {
    return res
      .status(422)
      .json({ status: 422, error: "password feilds is require" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(422)
        .json({ status: 422, error: "Email already exist, Try to login" });
    } else {
      const token = jwt.sign({ name, email, password }, JWT_SECRET);
      let expireToken = Date.now() + 3600000;

      const user = new User({
        name,
        email,
        password,
        resetToken: token,
        expireToken,
      });

      user.save();

      const mailOptions = {
        subject: `Welcome to XL-CTB verify your email`,
        html: `<h3> Hello   ${name} <br/> Welcome to XL-CTB.</h3>
        <p> Your account has been created successfully.</p>
        <p>Please verify your email by clicking on the button below.</p>
        <button><a href="${CLIENT_URL}/email-activation/${token}">verify</a> </button>
        <p> Thanks <br/> TEAM XL-CTB</p>
        `,
      };
      console.log(mailOptions);
      let userEmail = req.body.email;
      send(userEmail, mailOptions);

      // await send(userEmail, mailOptions)
      //   .then((result) => console.log("Email sent...", result))
      //   .catch((error) => console.log(error.message));

      return res.status(201).json({
        status: 201,
        message: "Please check your email to verify your account",
      });
    }

  } catch (err) {
    console.log(err);
  }
};

exports.activateAccount = async (req, res) => {
  // const token = req.body.token;
  // console.log(token.token, "token");
  if (req.body.token) {
    User.findOne({
      resetToken: req.body.token,
      expireToken: { $gt: Date.now() },
    })
      .then((user) => {
        // console.log(user, "user");
        if (!user) {
          return res
            .status(422)
            .json({ status: 422, error: "session expired please try again" });
        }
        // console.log(user, "user");
        user.verified = true;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((userLogin) => {
          return res
            .status(201)
            .json({ status: 201, message: "Email verified successfully" });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.update = async (req, res) => {

  User.findOne({
    _id: req.user,
  })
    .then((user) => {
      // console.log(user, "user");
      if (!user) {
        return res
          .status(422)
          .json({ status: 422, error: "session expired please try again" });
      }
      else if (!req.body.password) {
        user.name = req.body.name;
        user.save().then(() => {
          return res.status(200).json({
            status: 200,
            data: { name: user.name, email: user.email },
            message: "Name Updated successfully",
          });
        });
      } else {
        user.name = req.body.name;
        user.password = req.body.password;
        user.save().then(() => {
          return res.status(200).json({
            status: 200,
            data: { name: user.name, email: user.email },
            message: "Profile Updated successfully",
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// Resend link

exports.reSendLink = async (req, res) => {
  const { email } = req.body;

  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    const user = await User.findOne({ email: email });

    user.resetToken = token;
    // console.log(token);
    user.expireToken = Date.now() + 3600000;
    user.save();

    let userEmail = req.body.email;
    const mailOptions = {
      // from: "no-replay@XL-CTB.com",
      // to: req.body.email,
      subject: `Welcome to XL-CTB verify your email resend`,
      html: `<h3 > Hello  ${user.name} <br/> Welcome to XL-CTB.</h3>
            <p> Your account has been created successfully.</p>
            <p>Please verify your email by clicking on the button below.</p>
            <button><a href="${CLIENT_URL}/email-activation/${token}">verify</a> </button>
            <p> Thanks <br/> Team XL-CTB</p>
            `,
    };

    console.log(mailOptions)

    send(userEmail, mailOptions);

  });
};

//login for user

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  try {
    if (!email) {
      res.status(201).json({ status: 201, error: "Email feilds is require" });
    } else if (!password) {
      res
        .status(201)
        .json({ status: 201, error: "password feilds is require" });
    }
    const userLogin = await User.findOne({ email: email });
    if (!userLogin) {
      res.status(422).json({ status: 422, error: "Invalid Email / Password" });
    }
    // console.log(userLogin);
    if (userLogin) {
      if (userLogin.verified == true) {
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (isMatch) {
          const token = jwt.sign({ userId: userLogin._id }, JWT_SECRET);
          res.status(201).json({
            token,
            status: 201,
            data: { name: userLogin.name, email: email },
          });
          // console.log(token);
        } else {
          res
            .status(403)
            .json({ status: 403, error: "Username or password incorrect" });
        }
      } else {
        res.status(401).json({
          status: 401,
          error: "Please verify your email before logging in",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.forgotPassword = async (req, res) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(422)
        .json({ status: 422, error: "User doesn't exists with this email" });
    }
    user.resetToken = token;
    // console.log(token);
    user.expireToken = Date.now() + 3600000;
    user.save();

    const mailOptions = {
      // from: "no-replay@XL-CTB.com",
      // to: req.body.email,
      subject: `We have received a request to reset your XL-CTB account password.`,
      html: `<h3 > Hello  ${user.name} </h3> <br/>
        <p>We've received a request to reset your XL-CTB account password. To do so, please click the link below.</p>
        
        <a href="${CLIENT_URL}/new-password/${token}">Reset Your Password</a>
        <p>If you have not requested this, please ignore this email.</p>
        <p> Thanks <br/> Team XL-CTB</p>
        `,
    };
    console.log(mailOptions);

    let userEmail = req.body.email;
    send(userEmail, mailOptions);

    res.status(201).json({
      status: 201,
      message: "Please check your email to reset your account password",
    });

  });
};

exports.resetPassword = (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ status: 422, error: "Try again session expired" });
      }
      user.password = newPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;
      user.save().then((userLogin) => {
        return res
          .status(201)
          .json({ status: 201, message: "Password updated successfully" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.userId = (req, res) => {
  const { email } = req.headers;
  // console.log(req.headers);
  User.findOne({ email: email }, function (err, user) {
    if (user) {
      res
        .status(201)
        .json({ status: 201, message: "user matched", userId: user._id });
    } else {
      res.status(400).json({ status: 400, message: "user dose not matched" });
    }
  });
};
