const consonants = "bcdfghjklmnpqrstvwxyzbpcrtpcrddrtplmnplmnbbcbcdrbnmklhgd";
const vowels = "aeiou";

export function createWord(length = 6) {
  return Array.from({ length }, (_, i) => i % 2 
    ? vowels[Math.floor(Math.random() * vowels.length)]
    : consonants[Math.floor(Math.random() * consonants.length)]
  ).join('');
}