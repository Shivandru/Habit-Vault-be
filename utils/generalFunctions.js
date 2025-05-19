function _getMissedDays(habit) {
  const today = new Date().toDateString();
  const start = new Date(habit.startDate);
  const lastDate = new Date();
  const historyDates = habit.history.map((h) =>
    new Date(h.date).toDateString()
  );

  const missed = [];
  for (let d = new Date(start); d <= lastDate; d.setDate(d.getDate() + 1)) {
    const dStr = new Date(d).toDateString();
    if (!historyDates.includes(dStr)) {
      missed.push(new Date(d));
    }
  }

  return missed.filter((date) => date.toDateString() !== today);
}

async function _updateHabitProgress(habit) {
  const missedDays = getMissedDays(habit);

  if (missedDays.length > 0) {
    missedDays.forEach((date) => {
      habit.history.push({ date, status: "missed" });
    });

    // Reset streak
    habit.streak.current = 0;
  }

  await habit.save();
}

module.exports = { _getMissedDays, _updateHabitProgress };
