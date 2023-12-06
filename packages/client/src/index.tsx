import ReactDOM from "react-dom/client";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import mudConfig from "contracts/mud.config";
import { useEffect } from "react";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);



// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then(async (result) => {
  // console.log(result,4553)
  root.render(
    <MUDProvider value={result}>
      <App />
    </MUDProvider>
  );

  // https://vitejs.dev/guide/env-and-mode.html
  if (import.meta.env.DEV) {
    const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
    // console.log(  mountDevTools({
    //   config: mudConfig,
    //   publicClient: result.network.publicClient as any,
    //   walletClient: result.network.walletClient as any,
    //   latestBlock$: result.network.latestBlock$,
    //   storedBlockLogs$: result.network.storedBlockLogs$,
    //   worldAddress: result.network.worldContract.address,
    //   worldAbi: result.network.worldContract.abi,
    //   write$: result.network.write$,
    //   recsWorld: result.network.world,
    // }).then((res)=>{console.log(res,'============')}),
    // 999999)
    mountDevTools({
      config: mudConfig,
      publicClient: result.network.publicClient as any,
      walletClient: result.network.walletClient as any,
      latestBlock$: result.network.latestBlock$,
      storedBlockLogs$: result.network.storedBlockLogs$,
      worldAddress: result.network.worldContract.address,
      worldAbi: result.network.worldContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world,
    });
  }
});


