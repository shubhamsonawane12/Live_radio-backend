import express from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import authMiddleware  from "../middleware/auth.middleware.js";
import { RadioChannel } from '../models/user.favchannels.js';
const router = express.Router();



router.post('/register', async (req,res)=>{
    try{
        const {username,password,fullName,email,}=req.body;

        const existingUser = await User.findOne({username,email});
        if (existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            username,
            password:hashedPassword,
            fullName,
            email
        });
        await newUser.save();
          const  token  = jwt.sign(
            { userId:newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        res.status(200).json({token ,message:"User created succesfully"});
    } catch(error){
        console.log(error);
        res.status(500).json({message:"Error in creating user"});
    }

});

router.post('/login', async (req , res)=>{
    try{
        const {email, password}=req.body;

        const user = await User.findOne ({email});
        if (!user){
            return res.status(400).json({message:"invalid credentitals "});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            return res.status(400).json({message:"invalid credentials"});
        }
        const token  = jwt.sign(
            { userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        res.status(200).json({token});

    }catch (error){
        res.status(500).json({message: "Server error"});
    }
});






router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // You can access the authenticated user's ID from req.userId (assuming your authMiddleware sets this)
    const userId = req.userId;
    
    console.log("user_id from auth:",userId);
    // Fetch user details from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user details to the frontend
    res.status(200).json({
      userId:userId,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});






router.post('/favchannels', async (req, res) => {
  try {
    // Extract userId, stationName, frequency, and stationLink from request body
    const { userId, imagePath, stationName, frequency, stationLink } = req.body;

    // Find the user by ID and populate the favoriteChannels array
    const user = await User.findById(userId).populate('favoriteChannels');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteChannels = user.favoriteChannels;

    // Check if the station is already in the user's favoriteChannels
    let alreadyLiked = false;
    for (const channel of favoriteChannels) {
      if (channel.stationLink === stationLink) {
        alreadyLiked = true;
        break;
      }
    }

    if (alreadyLiked) {
      return res.status(400).json({ message: 'Station already in favorites' });
    }

 
    const newRadioChannel = new RadioChannel({
      imagePath,
      stationName,
      frequency,
      stationLink
    });

    // Save the new radio channel to get its ObjectId
    const savedRadioChannel = await newRadioChannel.save();

    // Add the ObjectId of the new radio channel to the user's favoriteChannels array
    user.favoriteChannels.push(savedRadioChannel._id);
    await user.save();

    // Return success response
    res.status(200).json({ message: 'Station added to favorites successfully' });
  } catch (error) {
    console.error('Error adding favorite station:', error);
    res.status(500).json({ message: 'Server error' });
  }
});






// Example endpoint to retrieve user's favorite channels
router.get('/user/:userId/getfavchannel', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the user by ID
    const user = await User.findById(userId).populate('favoriteChannels');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Extract favorite channels from user data and send them in the response
    const favoriteChannels = user.favoriteChannels;
    res.status(200).json({ favoriteChannels });
  } catch (error) {
    console.error('Error retrieving user favorite channels:', error);
    res.status(500).json({ message: 'Server error' });
  }
});















// router.post('/favchannels', async (req, res) => {
//   try {
//     // Extract userId, stationName, frequency, and stationLink from request body
//     const { userId,imagePath, stationName, frequency, stationLink } = req.body;

//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if the station is already in the user's favoriteChannels
//     const alreadyLiked = user.favoriteChannels.some(channel => channel.stationName === stationName);
//     if (alreadyLiked) {
//       return res.status(400).json({ message: 'Station already in favorites' });
//     }


//     // Create a new RadioChannel document
//     const newRadioChannel = new RadioChannel({
//       imagePath,
//       stationName,
//       frequency,
//       stationLink
//     });

//     // Save the new radio channel to get its ObjectId
//     const savedRadioChannel = await newRadioChannel.save();

//     // Add the ObjectId of the new radio channel to the user's favoriteChannels array
//     user.favoriteChannels.push(savedRadioChannel._id);
//     await user.save();

//     // Return success response
//     res.status(200).json({ message: 'Station added to favorites successfully' });
//   } catch (error) {
//     console.error('Error adding favorite station:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });






export default router;