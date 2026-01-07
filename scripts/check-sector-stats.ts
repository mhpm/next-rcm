import { getSectorStats } from "../src/app/(authenticated)/sectors/actions/sectors.actions";

async function run() {
  try {
    console.log("Checking stats for 'demo'...");
    const demo = await getSectorStats("demo");
    console.log("demo:", demo);

    console.log("Checking stats for 'iafcj-tecolutilla'...");
    const teco = await getSectorStats("iafcj-tecolutilla");
    console.log("iafcj-tecolutilla:", teco);

    console.log("Checking stats for '1ra-iafcj-ensenada'...");
    const ens = await getSectorStats("1ra-iafcj-ensenada");
    console.log("1ra-iafcj-ensenada:", ens);
  } catch (e) {
    console.error("Error running check-sector-stats:", e);
  }
}

run();
