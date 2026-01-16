import {NETWORK} from "$env/static/private";

const VALID_NETWORKS: NetworkType[] = ["mainnet", "testnet"];
const DEFAULT_NETWORK: NetworkType = "testnet";

function validateNetwork(network: string): NetworkType {
  // Fallback to default for empty values (e.g., forks without env var access)
  if (!network) {
    return DEFAULT_NETWORK;
  }
  if (!VALID_NETWORKS.includes(network as NetworkType)) {
    throw new Error(
      `Invalid NETWORK environment variable: "${network}". Must be one of: ${VALID_NETWORKS.join(", ")}`
    );
  }
  return network as NetworkType;
}

export const network: NetworkType = validateNetwork(NETWORK);
