import { ReactNode, useCallback, useEffect, useState } from "react";
import { Entity } from "@latticexyz/recs";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";
import styles from "./GameMap.module.css";
import { createSystemCalls } from "./mud/createSystemCalls";
import { getGradeList } from "../../../service";
import { useComponentValue } from "@latticexyz/react";
import image from "../../../images/loading.png";
import toast, { Toaster } from 'react-hot-toast';
import {SyncStep} from "@latticexyz/store-sync"
import { singletonEntity } from "@latticexyz/store-sync/recs";

// import {setupNetwork} from './mud/setupNetwork';

type Props = {
  width: number;
  height: number;
  onTileClick?: () => void;
  onTileClick3?: () => Promise<boolean>;
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
  onTileClick3,
  onTileClick2,
  game_con,
  gamestate,
  encounter,
}: Props) => {
  const {
    network: { playerEntity },
    components: { Matrix, Score, GameState ,SyncProgress},
    systemCalls: { init_game, get_metrix,move},
  } = useMUD();

  const [dataListSum, setDataList] = useState([]);
  const rows = new Array(width).fill(0).map((_, i) => i);
  const columns = new Array(height).fill(0).map((_, i) => i);
  const [loading, setLoading] = useState({
    up: false,
    left: false,
    down: false,
    right: false,
  });

  const [key, setKey] = useState(0);
  const [resultVal, setResultVal] = useState(false);
  const [showEncounter, setShowEncounter] = useState(false);


  useEffect(() => {
    if (!encounter) {
      setShowEncounter(false);
    }
  }, [encounter]);

  const dataHandle = useCallback(() => {
    const dataList = getGradeList();
    dataList.then((dataListCon) => setDataList(dataListCon.data));
    // console.log(dataListCon.data[0])
  }, [best]);
  // if(best){
  //   dataHandle()
  // }
  useEffect(() => {
    dataHandle();
    // const dataList = getGradeList();
    // dataList.then((dataListCon) => {
    //   setDataList(dataListCon.data);
    // });
  }, [best, dataHandle]);
 
  const handleButtonClick = (direction: any) => {
    // 在这里处理按钮点击逻辑
    // handleClickAndGetTrue();
    setLoading((prevLoading) => ({ ...prevLoading, [direction]: true }));
    // 模拟按下对应的方向键
    const keyMap = {
      up: "ArrowUp",
      left: "ArrowLeft",
      down: "ArrowDown",
      right: "ArrowRight",
    };
    const event = new KeyboardEvent("keydown", {
      key: keyMap[direction as "up" | "left" | "down" | "right"],
    });
    // window.dispatchEvent(event);

    const moveData=  move(event.key)
    moveData.then((moveDataVal)=>{
      console.log(moveDataVal)
      if(moveDataVal){
        setLoading({
          up: false,
          left: false,
          down: false,
          right: false
        });
      }
    })
    moveData.catch((error) => {
      move(event.key)
      console.log(error,22222222222)
    });

    // 2秒后将加载状态设置为 false
    setTimeout(() => {
        setLoading((prevLoading) => ({ ...prevLoading, [direction]: false }));
    
    }, 3000);
  };
  // const result =  onTileClick3();
  // console.log(result, 66666); // 在这里处理true值'

  useEffect(() => {
    
    const handleKeyDown = (event: any) => {
      
      // 判断当前按下的键是否为方向键
      if (["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(event.key)) {
        switch (event.key) {
          case "ArrowUp":
            // handleButtonClick("up");
            // setLoading((prevLoading) => ({ ...prevLoading, [event.key]: true }));
            setLoading({
              up: true,
              left: false,
              down: false,
              right: false
            });
         
            break;
          case "ArrowLeft":
            // handleButtonClick("left");
            setLoading({
              up: false,
              left: true,
              down: false,
              right: false
            });
            break;
          case "ArrowDown":
            // handleButtonClick("down");
            setLoading({
              up: false,
              left: false,
              down: true,
              right: false
            });
            break;
          case "ArrowRight":
            // handleButtonClick("right");
            setLoading({
              up: false,
              left: false,
              down: false,
              right: true
            });
            break;
          default:
            break;
        }
     
    }
    const moveData=  move(event.key)
    moveData.then((moveDataVal)=>{
      console.log(moveDataVal)
      if(moveDataVal){
        setLoading({
          up: false,
          left: false,
          down: false,
          right: false
        });
      }
    })
    moveData.catch((error) => {
      move(event.key)
      console.log(error,22222222222)
    });
    }

    // setTimeout(()=>{
    //   setLoading({
    //     up: false,
    //     left: false,
    //     down: false,
    //     right: false
    //   });
    // },3000)
    // 添加事件监听器
    document.addEventListener("keydown", handleKeyDown);
  
    // 在组件卸载时移除事件监听器
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const newGame = ()=>{
    // console.log(3333)
   const resultGame = init_game()
    setResultVal(true)
// console.log(resultGame,654)
    resultGame.then((resultGameVal)=>{
      // console.log(resultGameVal,24555)
      // console.log(resultGame)
      if(resultGameVal[1]===true){
        setResultVal(false)
      }
    })
    resultGame.catch((error) => {
      console.log(error)
      // toast.error(error)
      setResultVal(false)
    });
  
   
  }




  const gameData = game_con && game_con[0] && game_con[0].ma;
const itemJump =(address:any)=>{
  window.open(`https://explorer.testnet-chain.linfra.xyz/address/${address}`)
}
const syncProgress = useComponentValue(SyncProgress, singletonEntity) as any;


// let hasExecuted=false;
const Matrix_arry = useComponentValue(Matrix, playerEntity);
useEffect(() => {
// if(!(Matrix_arry&&Matrix_arry.matrixArry)&&(syncProgress && syncProgress.step !== SyncStep.LIVE)){
//   console.log('============')
//   init_game()
// }
// console.log(game_con, !game_con&&!(syncProgress&& syncProgress?.step !== SyncStep?.LIVE))
// console.log(Matrix_arry&&Matrix_arry.matrixArry,!(Matrix_arry&&Matrix_arry.matrixArry))
// if(!syncProgress&& syncProgress?.step !== SyncStep?.LIVE){
  if(!(syncProgress&& syncProgress?.step !== SyncStep?.LIVE)&&syncProgress!==undefined){
 
// console.log(88888888)
    // if(!(Matrix_arry&&Matrix_arry.matrixArry)){
    if((Matrix_arry&&Matrix_arry.matrixArry)===undefined){
      // console.log('=====234==')
      init_game()
    }
    // hasExecuted=true // 设置状态为已执行过
  }

  
// }

}, [Matrix_arry,init_game,game_con,syncProgress]);

  return (
    <>
     {syncProgress && syncProgress.step !== SyncStep.LIVE? (

      <div style={{color:"#fff"}}>
        {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
      </div>
    ) : (
      <div className={styles.conta}>
      {/* <div style={{ flexGrow:"1",width:"400px"}}> */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan={3}>Rankings</th>
          </tr>
        </thead>
        <tbody>
          {dataListSum &&
            dataListSum.map((item: any,index: number) => (
              <tr key={item.id} className={styles.trData}>
                   <td >{index + 1}</td> {/* 添加序号并左对齐 */}
                <td  className={styles.tr2Data} style={{ textAlign: "left",cursor:"pointer" ,}} onClick={()=>{itemJump(item.address)}}>
                  {item.address.substring(0, 6) +
                    "..." +
                    item.address.substring(item.address.length - 4)}
                </td>
                <td style={{ paddingRight: "20px" ,width:'100px'}}>{item.score}</td>
              </tr>
            ))}
        </tbody>
        <thead>
          <tr>
            <th colSpan={3}>
              <div className={styles.tableFooter}>
                SCORE:
                {game_con && game_con[0] && (
                  <span>{game_con[0].currentScore}</span>
                )}
                <span style={{ marginLeft: "20px" }}>BEST:{best}</span>
              </div>
            </th>
          </tr>
        </thead>
        <div></div>
      </table>
      {/* </div> */}
      <div style={{ display: "flex", flexGrow: "1" }}>
        <div className={`${styles.container}`}>
          {rows.map((y) =>
            columns.map((x) => {
           
              return (
                <div
                  key={`${x},${y}`}
                  className={styles.square}
                  style={{
                    width:'99px !important',
                    height: '100px !important',
                    gridColumn: x + 1,
                    gridRow: y + 1,
                    fontSize: "20px",
                    fontWeight: "bold",
                    borderRadius: "5px",
                  }}
                >
               
                  {
                  game_con &&
                    game_con[0] &&
                    Number(game_con[0].ma[y * width + x]) !== 0 && (
                      <div
                        className={`
                        ${styles.cell}
                        ${Number(game_con[0].ma[y * width + x]) === 2 && styles.two2}
                        ${Number(game_con[0].ma[y * width + x]) === 4 && styles.four4}
                        ${Number(game_con[0].ma[y * width + x]) && styles.eight8}
                        ${
                          Number(game_con[0].ma[y * width + x]) === 64 &&
                          styles.sixtyFour64
                        }
                        ${
                          Number(game_con[0].ma[y * width + x]) === 16 &&
                          styles.sixteen16
                        }
                        ${
                          Number(game_con[0].ma[y * width + x]) === 128 &&
                          styles.twentyEight128
                        }
                        ${
                          Number(game_con[0].ma[y * width + x]) === 32 &&
                          styles.thrityTwo32
                        }
                        ${
                          Number(game_con[0].ma[y * width + x]) === 256 &&
                          styles.twoHundred256
                        }
                        ${
                          Number(game_con[0].ma[y * width + x]) === 512 &&
                          styles.fiveHundred512
                        }
                        ${
                          Number(game_con[0].ma[y * width + x]) === 1024 &&
                          styles.oneThousand1024
                        }
                        ${
                          Number(game_con[0].ma[y * width + x]) === 2048 &&
                          styles.twoThousand2048
                        }
                      `}
                      >
                        
                        {Number(game_con[0].ma[y * width + x])}
                        
                      </div>
                    )
                    }

                </div>
              );
            })
          )}
        </div>
        {/* <div className={`${styles.container}`}>
          <div className="grid-container">{grid.flat()}</div>
        </div> */}
        <div>
         {resultVal?  <span className={styles.PLAY}><img key={key} src={image} className={styles.commonCls1} /></span>:<span onClick={newGame} className={styles.PLAY}>
            New Game
          </span>}
          {/* <span onClick={onTileClick2}> check</span> */}
          <span className={styles.transac} id='history'>Transactions history</span>
          <div className={styles.btnmea}>
            {loading["up"] ? (
              <img key={key} src={image} className={styles.commonCls1} />
            ) : (
              <button
                className={`${styles.btn} ${loading["up"] ? styles.loading : ''}`}
                tabIndex={0}
                type="button"
                onClick={() => handleButtonClick("up")}
                key={key}
                disabled={loading["up"]}
              >
                <span className="MuiButton-startIcon MuiButton-iconSizeLarge css-coclz">
                  <svg
                    className={styles.MuiSvgIcon}
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      id="页面-1"
                      stroke="none"
                      strokeWidth="1"
                    >
                      <g
                        id="Game"
                        transform="translate(-925.000000, -325.000000)"
                      >
                        <g
                          id="编组-16"
                          transform="translate(925.000000, 325.000000)"
                        >
                          <rect
                            height="24"
                            id="矩形"
                            width="24"
                            x="0"
                            y="0"
                          ></rect>
                          <g
                            id="编组-3"
                            transform="translate(12.000000, 12.000000) rotate(-90.000000) translate(-12.000000, -12.000000) translate(0.000000, 2.769231)"
                          >
                            <path
                              d="M11.0769231,18.4615385 L11.076,13.846 L0,13.8461538 L0,4.61538462 L11.076,4.615 L11.0769231,0 L15.3392308,0 L24,9.23076923 L15.3392308,18.461 L11.0769231,18.4615385 Z"
                              fill="#373741"
                              id="形状结合"
                            ></path>
                            <path
                              d="M14.7692308,0.461538462 L22.9962768,9.23076923 L14.7692308,18 L14.7687692,12.9225385 L3.23076923,12.9230769 L3.23076923,5.53846154 L14.7687692,5.53753846 L14.7692308,0.461538462 Z"
                              fill="#FFFFFF"
                              id="形状结合"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span className="MuiTouchRipple-root css-w0pj6f"></span>
              </button>
            )}
          </div>
          <div className={styles.btnCon}>
            {loading["left"] ? (
              <img key={key} src={image} className={styles.commonCls1} />
            ) : (
              <button
                className={styles.btn}
                tabIndex={0}
                type="button"
                onClick={() => handleButtonClick("left")}
                id="btn2"
              >
                <span className="MuiButton-startIcon MuiButton-iconSizeLarge css-coclz">
                  <svg
                    className={styles.MuiSvgIcon}
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      id="页面-1"
                      stroke="none"
                      strokeWidth="1"
                    >
                      <g
                        id="Game"
                        transform="translate(-925.000000, -381.000000)"
                      >
                        <g
                          id="编组-16备份-2"
                          transform="translate(925.000000, 381.000000)"
                        >
                          <rect
                            height="24"
                            id="矩形"
                            width="24"
                            x="0"
                            y="0"
                          ></rect>
                          <g
                            id="编组-3"
                            transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) translate(0.000000, 2.769231)"
                          >
                            <path
                              d="M11.0769231,18.4615385 L11.076,13.846 L0,13.8461538 L0,4.61538462 L11.076,4.615 L11.0769231,0 L15.3392308,0 L24,9.23076923 L15.3392308,18.461 L11.0769231,18.4615385 Z"
                              fill="#373741"
                              id="形状结合"
                            ></path>
                            <path
                              d="M14.7692308,0.461538462 L22.9962768,9.23076923 L14.7692308,18 L14.7687692,12.9225385 L3.23076923,12.9230769 L3.23076923,5.53846154 L14.7687692,5.53753846 L14.7692308,0.461538462 Z"
                              fill="#FFFFFF"
                              id="形状结合"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span className="MuiTouchRipple-root css-w0pj6f"></span>
              </button>
            )}
            {loading["down"] ? (
              <img key={key} src={image} className={styles.commonCls1} />
            ) : (
              <button
                className={styles.btn}
                tabIndex={0}
                type="button"
                onClick={() => handleButtonClick("down")}
                id="btn3"
              >
                <span className="MuiButton-startIcon MuiButton-iconSizeLarge css-coclz">
                  <svg
                    className={styles.MuiSvgIcon}
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      id="页面-1"
                      stroke="none"
                      strokeWidth="1"
                    >
                      <g
                        id="Game"
                        transform="translate(-925.000000, -408.000000)"
                      >
                        <g
                          id="编组-17"
                          transform="translate(925.000000, 408.000000)"
                        >
                          <rect
                            height="24"
                            id="矩形备份-14"
                            width="24"
                            x="0"
                            y="0"
                          ></rect>
                          <g
                            id="编组-3备份"
                            transform="translate(12.000000, 12.000000) rotate(90.000000) translate(-12.000000, -12.000000) translate(0.000000, 2.769231)"
                          >
                            <path
                              d="M11.0769231,18.4615385 L11.076,13.846 L0,13.8461538 L0,4.61538462 L11.076,4.615 L11.0769231,2.18253431e-13 L15.3392308,2.18253431e-13 L24,9.23076923 L15.3392308,18.461 L11.0769231,18.4615385 Z"
                              fill="#373741"
                              id="形状结合"
                            ></path>
                            <path
                              d="M12,0.461538462 L20.227046,9.23076923 L12,18 L11.9990769,12.9225385 L0.923076923,12.9230769 L0.923076923,5.53846154 L11.9990769,5.53753846 L12,0.461538462 Z"
                              fill="#FFFFFF"
                              id="形状结合"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span className="MuiTouchRipple-root css-w0pj6f"></span>
              </button>
            )}
            {loading["right"] ? (
              <img key={key} src={image} className={styles.commonCls1} />
            ) : (
              <button
                className={styles.btn}
                tabIndex={0}
                type="button"
                onClick={() => handleButtonClick("right")}
                id="btn4"
              >
                <span className="MuiButton-startIcon MuiButton-iconSizeLarge css-coclz">
                  <svg
                    className={styles.MuiSvgIcon}
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      id="页面-1"
                      stroke="none"
                      strokeWidth="1"
                    >
                      <g
                        id="Game"
                        transform="translate(-925.000000, -353.000000)"
                      >
                        <g
                          id="编组-16备份"
                          transform="translate(925.000000, 353.000000)"
                        >
                          <rect
                            height="24"
                            id="矩形"
                            width="24"
                            x="0"
                            y="0"
                          ></rect>
                          <g
                            id="编组-3"
                            transform="translate(0.000000, 2.769231)"
                          >
                            <path
                              d="M11.0769231,18.4615385 L11.076,13.846 L0,13.8461538 L0,4.61538462 L11.076,4.615 L11.0769231,0 L15.3392308,0 L24,9.23076923 L15.3392308,18.461 L11.0769231,18.4615385 Z"
                              fill="#373741"
                              id="形状结合"
                            ></path>
                            <path
                              d="M14.7692308,0.461538462 L22.9962768,9.23076923 L14.7692308,18 L14.7687692,12.9225385 L3.23076923,12.9230769 L3.23076923,5.53846154 L14.7687692,5.53753846 L14.7692308,0.461538462 Z"
                              fill="#FFFFFF"
                              id="形状结合"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span className="MuiTouchRipple-root css-w0pj6f"></span>
              </button>
            )}
          </div>
          <div>{!gamestate && <div>OVER</div>}</div>
        </div>
      </div>
    </div>
    )}
        <Toaster
          toastOptions={{
            duration: 2000,
            style: {
              background: 'linear-gradient(90deg, #dedfff,#8083cb)',
              color: 'black',
              borderRadius: '8px',
            },
          }}
        />
    </>
  );
};
