const express= require("express");
const userAuthRouter= express.Router();

const { getUserDetails, updateUserDetails,deleteUser,verifyTwoMessage } = require("../controllers/userAuthControllers");
const auth=require("../middlewares/auth")

userAuthRouter.get("/getuserDetails",auth,getUserDetails);

userAuthRouter.put("/updateUserDetails",auth,updateUserDetails);

userAuthRouter.delete("/deleteUser",auth,deleteUser);

userAuthRouter.get("/verify",auth,verifyTwoMessage);

module.exports = userAuthRouter;