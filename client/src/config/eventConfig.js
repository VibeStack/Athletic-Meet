// Event configuration - easy to update
export const eventConfig = {
  // Registration start date - users cannot login/register before this date
  registrationStartDate: new Date("2026-02-09T00:00:00+05:30"),

  // Event dates
  eventDates: {
    day1: new Date("2026-02-19"),
    day2: new Date("2026-02-20"),
  },

  // Helper function to check if registration is open
  isRegistrationOpen: () => {
    return new Date() >= eventConfig.registrationStartDate;
  },

  // Get formatted registration start date
  getRegistrationStartDateFormatted: () => {
    return eventConfig.registrationStartDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  },
};

export default eventConfig;
