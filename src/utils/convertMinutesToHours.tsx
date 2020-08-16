export default function convertMinutesToHurs(minutes: number){
  return ('00'+Math.floor(minutes/60)).slice(-2)+":"+('00'+minutes%60).slice(-2);
}