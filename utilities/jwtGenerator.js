import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function jwtGenerator(user_id, user_role){
    const payload = {
        user: user_id,
        role: user_role
    }
    return jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:30*24*60*60})
}

export default jwtGenerator;