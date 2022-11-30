const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const JWT_SECRET = process.env.JWT_SECRET;

exports.requireLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in !" });
  }
  try {
    const { userId } = jwt.verify(authorization, "abcdefghijklmnop");
    req.user = userId;
    // console.log(userId);
    next();
  } catch (err) {
    return res.status(401).json({ error: "you must be logged in" });
  }
};

// import  mailgun  from "mailgun-js";

// const Authenticate = async(req,res,next)=> {
//     try{
//           const token = req.cookies.jwtoken;
//           const verifyToken = jwt.verify(token, "thisistheauthenticationfornewproject");

//           const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});
//           if(!rootUser){
//               throw new Error('user not found')
//           }

//           req.token = token;
//           req.rootUser= rootUser;
//           req.userID = rootUser._id;

//           next();

//     }catch(err){
//         res.status(401).send('unauthorizesd webtoken')
//      console.log(err);
//     }
//     }

//     module.exports = Authenticate;

// const forgotPassword = (req, res)=>{
// const email = req.body;
// console.log(email);

// User.findOne(email).then((user)=>{
//     // console.log(user ,"result")
//     if(!user){
//         return res,status(422).json({error:"User email does not exist"});
//     }
//     const token = jwt.sign({_id:user._id},process.env.RESET_PASSWORD_KEY)
//     user.resetToken= token;
//     user.expireToken=Date.now()+360000;

//     user.save().then((result)=>{

//         const data = {
//                     from: 'noreply@hello.com',
//                     to: email,
//                     subject: 'account activation link',
//                     html:`
//                     <h2>please click on given link to accout</h2>
//                     <p>click in this <a href="${process.env.CLIENT_URL}/resetpassword/${token}">link </a></p>
//                     `
//                 };
//                 mg.messages().send(data, function(error,body){
//                                   return res.json({message:'email has been sent'})
//                                 })
//     })
// })

// User.findOne(email,(err,user)=>{
//     console.log(user)
//     if(err ||!user){
//         return res.status(400).json({error:"user with email does not exist"});
//     }
//     const token = jwt.sign({_id:user._id},process.env.RESET_PASSWORD_KEY,{expiresIn:'20m'})
//     const data = {
//         from: 'noreply@hello.com',
//         to: email,
//         subject: 'account activation link',
//         html:`
//         <h2>please click on given link to accout</h2>
//         <p>"${process.env.CLIENT_URL}/resetpassword/${token}"</p>
//         `
//     };

//      User.updateOne({resetLink:token},function(err,success){
//         if(err){
//             res.status(400).json({error:"reset password linki error"})
//         }
//         else{
//             mg.messages().send(data, function(error,body){
//               return res.json({message:'email has been sent'})
//             })
//         }
//     })
// })
// }

// module.exports = forgotPassword;
