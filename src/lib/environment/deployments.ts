export function getDeployment() {
  return {
    name: "Deep Agent",
    deploymentUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL || "http://ai.litchamber.lit.law",
    agentId: process.env.NEXT_PUBLIC_AGENT_ID || "deepagent",
  };
}
