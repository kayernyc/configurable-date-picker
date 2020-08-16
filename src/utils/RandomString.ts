const stringCanidates = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_";

export function RandomString(length = 10): string {
  let rando = ''

  while (rando.length < length) {
    const index = Math.floor(Math.random() * stringCanidates.length)
    rando += stringCanidates[index]
  }

  return rando;
}
