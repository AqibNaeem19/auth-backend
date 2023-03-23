const User = require('../models/user');
const { hashData, verifyHashedData } = require('../utility/hashData');
const { createToken } = require('../utility/Tokens');

// Controller for handling new users registrations / signup's.
exports.signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Checks the presence of all fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validates that the name contains alphabets and spaces only.
    if (name && !/^[a-zA-Z ]+$/.test(name)) {
      return res.status(400).json({ error: 'Name should contain alphabets only' });
    }

    // Validate email field
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if the user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    //Hash password
    const hashedPassword = await hashData(password);


    //Create new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save into MongoDB
    const savedUser = await newUser.save();
    if (savedUser) {
      return res.status(200).json({ message: 'New user registered successfully', user: savedUser });
    }

  } catch (error) {
    console.log(error);
  }
}


// Controller for logging in the existing user
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Checks for password verification
    const hashedPassword = existingUser.password
    const isPassMatch = await verifyHashedData(password, hashedPassword);
    if (!isPassMatch) {
      return res.status(400).json({ error: "Password didn't match" });
    }

    // Create user token info for generating jwt token
    const tokenData = {
      userId: existingUser._id,
      email
    };

    //creating token for user.
    const userToken = await createToken(tokenData);

    if (!userToken) {
      return res.status(400).json({ error: "Authentication didn't worked" });
    }

    //Updating the token for particular user record
    existingUser.token = userToken;

    res.status(200).json({ message: "User login successfull", user: existingUser });



  } catch (error) {
    console.log(error);
  }
}

exports.homePage = (req, res) => {
  res.status(200).json({
    message: "I am the protected route",
    status:"Access granted"
  })
}

