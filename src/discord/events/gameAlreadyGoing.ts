import {getCurrentChannel} from "../index";

export function handleGameAlreadyGoing() {
  getCurrentChannel().send('Game already going.');
}
