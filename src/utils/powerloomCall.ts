// /data/{epoch_id}/{project_id}/
import axios from "axios";
export async function fetchData(epochId: string) {
  const endpoint = `http://localhost:8002/data/${epochId}/eth:tracking_contract_interaction:0xacbf7eaa5bf7c3b52401327edeac5d8936e45606:0x9c9C5BB5D64da94632F59c5F6BeE6340cF200a4f}`;
  const res = await axios.get(endpoint);
  return res.data;
}

export function getBlockNumbers() {
  return ["2533924", "2537522", "2537496"];
}
