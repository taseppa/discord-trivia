import { getCurrentChannel } from "../index";

export async function handleGameAlreadyGoing() {
  await getCurrentChannel().send('Game already going.');
}
