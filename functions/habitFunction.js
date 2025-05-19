const Habit = require("../models/habitModel");

class HabitFunctions {
  async createHabit({
    userId,
    title,
    description,
    targetDays,
    startDate,
    customDays,
  }) {
    try {
      if (!userId || !title || !description || !targetDays || !startDate) {
        return {
          status: 400,
          json: {
            success: false,
            message: "missing required fields",
          },
        };
      }
      const habit = await Habit.create({
        userId,
        title,
        description,
        targetDays,
        startDate,
        customDays,
      });
      return {
        status: 200,
        json: {
          success: true,
          message: "habit created successfully",
          data: habit,
        },
      };
    } catch (error) {
      console.log(`error occured from habit function createHabit ${error}`);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  async getHabits({ userId }) {
    try {
      if (!userId) {
        return {
          status: 400,
          json: {
            success: false,
            message: "missing required fields",
          },
        };
      }
      const habits = await Habit.find({ userId });
      if (habits.length === 0) {
        return {
          status: 200,
          json: {
            success: false,
            message: "no habits found",
          },
        };
      }
      return {
        status: 200,
        json: {
          success: true,
          message: "habits fetched successfully",
          data: habits,
        },
      };
    } catch (error) {
      console.log("error", error);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  async updateHabit({ userId, habitId, date, status }) {
    try {
      if (!userId || !habitId || !date || !status) {
        return {
          status: 400,
          json: {
            success: false,
            message: "missing required fields",
          },
        };
      }
      const targetDate = new Date(date);
      const targetDateString = targetDate.toDateString();

      const habit = await Habit.findOne({ userId, _id: habitId });
      if (!habit) {
        return {
          status: 404,
          json: {
            success: false,
            message: "habit not found",
          },
        };
      }
      const alreadyExists = habit.history.find(
        (entry) => new Date(entry.date).toDateString() === targetDateString
      );

      if (alreadyExists) {
        return {
          status: 400,
          json: {
            success: false,
            message: "This date is already marked",
          },
        };
      }
      const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const currentDayAbbrev = dayMap[targetDate.getDay()];
      if (
        habit.targetDays === "Custom" &&
        !habit.customDays.includes(currentDayAbbrev)
      ) {
        return {
          status: 400,
          json: {
            success: false,
            message: `Cannot mark this habit on ${currentDayAbbrev}. It's not a scheduled day.`,
          },
        };
      }
      habit.history.push({ date: targetDate, status });

      if (status === "completed") {
        let prevDate = new Date(targetDate);
        let streakContinues = false;
        for (let i = 1; i <= 7; i++) {
          prevDate.setDate(prevDate.getDate() - 1);
          const prevDayAbbrev = dayMap[prevDate.getDay()];

          if (
            habit.targetDays === "Every Day" ||
            (habit.targetDays === "Custom" &&
              habit.customDays.includes(prevDayAbbrev))
          ) {
            const match = habit.history.find(
              (entry) =>
                new Date(entry.date).toDateString() ===
                  prevDate.toDateString() && entry.status === "completed"
            );
            if (match) {
              streakContinues = true;
            }
            break;
          }
        }
        habit.streak.current = streakContinues ? habit.streak.current + 1 : 1;
        if (habit.streak.current > habit.streak.longest) {
          habit.streak.longest = habit.streak.current;
        }
      } else if (status === "missed") {
        habit.streak.current = 0;
      }

      await habit.save();
      const updatedHabit = await Habit.findById(habitId);
      return {
        status: 200,
        json: {
          success: true,
          message: `Habit marked as ${status}`,
          habit: updatedHabit,
        },
      };
    } catch (error) {
      console.log("error", error);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  async deleteHabit({ userId, habitId }) {
    try {
      if(!userId || !habitId){
        return {
          status: 400,
          json: {
            success: false,
            message: "missing required fields",
          },
        };
      }
      const habit = await Habit.findOne({ userId, _id: habitId });
      if (!habit) {
        return {
          status: 404,
          json: {
            success: false,
            message: "habit not found",
          },
        };
      }
      await Habit.deleteOne({ userId, _id: habitId });
      return {
        status: 200,
        json: {
          success: true,
          message: "habit deleted successfully",
        },
      };
    } catch (error) {
      console.log("error", error);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }
}

module.exports = HabitFunctions;
