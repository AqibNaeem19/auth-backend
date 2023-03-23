const jwt = require('jsonwebtoken');

const { TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;

  // Check for provided token
  if(!token){
    return res.status(403).send("An authentication token is required"); 
  }

  try {
    const decoded = await jwt.verify(token, TOKEN_KEY);
    req.currentUser = decoded;
    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).send("Your token has expired");
    } else {
      return res.status(401).send("Invalid Token provided");
    }
  }
}

module.exports = verifyToken;
