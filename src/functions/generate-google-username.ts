import { generate } from "random-words";

export default function generateRandomUsername(): string {
  const word1 = generate(1);
  const word2 = generate(1);
  const randomNumber = Math.floor(Math.random() * 100);

  return `${word1}-${word2}${randomNumber}`;
}

