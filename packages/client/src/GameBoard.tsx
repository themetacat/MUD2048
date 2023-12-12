import { useComponentValue } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { useMUD } from "./MUDContext";


export const GameBoard = () => {

  const {
    components: { Matrix, Score, GameState },
    network: { playerEntity },
    systemCalls: { init_game, get_metrix},
  } = useMUD();
 
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
    
  return <GameMap width={4} height={4}  best={Number(score?.record) || 0} gamestate={gamestate} game_con={game_con ? [game_con] : []} />;

  
};