export const toSentenceCase = (value) => {
    if (typeof value !== "string") return value;

    const minorWords = ["and", "the", "of", "in", "on", "with", "at", "by", "for", "from", "to", "but", "or", "nor", "as"];

    return value
        .toLowerCase()
        .split(" ")
        .map((word, index, words) => {
            // Capitalize the word if it's the first/last word or not a minor word
            if (index === 0 || index === words.length - 1 || !minorWords.includes(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        })
        .join(" ");
};