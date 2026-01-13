import {NETWORK} from "$env/static/private";

const VALID_NETWORKS: NetworkType[] = ['mainnet', 'testnet'];

function validateNetwork(network: string): NetworkType {
  if (!VALID_NETWORKS.includes(network as NetworkType)) {
    throw new Error(`Invalid NETWORK environment variable: "${network}". Must be one of: ${VALID_NETWORKS.join(', ')}`);
  }
  return network as NetworkType;
}

export const network: NetworkType = validateNetwork(NETWORK);
