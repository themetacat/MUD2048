/*
 * The supported chains.
 * By default, there are only two chains here:
 *
 * - mudFoundry, the chain running on anvil that pnpm dev
 *   starts by default. It is similar to the viem anvil chain
 *   (see https://viem.sh/docs/clients/test.html), but with the
 *   basefee set to zero to avoid transaction fees.
 * - latticeTestnet, our public test network.
 *

 */

import { MUDChain, latticeTestnet, mudFoundry } from "@latticexyz/common/chains";
import { arbitrumSepolia } from "viem/chains";
import {defineChain} from "viem/utils"
// arbitrumSepolia.rpcUrls.default.http = [ 'https://cosmological-alpha-sponge.arbitrum-sepolia.quiknode.pro/c0498ae8883d4c7679812f21babc4bbcded072ac/' ]
// arbitrumSepolia.rpcUrls.default.webSocket = [ 'wss://cosmological-alpha-sponge.arbitrum-sepolia.quiknode.pro/c0498ae8883d4c7679812f21babc4bbcded072ac/' ]
arbitrumSepolia.rpcUrls.default.webSocket = [ 'wss://sepolia-rollup.arbitrum.io/feed' ]
arbitrumSepolia.rpcUrls.default.http = [ 'https://sepolia-rollup.arbitrum.io/rpc' ]
// arbitrumSepolia.rpcUrls.default.http = ["https://sepolia-rollup.arbitrum.io/rpc"]
/*
 * See https://mud.dev/tutorials/minimal/deploy#run-the-user-interface
 * for instructions on how to add networks.
 */





const redstone = defineChain({
    id: 17_001,
    name: 'REDSTONE HOLESKY',
    network: 'redstone-holesky',
    nativeCurrency: {
      name: 'redstone holesky Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.holesky.redstone.xyz'],
        webSocket: ['wss://rpc.holesky.redstone.xyz/ws']
      },
      public: {
        http: ['https://rpc.holesky.redstone.xyz'],
        webSocket: ['wss://rpc.holesky.redstone.xyz/ws']
      },
    },
    blockExplorers: {
      default: {
        name: 'Blockscout',
        url: 'https://explorer.holesky.redstone.xyz',
      },
    },
    testnet: true,
  })


  export const supportedChains: MUDChain[] = [mudFoundry, latticeTestnet, arbitrumSepolia, redstone];
