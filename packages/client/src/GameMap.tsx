import { ReactNode, useEffect, useState } from "react";
import { Entity } from "@latticexyz/recs";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";

type Props = {
  width: number;
  height: number;
  onTileClick?: () => void;
  onTileClick2?: () => void;
  best: any,
  gamestate: any,
  game_con?: {
    ma: any;
    currentScore: any;
    entity: Entity;
  }[];
  encounter?: ReactNode;
};

export const GameMap = ({
  width,
  height,
  best,
  onTileClick,
  onTileClick2,
  game_con,
  gamestate,
  encounter,
}: Props) => {
  
  const {
    network: { playerEntity },
  } = useMUD();

  const rows = new Array(width).fill(0).map((_, i) => i);
  const columns = new Array(height).fill(0).map((_, i) => i);

  const [showEncounter, setShowEncounter] = useState(false);
  // Reset show encounter when we leave encounter
  useEffect(() => {
    if (!encounter) {
      setShowEncounter(false);
    }
 
  }, [encounter]);
  

  return (
    <div>
      <span onClick={onTileClick}>play ----       </span>
      <span onClick={onTileClick2}>    check</span>
      <div>
        SCORE:{game_con && game_con[0]  && (
                <div>
                  {game_con[0].currentScore}
                </div>
              )}
      </div>
      <div>
        BEST:{best}
      </div>
      <div>
        {!gamestate && (
                <div>
                  OVER
                </div>
              )}
      </div>
    <div className="inline-grid bg-lime-500 relative overflow-hidden" style={{ width: 300, height: 300, backgroundColor: "antiquewhite"}}>
      {rows.map((y) =>
        columns.map((x) => {

          return (
            <div
              key={`${x},${y}`}
              className={twMerge(
                "w-8 h-8  flex items-center justify-center",
              )}
              style={{
                width: 65,
                height: 65,
                gridColumn: x + 1,
                gridRow: y + 1,
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              {game_con && game_con[0] && game_con[0].ma[y * width + x] !== 0 && (
                <div>
                  {game_con[0].ma[y * width + x]}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
    </div>
  );
};