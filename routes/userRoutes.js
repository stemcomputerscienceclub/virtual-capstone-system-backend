import { Router } from "express";
import { createUser, loginUser, deleteUser, authUser } from "../controllers/userController.js";

const userRoutes = Router()

userRoutes.get('/test', (req, res)=>{
    res.send("The first router")
})
//Create User Route
userRoutes.post('/sign-up', createUser);

//LogIn User Route
userRoutes.post('/login', loginUser)

//Auth User Route
userRoutes.get('/auth', authUser)

//Delete User Route
userRoutes.delete('/delete', deleteUser)

export default userRoutes