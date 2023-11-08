// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { Matrix, Movable, GameState, Score } from "../codegen/index.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

contract GameSystem is System {

  function initMatrix() external{
    bytes32 player = addressToEntityKey(address(_msgSender()));
    uint8[] memory matrixArray = new uint8[](16);
    
    Score.setCurrent(player, 0);
    for (uint i = 0; i < 16; i++) {
        matrixArray[i] = 0; // 初始化数组元素
    }

    GameState.set(player, true);

    genNumber(matrixArray);
    genNumber(matrixArray);
  }

  function getMatrix() public view returns(uint256){
    bytes32 player = addressToEntityKey(address(_msgSender()));
    uint256 currentScore = Score.getCurrent(player);
    return currentScore;
  }

  modifier isGameStart {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    require(GameState.get(player), "game not start");
    _;
  }

  function addScore(uint256 _score) internal{
    bytes32 player = addressToEntityKey(address(_msgSender()));
     (uint256 current, uint256 record) = Score.get(player);

    current += _score;
    if(current > record){
      Score.set(player, current, current);
    }else{
      Score.setCurrent(player, current);
    }
  }

  function genNumber(uint8[] memory matrixArray) internal {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    // uint8[] memory matrixArray = Matrix.get(player);
    uint8 zeroCount = 0;
    for (uint8 i=0; i<matrixArray.length; i++){
      if(matrixArray[i]==0){
        zeroCount++;
      }
    }
    uint256[] memory zeroIndex = new uint256[](zeroCount);
    uint8 currentIndex = 0;
    for (uint8 index; index < matrixArray.length; index ++){
      if(matrixArray[index] == 0){
        zeroIndex[currentIndex] = index;
        currentIndex++;
      }
    }

    if(zeroCount != 0){
      uint256 randomIndex = generateRandomNumber(zeroCount);
      if(randomIndex >zeroCount/3 || zeroCount==16){
        matrixArray[zeroIndex[randomIndex]] = 2;

      }else{
        matrixArray[zeroIndex[randomIndex]] = 4;

      }
    }
    
    Matrix.set(player, matrixArray);

  }

  function generateRandomNumber(uint256 maxNum) internal view returns (uint256) {
      // bytes32 blockHash = blockhash(block.number - 1);
      uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.basefee, block.number))) % maxNum;
      return randomNumber;
  }

  function move(string memory dir) public isGameStart {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    uint8[] memory matrixArray = Matrix.get(player);
    bool isChange;
    uint256 score;
    uint8[] memory _matrixArray;
    if(keccak256(abi.encodePacked(dir)) == keccak256(abi.encodePacked("ArrowRight"))){
      (isChange, score, _matrixArray) = moveRight(0, false, matrixArray);

    }else if(keccak256(abi.encodePacked(dir)) == keccak256(abi.encodePacked("ArrowLeft"))){
      (isChange, score,  _matrixArray) = moveLeft(0, false, matrixArray);

    }else if(keccak256(abi.encodePacked(dir)) == keccak256(abi.encodePacked("ArrowUp"))){
      (isChange, score, _matrixArray) = moveUp(0, false, matrixArray);

    }else{
      (isChange, score, _matrixArray) = moveDown(0, false, matrixArray);

    }
    if(isChange){
      if(score != 0){
        addScore(score);
      }
      genNumber(_matrixArray);
      isGameOver();
    }
  }

  function isGameOver() internal {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    uint8[] memory matrixArray = Matrix.get(player);
    for(uint8 i; i < 4; i++){
      uint8 rowPIndex = i * 4 + 1;
      for(uint8 j; j<3; j++){
        uint8 rowIndex = i * 4 + j;
        uint8 colPIndex = (j+1) * 4 + i;
        uint8 colIndex = j * 4 + i;
        if(matrixArray[rowIndex] == 0 || matrixArray[colIndex] == 0){
          return;
        }
        if(matrixArray[rowIndex] == matrixArray[rowPIndex+j] || matrixArray[colIndex] == matrixArray[colPIndex]){
          return;
        }
      }
    }
    GameState.set(player, false);

  }

  function moveRight(uint256 score, bool isChange, uint8[] memory matrixArray) internal pure returns (bool, uint256, uint8[] memory) {
    
    for(uint8 i=0; i < 4; i++){
      uint8 pIndex = i * 4 + 2;
      for(uint8 j=0; j < 3; j++){
        uint8 index = i * 4 + 3 - j;
        // uint8 newJ = j;

        if (matrixArray[index] == 0) {
          continue;
        }
        while (j < 2 && matrixArray[pIndex - j] == 0) {
          j++;
        }
        if (matrixArray[pIndex - j] == matrixArray[index]) {
            if(!isChange){
              isChange = true;
            }
            matrixArray[index] *= 2;
            matrixArray[pIndex - j] = 0;
            score += matrixArray[index];
        }
      }

      for(uint8 k=0; k<3; k++){
        uint8 zeroIndex = i * 4 + 3 - k;
        uint8 newK = k;
        if(matrixArray[zeroIndex] == 0){
          while (newK < 2 && matrixArray[pIndex - newK] == 0) {
            newK++;
          }
          if(matrixArray[pIndex - newK]!=0){
            if(!isChange){
              isChange = true;
            }
            matrixArray[zeroIndex] = matrixArray[pIndex - newK];
            matrixArray[pIndex - newK] = 0;
          }
        }
      }
    }
    return (isChange, score, matrixArray);
  }

function moveLeft(uint256 score, bool isChange, uint8[] memory matrixArray) internal pure returns (bool, uint256, uint8[] memory) {
   
    for(uint8 i=0; i < 4; i++){
      uint8 pIndex = i * 4 + 1;
      for(uint8 j=0; j < 3; j++){
        uint8 index = i * 4 + j;
        // uint8 newJ = j;
        if (matrixArray[index] == 0) {
          continue;
        }
        while (j < 2 && matrixArray[pIndex + j] == 0) {
          j++;
        }
        if (matrixArray[pIndex + j] == matrixArray[index]) {
          if(!isChange){
            isChange = true;
          }
          matrixArray[index] *= 2;
          matrixArray[pIndex + j] = 0;
          score += matrixArray[index];
        }
      }

      for(uint8 k=0; k<3; k++){
        uint8 zeroIndex = i * 4 +  k;
        uint8 newK = k;
        if(matrixArray[zeroIndex] == 0){
          while (newK < 2 && matrixArray[pIndex + newK] == 0) {
            newK++;
          }
          if(matrixArray[pIndex + newK]!=0){
            if(!isChange){
              isChange = true;
            }
            matrixArray[zeroIndex] = matrixArray[pIndex + newK];
            matrixArray[pIndex + newK] = 0;
          }
        }
      }
    }
    return (isChange, score, matrixArray);
  }

 function moveUp(uint256 score, bool isChange, uint8[] memory matrixArray) internal pure returns (bool, uint256, uint8[] memory) {

    for(uint8 i; i < 4; i++){
      for(uint8 j; j<3; j++){
        uint8 index = j * 4 + i;
        // uint8 newJ = j;
        if(matrixArray[index] == 0){
          continue;
        }
        while(j<2 && matrixArray[(j+1)*4+i]==0){
          j++;
        }
        if(matrixArray[index] == matrixArray[(j+1)*4+i]){
          if(!isChange){
            isChange = true;
          }
          matrixArray[index] = matrixArray[index] * 2;
          matrixArray[(j+1)*4+i] = 0;
          score += matrixArray[index];
        }
      }
      for(uint8 k; k<3; k++){
        uint8 zeroIndex = k * 4 + i;
        uint8 newK = k;
        if(matrixArray[zeroIndex] == 0){
          while(newK<2 && matrixArray[(newK+1)*4+i] == 0){
            newK++;
          }
          if(matrixArray[(newK+1)*4+i] != 0){
            if(!isChange){
              isChange = true;
            }
            matrixArray[zeroIndex] = matrixArray[(newK+1)*4+i];
            matrixArray[(newK+1)*4+i] = 0;
          }
        }
      } 
    }
    return (isChange, score, matrixArray);
 }

 function moveDown(uint256 score, bool isChange, uint8[] memory matrixArray) internal pure returns (bool, uint256, uint8[] memory){

    for(uint8 i; i<4; i++){
      for(uint8 j=3; j>0; j--){
        uint8 index = j * 4 + i;
        if(matrixArray[index] == 0){
          continue;
        }
        while(j > 1 && matrixArray[(j-1)*4+i] == 0){
          j--;
        }
        if(matrixArray[index] == matrixArray[(j-1)*4+i]){
            if(!isChange){
              isChange = true;
            }
          matrixArray[index] *= 2;
          matrixArray[(j-1)*4+i] = 0;
          score += matrixArray[index];
        }
      }
      for(uint8 k=3; k>0; k--){
        uint8 zeroIndex = k * 4 + i;
        uint8 newK = k;
        if(matrixArray[zeroIndex] == 0){
          while(newK > 1 && matrixArray[(newK-1)*4+i] == 0){
            newK--;
          }
          if(matrixArray[(newK-1)*4+i] != 0){
            if(!isChange){
              isChange = true;
            }
            matrixArray[zeroIndex] = matrixArray[(newK-1)*4+i];
            matrixArray[(newK-1)*4+i] = 0;
          }
        }
      }
    }
    return (isChange, score, matrixArray);
 }
}
