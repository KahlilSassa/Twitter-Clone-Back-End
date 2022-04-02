const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt')

// Register Route
router.post("/register", async (req, res) => {
  console.log(req)
  try {
    //   hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // creating a new user
    const newUser = new User({
        
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    })

    console.log(newUser)
    // saving user
    const user = await newUser.save();
    res.status(200).json(user);
    
  } 
  catch (err) {
    res.status(500).json(err)
    console.log(err)
  }
});


// Log In:
router.post("/login", async (req, res) => {
    try{
    const user = await User.findOne({email: req.body.email})
    !user && res.status(404).send('This user does not exist!')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json('Password is invalid!')


    res.status(200).json(user)

    } catch(err){
        res.status(500).json(err)
    }

})

// Log  Out: 

router.delete('/logout', (req, res) => {
  req.session.destroy( err => {
    if(err){
      return res.status(400).json({message: err.message})
    } else {
      return res.status(200).json({message: 'successfully signed out.'})
    }
  })
})

// also create a logout route as well in backend and frontend.
//  Create logout function in frontend , be able to reset local storage on logout in react. from there app should work just find. 


module.exports = router;
