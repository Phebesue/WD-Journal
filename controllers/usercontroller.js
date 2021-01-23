// const { mapOptionFieldNames } = require("sequelize/types/lib/utils");

let router = require("express").Router();
let User = require("../db").import("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// -----  User Sign-Up  -----
router.post("/create", function (req, res) {
  User.create({
    email: req.body.user.email,
    password: bcrypt.hashSync(req.body.user.password, 13)
  })

    .then(
      function createSuccess(user) {

      let token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

      res.json({
        user: user,

        message: "User successfully created!",
        sessionToken: token
      });
    }
    )
    .catch((err) => res.status(500).json({ error: err }));
  })

// -----  User Login  -----
router.post("/login", function (req, res) {
  User.findOne({
    where: {
      email: req.body.user.email
      // passwordhash: req.body.user.password
    }
  })
    .then(function loginSuccess(user) {
      if (user) {
        bcrypt.compare(req.body.user.password,user.password, function (err,matches) {
          if(matches) {

        let token = jwt.sign({id:user.id}, process.env.JWT_SECRET,{expiresIn:"1d"})
        res.status(200).json({
          user: user,
          message: "Sucessfully authenticated user",
          sessionToken: token
        })
      } else {
        res.status(502).send({error: "Bad Gateway"})

      }
    });
  }
  else{ res.status(500).json({error: err})

  }
})
    .catch((err) => res.status(500).json({ error: "Failed to authenticate." })
    );
}
    );
module.exports = router;
