import { useComponentValue } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { useEffect } from "react";

export const GameBoard = (onChildValueChange :any) => {
  // useKeyboardMovement();

  const {
    components: { Matrix, Score, GameState },
    network: { playerEntity },
    systemCalls: { init_game, get_metrix},
  } = useMUD();
  // const canSpawn = useComponentValue(Matrix, playerEntity)?.value !== true;
 
  const Matrix_arry = useComponentValue(Matrix, playerEntity);
  const score = useComponentValue(Score, playerEntity);
  const gamestate = useComponentValue(GameState, playerEntity);
  
  const game_con =
    playerEntity && Matrix_arry
      ? {
          ma: Matrix_arry.matrixArry,
          currentScore: Number(score?.current) || 0,
          entity: playerEntity,
        }
      : null;
      // useEffect(() => {
      //   if (!Matrix_arry || !Matrix_arry.matrixArry) {
      //     init_game();
      //   }
      // }, [Matrix_arry]);
    
      // if (!game_con || !game_con.ma) {
      //   return <div style={{color:"#fff"}}>Loading...</div>; // 或者其他适当的加载状态
      // }

  return <GameMap width={4} height={4}  onTileClick={init_game} onTileClick2={get_metrix} best={Number(score?.record) || 0} gamestate={gamestate} game_con={game_con ? [game_con] : []} />;

  
};