const bcrypt = require('bcrypt');

// Bcrypt salt rounds for hashing passwords
const saltRounds = 10;

// Used to hash plain-text password
const hashData = async ( data ) => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;

  } catch (error) {
    console.log(error);
  }
}

// Used to verify the hashed passowrds
const verifyHashedData = async (unhashed, hashed) => {
  try {
    const match = await bcrypt.compare(unhashed, hashed);
    return match;

  } catch (error) {
    console.log(error);
  }
}



module.exports = { hashData, verifyHashedData };