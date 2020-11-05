import * as tl from "azure-pipelines-task-lib/task";
import {
  certificatePathVar,
  certificatePathInput,
  jumpboxIpInput,
  jumpboxIpVar,
  sshForwardingPort,
  remoteSonarqubeHostVar,
} from "./ssh-constants";
import * as url from "url";
import { spawn } from "child_process";
import Endpoint from "../sonarqube/Endpoint";

export function prepareSshVars(endpoint: Endpoint) {
  if (!tl.getInput(certificatePathInput) || !tl.getInput(jumpboxIpInput)) {
    return endpoint.url;
  }

  const newUrl = new url.URL(endpoint.url);

  tl.setVariable(certificatePathVar, tl.getInput(certificatePathInput));
  tl.setVariable(jumpboxIpVar, tl.getInput(jumpboxIpInput));
  tl.setVariable(remoteSonarqubeHostVar, newUrl.hostname + ":" + newUrl.port);

  newUrl.hostname = "127.0.0.1";
  newUrl.port = sshForwardingPort;

  return newUrl.href;
}

export function createShhPortForwarding() {
  if (!tl.getInput(certificatePathInput) || !tl.getInput(jumpboxIpInput)) {
    return;
  }

  const ssh = spawn(
    "ssh",
    [
      "-o",
      "StrictHostKeyChecking=no",
      "-i",
      tl.getVariable(certificatePathVar),
      "-fN",
      "-L",
      sshForwardingPort + ":" + tl.getVariable(remoteSonarqubeHostVar),
      tl.getVariable(jumpboxIpVar),
    ],
    {
      detached: true,
      stdio: "ignore",
    }
  );

  process.on("exit", () => {
    ssh.kill();
  });

  ssh.on("message", (m) => tl.debug(m));
  ssh.on("error", (e) => tl.error(JSON.stringify(e)));
  ssh.unref();
}
