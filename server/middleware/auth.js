const jwt = require('jsonwebtoken')

const ENV_SECRET_KEY = "6F4jp16OZMRYrWmOYIDG"

const verifyToken = async (req,res,next) => {
  try{
    let token = req.header('Authorization');
    if (!token) return res.status(403).send('Access denied')
    if (token.startsWith('Bearer ')){
      token = token.slice(7,token.length).trimLeft();
      const check = jwt.verify(token, ENV_SECRET_KEY);
      req.user = check;
      next();
    }
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

module.exports = verifyToken