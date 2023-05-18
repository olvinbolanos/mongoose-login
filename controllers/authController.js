const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const bcrypt  = require('bcrypt');

router.post('/login', async (req, res) => {

  // First query the database to see if the user exists
  try {

    const foundUser = await User.findOne({username: req.body.username});
    console.log(foundUser, ' foundUser');

     // If the user exists we'll use bcrypt to see if their password
  // is valid
  if(foundUser){

    // bcrypt compare returns true // or false
    if(bcrypt.compareSync(req.body.password, foundUser.password)){
       // if valid, we'll set the session
      req.session.userId = foundUser._id;
      req.session.username = foundUser.username;
      req.session.logged = true;

      res.json({
        status:  {
            code: 200,
            message: "User Logged In"
          }
      })

    } else {
      // send message back to client that
      // the username or password is incorrect

      res.json({
        status:  {
            code: 200,
            message: 'Username or Password incorrect'
          }
      })
    }
    
  } else {
    // send message back to client that
    // thier username or password is incorrect

    res.json({
        status:  {
            code: 200,
            message: 'Username or Password incorrect'
          }
      })

  }




  } catch(err){
    res.send(err);
  }

});


router.post('/register', async (req, res) => {

  // Encrypt our password
  const password = req.body.password;

  // encrypt our password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log(hashedPassword)

  req.body.password = hashedPassword;

  // We create our user
  try {
      req.body.admin = true
      const createdUser = await User.create(req.body);
      console.log(createdUser, ' created user');

      // set info on the session
      req.session.userId = createdUser._id;
      req.session.username = createdUser.username;
      req.session.logged = true;

      res.json({
        status:  {
            code: 200,
            message: "User Logged In"
          }
      })

  } catch (err){
    res.send(err)
  }
});


router.get('/logout', (req, res) => {

  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.json({
        status:  {
            code: 200,
            message: "User Logged Out"
          }
      })// back to the homepage
    }
  })

})



router.get('/', async (req, res, next) => {
  console.log(req.body, 'this is get all users')
  try {
    const allUsers = await User.find();

    res.json({
      status: {
        code: 200,
        message: 'Success'
      },
      data: allUsers
    });
  } catch (err) {
    console.log(err, ' getUser error')
    return err
  }
})



module.exports = router;
