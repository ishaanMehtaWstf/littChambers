export function getDeployment() {
  console.log(process.env);
  return {
    name: "Deep Agent",
    deploymentUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL || "http://127.0.0.1:2024",
    agentId: process.env.NEXT_PUBLIC_AGENT_ID || "deepagent",
  };
}
