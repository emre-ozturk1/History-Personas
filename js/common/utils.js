/**
 *
 * @param {string} text
 * @returns {Promise<string>}
 */
export async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return bufferToHex(hashBuffer);
}

/**

 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
