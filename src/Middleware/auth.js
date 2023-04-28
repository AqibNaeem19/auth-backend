const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { TOKEN_KEY } = process.env;



const verifyToken = async (req, res, next) => {
  const token = req.headers.token;

  // Check for provided token
  if (!token) {
    return res.status(403).send("An authentication token is required");
  }

  try {
    const decoded = jwt.verify(token, 'i am the secret to generate tokens');
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      if (user.token !== token) {
        return res.status(401).send("Token didn't matched");
      } else {
        req.currentUser = decoded;
        next();
      }
    }


  } catch (error) {
    console.log(error); // log the error to the console
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).send("Your token has expired");
    } else {
      return res.status(401).send("Invalid Token provided");
    }
  }
}

module.exports = verifyToken;