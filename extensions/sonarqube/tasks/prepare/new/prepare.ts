import * as tl from "azure-pipelines-task-lib/task";
import Endpoint, { EndpointType } from "../../../../../common/ts/sonarqube/Endpoint";
import prepareTask from "../../../../../common/ts/prepare-task";
import { prepareSshVars, createShhPortForwarding } from "../../../../../common/ts/ssh/ssh-utils";

async function run() {
  try {
    const endpoint = Endpoint.getEndpoint(
      tl.getInput(EndpointType.SonarQube, true),
      EndpointType.SonarQube
    );

    endpoint.url = prepareSshVars(endpoint);
    createShhPortForwarding();

    setTimeout(async () => {
      try {
        await prepareTask(endpoint, __dirname);
      } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
      }
    }, 5000);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
