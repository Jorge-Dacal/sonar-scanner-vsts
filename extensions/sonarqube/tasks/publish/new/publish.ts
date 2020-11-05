import * as tl from "azure-pipelines-task-lib/task";
import publishTask from "../../../../../common/ts/publish-task";
import { EndpointType } from "../../../../../common/ts/sonarqube/Endpoint";
import { createShhPortForwarding } from "../../../../../common/ts/ssh/ssh-utils";

async function run() {
  createShhPortForwarding();

  setTimeout(async () => {
    try {
      await publishTask(EndpointType.SonarQube);
    } catch (err) {
      tl.debug("[SQ] Publish task error: " + err.message);
      tl.setResult(tl.TaskResult.Failed, err.message);
    }
  }, 5000);
}

run();
