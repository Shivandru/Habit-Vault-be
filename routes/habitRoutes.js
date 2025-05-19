const express = require("express");
const habitRouter = express.Router();
const HabitFunctions = require("../functions/habitFunction");
const auth = require("../middlewares/auth");
const habitFunctions = new HabitFunctions();

habitRouter.get("/", auth, async (req, res) => {
  try {
    const { status, json } = await habitFunctions.getHabits({
      userId: req.userId,
    });
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

habitRouter.post("/create", auth, async (req, res) => {
  try {
    const { status, json } = await habitFunctions.createHabit({
      userId: req.userId,
      title: req.body.title,
      description: req.body.description,
      targetDays: req.body.targetDays,
      startDate: req.body.startDate,
      customDays: req.body.customDays,
    });
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

habitRouter.patch("/update/:habitId", auth, async (req, res) => {
  try {
    const { status, json } = await habitFunctions.updateHabit({
      userId: req.userId,
      habitId: req.params.habitId,
      date: req.body.date,
      status: req.body.status,
    });
    res.status(status).send(json);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

habitRouter.delete("/delete/:habitId", auth, async (req, res) => {
  try {
    const { status, json } = await habitFunctions.deleteHabit({
      userId: req.userId,
      habitId: req.params.habitId,
    });
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = habitRouter;
