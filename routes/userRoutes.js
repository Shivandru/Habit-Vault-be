const express = require("express");
const UserFuntions = require("../functions/userFunction");

const userRouter = express.Router();
const userFunctions = new UserFuntions();

userRouter.post("/register", async (req, res) => {
  try {
    const { status, json } = await userFunctions.createUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { status, json } = await userFunctions.loginUser({
      email: req.body.email,
      password: req.body.password,
    });
    res.cookie("accessToken", json.access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", json.refresh_token, {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(status).send({
      success: true,
      user: json.user,
    });
  } catch (error) {
    return {
      status: 500,
      json: {
        success: false,
        message: "something went wrong",
      },
    };
  }
});

module.exports = userRouter;
