const jwt = require('jsonwebtoken');
const { TOKEN_KEY, TOKEN_EXPIRY } = process.env;

// Helper to generate new token
const createToken = async (
  tokenData,
  tokenKey = TOKEN_KEY,
  tokenExpiry = TOKEN_EXPIRY
) => {
  try {
    console.log(TOKEN_EXPIRY)
    const token = jwt.sign(tokenData, tokenKey, { expiresIn: "2d" });
    return token;

  } catch (error) {
    console.log(error);
  }
}


module.exports = { createToken };