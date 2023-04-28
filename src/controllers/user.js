const User = require('../models/user');
const { hashData, verifyHashedData } = require('../utility/hashData');
const { createToken } = require('../utility/Tokens');
const nodemailer = require("nodemailer");


// Controller for handling new users registrations / signup's.
exports.signup = async (req, res) => {
  try {
    let { name, email, password, dateOfBirth } = req.body;

    // Checks the presence of all fields
    if (!name || !email || !password) {
      return res.status(400).json({ status: "FAILED", message: 'Missing required fields' });
    }

    // Validates that the name contains alphabets and spaces only.
    if (name && !/^[a-zA-Z ]+$/.test(name)) {
      return res.status(400).json({ status: "FAILED", message: 'Name should contain alphabets only' });
    }

    // Validate email field
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ status: "FAILED", message: 'Invalid email format' });
    }

    // Check if the user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "FAILED", message: 'Email already exists' });
    }

    //Hash password
    const hashedPassword = await hashData(password);


    //Create new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
    });

    // Save into MongoDB
    const savedUser = await newUser.save();
    if (savedUser) {
      return res.status(200).json({ status: "SUCCESS", message: 'New user registered successfully', user: savedUser });
    }

  } catch (error) {
    console.log(error);
  }
}



// Controller for logging in the existing user
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    console.log('request received');

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ status: "FAILED", message: "User not found!" });
    }

    // Checks for password verification
    const hashedPassword = existingUser.password
    const isPassMatch = await verifyHashedData(password, hashedPassword);
    if (!isPassMatch) {
      return res.status(400).json({ status: "FAILED", message: "Password didn't match" });
    }

    // Create user token info for generating jwt token
    const tokenData = {
      userId: existingUser._id,
      email
    };

    //creating token for user.
    const userToken = await createToken(tokenData);

    if (!userToken) {
      return res.status(400).json({ status: "FAILED", message: "Couldn't generate a new token for user" });
    }

    //Updating the token for particular user record
    await existingUser.save(existingUser.token = userToken);

    res.status(200).json({ status: "SUCCESS", message: "User login successfull", user: existingUser });



  } catch (error) {
    console.log(error);
  }
}


// Gmail services configurations
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const MINUTES_TO_EXPIRE = 60;
const CODE_LENGTH = 5;

const generateCode = () => {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

// Controller for sending the reset password request
exports.passwordResetRequest = async (req, res) => {
  const { email } = req.body;
  console.log('request is received');
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "FAILED", message: 'No User found' });
    }

    // Generate code and set expiration time
    const code = generateCode();
    const expirationTime = Date.now() + (MINUTES_TO_EXPIRE * 60 * 1000);

    // Update user document with code and expiration time
    user.resetPasswordCode = code;
    user.resetPasswordCodeExpiresAt = expirationTime;
    await user.save();

    // Send email with code and expiration time
    await transporter.sendMail({
      from: 'maqibnaeem2019@gmail.com',
      to: email,
      subject: 'Password Reset Code',
      html: `
        <p>Hi ${user.name},</p>
        <p>Your password reset code is: </p>
        <h1> ${code} </h1>
        <p>Please enter this code in the app within the next 60 minutes to reset your password.</p>
        <br />
        <p>Please note that the 5-digit password reset code you received is strictly for your personal use and should not be shared with anyone. This code is valid for 60 minutes and is intended to help you reset your password securely.

        We take the security and privacy of our users seriously, and we strongly advise against sharing your password reset code with anyone, including our customer support team. Our support team will never ask you for your password reset code or any other sensitive information.
        
        Thank you for your cooperation in helping us maintain the security of your account.
        <br />
        Best regards,
        <br />
        <strong>
        Kisan Awaaz
        </strong>
        </p>
      `
    });

    return res.status(200).json({ status: "SUCCESS", message: 'Password reset email send' });

  } catch (err) {
    console.error(err);

    return res.status(500).json({ status: "FAILED", message: 'Something went wrong' });
  }
}




// Controller for resetting the password with the entered code
exports.resetPassword = async (req, res) => {
  const { email, code, password } = req.body;
  console.log('Code request hits')

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "FAILED", message: 'User not found' });
    }

    // Check if the code is valid and not expired
    if (user.resetPasswordCode !== code || user.resetPasswordCodeExpiresAt < Date.now()) {
      return res.status(400).json({ status: "FAILED", message: 'Invalid or expired code' });
    }

     //Hash password
    //  const hashedPassword = await hashData(password);

    // Update user password and reset code
    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ status: "SUCCESS", message: 'Password reset successfully' });

  } catch (err) {
    console.error(err);

    return res.status(500).json({ status: "FAILED", message: 'Something went wrong' });
  }
}

