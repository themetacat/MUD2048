import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    // TODO
  },
  tables: {
    Movable: "bool",
    GameState: "bool",
    Score: {
      dataStruct: false,
      valueSchema:{
        current: "uint256",
        record: "uint256",
      }
    },
    Matrix: {
      valueSchema: {
        matrixArry: "uint8[]"
      }
    }
  },
});
