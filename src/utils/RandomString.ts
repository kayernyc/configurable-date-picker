const stringCandidates = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_';

/**
 * @param length
 */
export function RandomString(length = 10): string {
  let rando = ''

  while (rando.length < length) {
    const index = Math.floor(Math.random() * stringCandidates.length)
    rando += stringCandidates[index]
  }

  return rando;
}
