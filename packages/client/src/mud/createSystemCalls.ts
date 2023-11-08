/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   *   Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L63-L69).
   *
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs
   *   (https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   */
  { worldContract, waitForTransaction, playerEntity }: SetupNetworkResult,
  { Matrix }: ClientComponents
) {
  // const increment = async () => {
  //   /*
  //    * Because IncrementSystem
  //    * (https://mud.dev/templates/typescript/contracts#incrementsystemsol)
  //    * is in the root namespace, `.increment` can be called directly
  //    * on the World contract.
  //    */
  //   const tx = await worldContract.write.increment();
  //   await waitForTransaction(tx);
  //   return getComponentValue(Counter, singletonEntity);
  // };

  const init_game = async () => {
    if (!playerEntity) {
      throw new Error("no player");
    }
    const tx = await worldContract.write.initMatrix();
    await waitForTransaction(tx);
    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const get_metrix = async () => {
    if (!playerEntity) {
      throw new Error("no player");
    }
    console.log(getComponentValue(Matrix, playerEntity)?.matrixArry);
    
    // const tx = await worldContract.read.getMatrix();
    // console.log(tx);
    
    // return tx
  };


  const move = async (dir:string) => {
    if (!playerEntity) {
      throw new Error("no player");
    }
    const tx = await worldContract.write.move([dir]);

    // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  return {
    init_game,
    get_metrix,
    move
  };
}
