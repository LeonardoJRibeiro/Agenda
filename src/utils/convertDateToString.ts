export default function formatarData(data: Date) {
  if (data) {
    const dataC = new Date(data)
    return `${("0" + dataC.getUTCDate()).slice(-2)}/${("0" + (dataC.getUTCMonth() + 1)).slice(-2)}/${dataC.getUTCFullYear()}`
  }
  return "";
}