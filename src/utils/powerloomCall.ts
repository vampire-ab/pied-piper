// /data/{epoch_id}/{project_id}/
import axios from "axios";
export async function fetchData(epochId: string) {
  try {
    const endpoint = `https://cuddly-computing-machine-gjv97549jjcvr7x-8002.app.github.dev/data/${epochId}/eth%3Atracking_contract_interaction%3A0xacbf7eaa5bf7c3b52401327edeac5d8936e45606%3A0x9c9C5BB5D64da94632F59c5F6BeE6340cF200a4f/`;
    console.log(endpoint);
    const res = await axios.get(endpoint);
    return res.data;
  } catch (e) {
    console.log(e);
  }
}

export function getBlockNumbers() {
  return ["2533924", "2537522", "2537496"];
}
