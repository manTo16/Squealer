
import axios from "@root/axiosConfig"
import { apiPostsURL, apiUsersURL } from "../URLs";

// Aggiunge un nuovo intervallo al localStorage
export function addInterval(action: () => void, delay: number): number {
    const intervalId = window.setInterval(action, delay);
  
    const intervals = JSON.parse(localStorage.getItem('intervals') || '[]');
  
    intervals.push(intervalId);
  
    localStorage.setItem('intervals', JSON.stringify(intervals));
  
    return intervalId;
}
  
  // Elimina un intervallo dal localStorage
export function removeInterval(intervalId: number): void {
    clearInterval(intervalId);

    let intervals = JSON.parse(localStorage.getItem('intervals') || '[]');

    intervals = intervals.filter((id: number) => id !== intervalId);

    localStorage.setItem('intervals', JSON.stringify(intervals));
}




export async function addAutomaticPost(
  postInfo: { username: string; text: string; receivers: string[]; repeatPostInterval: { interval: number; unit: string } },
  reqHeaders: { headers: { Authorization: string } },
  replyTo: string,
  onlyUsersInReceivers: boolean
): Promise<number> {
  const { interval, unit } = postInfo.repeatPostInterval;
  const delay = 1000 * interval * (unit === 'Secondi' ? 1 : unit === 'Minuti' ? 60 : unit === 'Ore' ? 3600 : 24 * 3600);

  console.log("creo post automatico ogni ", interval, unit, ": ", postInfo.text)
  
  const action = async () => {
    await axios.post(apiPostsURL, postInfo, reqHeaders)
      .then(() => {
        if (replyTo) {
          return axios.put(`${apiPostsURL}/${replyTo}/replies`, { replyPostId: replyTo });
        }
      })
      .then(() => {
        if (!onlyUsersInReceivers) {
          return axios.patch(`${apiUsersURL}/${postInfo.username}/characters`, { daily: -125, weekly: -125, monthly: -125 });
        }
      });
  };

  return addInterval(action, delay);
}