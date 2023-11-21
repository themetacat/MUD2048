import { ReactNode, useCallback, useEffect, useState } from "react";
import { Entity } from "@latticexyz/recs";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";
import styles from "./GameMap.module.css";

import { getGradeList } from "../../../service";

type Props = {
  width: number;
  height: number;
  onTileClick?: () => void;
  onTileClick2?: () => void;
  best: any;
  gamestate: any;
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

  const [dataListSum, setDataList] = useState([]);
  const rows = new Array(width).fill(0).map((_, i) => i);
  const columns = new Array(height).fill(0).map((_, i) => i);

  const [showEncounter, setShowEncounter] = useState(false);
  // Reset show encounter when we leave encounter
  useEffect(() => {
    if (!encounter) {
      setShowEncounter(false);
    }
  }, [encounter]);

  const dataHandle = () => {
    const dataList = getGradeList();
    dataList.then(
      (dataListCon) => setDataList(dataListCon.data[0])
      // console.log(dataListCon.data[0])
    );
  };

  useEffect(() => {
    const dataList = getGradeList();
    dataList.then((dataListCon) => {
      setDataList(dataListCon.data);
    });
  }, []);

  return (
    <>
      <div>
        <span onClick={onTileClick} className={styles.PLAY}>play ---- </span>
        <span onClick={onTileClick2}> check</span>
        <div>
          SCORE:
          {game_con && game_con[0] && <div>{game_con[0].currentScore}</div>}
        </div>
        <div>BEST:{best}</div>
        <div>{!gamestate && <div>OVER</div>}</div>
        <div className={`${styles.container}`}>
          {/* // className="inline-grid bg-lime-500 relative overflow-hidden" style={{ width: 300, height: 300, backgroundColor: "antiquewhite",color:"#fff"}}> */}
          {rows.map((y) =>
            columns.map((x) => {
              return (
                <div
                  key={`${x},${y}`}
                  className={twMerge(
                    "w-8 h-8  flex items-center justify-center"
                  )}
                  style={{
                    width: "70px",
                    height: "70px",
                    gridColumn: x + 1,
                    gridRow: y + 1,
                    fontSize: "20px",
                    fontWeight: "bold",
                    borderRadius: "5px",
                  }}
                >
                  {game_con &&
                    game_con[0] &&
                    game_con[0].ma[y * width + x] !== 0 && (
                      <div
                        className={`
                        ${styles.cell}
                        ${game_con[0].ma[y * width + x] === 2 && styles.two2}
                        ${game_con[0].ma[y * width + x] === 4 && styles.four4}
                        ${game_con[0].ma[y * width + x] === 8 && styles.eight8}
                        ${
                          game_con[0].ma[y * width + x] === 64 &&
                          styles.sixtyFour64
                        }
                        ${
                          game_con[0].ma[y * width + x] === 16 &&
                          styles.sixteen16
                        }
                        ${
                          game_con[0].ma[y * width + x] === 128 &&
                          styles.twentyEight128
                        }
                        ${
                          game_con[0].ma[y * width + x] === 32 &&
                          styles.thrityTwo32
                        }
                        ${
                          game_con[0].ma[y * width + x] === 256 &&
                          styles.twoHundred256
                        }
                        ${
                          game_con[0].ma[y * width + x] === 512 &&
                          styles.fiveHundred512
                        }
                        ${
                          game_con[0].ma[y * width + x] === 1024 &&
                          styles.oneThousand1024
                        }
                        ${
                          game_con[0].ma[y * width + x] === 2048 &&
                          styles.twoThousand2048
                        }
                      `}
                      >
                        {game_con[0].ma[y * width + x]}
                      </div>
                    )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Address</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {dataListSum &&
              dataListSum.map((item: any) => (
                <tr key={item.id}>
                  <td className={styles.tr}>{item.address}</td>
                  <td>{item.score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
