const jwt = require("jsonwebtoken");
const User = require("../db").import("../models/user")

const validateSession = (req, res, next) => {
    const token = req.headers.authorization;

    console.log("token --> ", token);
    if (!token){
        return res.status(403).send({ auth: false, message: "No token provided"})
    } else { 
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
      console.log("decoded --> ", decoded);
        if (!err && decoded){
            User.findOne({where: {id: decoded.id}})
            .then(user =>{
                console.log("user --> ", user);
                if(!user) throw "err";
                console.log("req --> ", req);
                 req.user = user; 
               
                return next();
               
            })
            .catch(err => next(err));
        } else{
            req.errors = err;
            return res.status(500).send("Not Authorized");
        }    
    });
}
};

module.exports = validateSession;