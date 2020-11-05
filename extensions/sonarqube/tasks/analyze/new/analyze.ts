import * as tl from "azure-pipelines-task-lib/task";
import analyzeTask from "../../../../../common/ts/analyze-task";
import { createShhPortForwarding } from "../../../../../common/ts/ssh/ssh-utils";

async function run() {
  createShhPortForwarding();

  setTimeout(async () => {
    try {
      await analyzeTask(__dirname);
    } catch (err) {
      tl.setResult(tl.TaskResult.Failed, err.message);
    }
  }, 5000);
}

run();
