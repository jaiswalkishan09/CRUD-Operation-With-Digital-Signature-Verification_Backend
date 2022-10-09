const express= require("express");
const userAuthRouter= express.Router();

const { getUserDetails, updateUserDetails,deleteUser,verifyMessage } = require("../controllers/userAuthControllers");
const auth=require("../middlewares/auth");
const verifyBodyRequest = require("../middlewares/verifyBodyRequest");



userAuthRouter.get("/getuserDetails",auth,getUserDetails);

userAuthRouter.put("/updateUserDetails",auth,verifyBodyRequest,updateUserDetails);

userAuthRouter.delete("/deleteUser",auth,deleteUser);

userAuthRouter.post("/verify",auth,verifyMessage);

module.exports = userAuthRouter;