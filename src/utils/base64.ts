export function objectToBase64(obj: object) {
  const buffer = Buffer.from(JSON.stringify(obj));
  return buffer.toString('base64');
}
