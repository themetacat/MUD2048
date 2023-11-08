import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { GameBoard } from "./GameBoard";

export const App = () => {
  // const {
  //   components: { Counter },
  //   systemCalls: { increment },
  // } = useMUD();

  // const counter = useComponentValue(Counter, singletonEntity);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <GameBoard />
      </div>

  );
};
