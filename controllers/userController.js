import { pool } from "../config/db.js"
import bcrypt from 'bcrypt'
import jwtGenerator from "../utilities/jwtGenerator.js"
import jwtAuth from "../utilities/jwtAuth.js"

//Creating users route
export const createUser = async (req, res)=>{
    const {userName, email, password, role} = req.body
    if (!userName || !email || !password){
        return res.status(400).json({message:"Please enter all the fields"})
    }
    try {
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (checkUser.rows.length !== 0 ){
            return res.status(401).json({message:"User already exists"})
        }
        const salt = await bcrypt.genSalt()
        const hashedpassword = await bcrypt.hash(password, salt)
        const user = await pool.query(
            'INSERT INTO users(username, email, password, role) VALUES($1, $2, $3, $4) RETURNING *', 
            [userName, email, hashedpassword, role])
        const token = jwtGenerator(user.rows[0].id, user.rows[0].role)
        res.status(201).json({message:"User created Successfully", data:user.rows[0], token: token})
    } catch (error) {
        console.log("Error in createUser function", error)
        res.status(500).send("Internal Sever Error")
    }
}

//Logining Route
export const loginUser = async (req,res)=>{
    const {email, password} = req.body
    if (!email || !password){
        return res.status(400).json({message:"Please enter all fields"})
    }
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (user.rows.length == 0){
            return res.status(401).json({message:"User Not Found"})
        }
        const checkPassword = bcrypt.compare(password, user.rows[0].password)
        if (!checkPassword){
            res.status(401).json({message:"Password is not correct"})
        }
        const token = jwtGenerator(user.rows[0].id)
        res.status(200).json({message:"User Login Successfully", data:user.rows[0], token:token})

    } catch (error) {
        console.log("Error in loginUser fucntion: ", error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

//Authenticate User
export const authUser = async (req, res) => {
    const {token} = req.body
    const tokenStatus = jwtAuth(token)
    if (tokenStatus.state === "invalid"){
        return res.status(401).json({status:"invalid", message:"Invalid Token"})
    }
    const data = tokenStatus.payload

    res.status(200).json({status:"valid", message: "Valid token, the user is authorized", data:data})
}

//Delete User
export const deleteUser = async (req, res) => {
    try {
        const {token} = req.body
        const tokenStatus = jwtAuth(token)
        if (tokenStatus === "invalid"){
            return res.status(401).json({status:"invalid", message:"Session timeout, try signing in again"})
        }
        const data = tokenStatus.payload
        const deletedUser = await pool.query("DELETE FROM users WHERE id = $1", [data.user])
        res.status(200).json({message: "User is deleted successfully", user:deletedUser.rows[0]})
    } catch (error) {
        console.log("Error in Delete User Function", error)
        res.status(500).json({message:"Internal Server Error"})
    }
}