import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", async () => {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request sent successfully");
      } else {
        console.log("Error sending GET request : ", res.statusCode);
      }
    })
    .on("error", (e) => console.error("Error sending GET request : ", e));
});

export default job;
