import { useState, useEffect } from "react";

function useTypingEffect(text: string, wordDelay = 250) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let isActive = true;
    const words = text.split(' ').filter(word => word.length > 0);
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let localDisplayText = '';
    let timeoutId: NodeJS.Timeout;

    const processNextCharacter = () => {
      if (!isActive) return;

      const currentWord = words[currentWordIndex];
      if (!currentWord) return;

      const charDelay = wordDelay / currentWord.length;

      if (currentCharIndex < currentWord.length) {
        localDisplayText += currentWord[currentCharIndex];
        setDisplayText(localDisplayText);
        currentCharIndex++;
        timeoutId = setTimeout(processNextCharacter, charDelay);
      } else {
        if (currentWordIndex < words.length - 1) {
          localDisplayText += ' ';
          setDisplayText(localDisplayText);
        }
        currentWordIndex++;
        currentCharIndex = 0;
        if (currentWordIndex < words.length) {
          timeoutId = setTimeout(processNextCharacter, 0);
        }
      }
    };

    // Reset display text
    localDisplayText = '';
    setDisplayText(localDisplayText);

    if (words.length > 0) {
      processNextCharacter();
    }

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [text, wordDelay]);

  return displayText;
}

export default useTypingEffect;