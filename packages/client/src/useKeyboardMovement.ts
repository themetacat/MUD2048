import { useEffect } from "react";
import { useMUD } from "./MUDContext";

export const useKeyboardMovement = () => {
  const {
    systemCalls: { move },
  } = useMUD();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {

      // if (e.key === "ArrowLeft") {
      //   move_left();
      // }else if (e.key === "ArrowRight") {
      //   move_right();
      // }else if (e.key === "ArrowUp") {
      //   move_up();
      // }else if (e.key === "ArrowDown") {
      //   move_down();
      // }
      move(e.key)
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [move]);
};