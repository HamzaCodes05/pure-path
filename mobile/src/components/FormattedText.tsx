import { Text } from "react-native";

// Minimal chat formatting: **bold**, and numbered items ("1. ", "2. ") each on their own line.
// Mirrors components/chat/FormattedText.tsx on the web. Renders nested <Text>, so it must be
// placed inside a parent <Text> that carries the base styling.
export function FormattedText({ text }: { text: string }) {
  const spaced = text.replace(/(\S)\s+(?=\d+\.\s)/g, "$1\n");

  return (
    <>
      {spaced.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <Text key={i} className="font-bold">
            {part.slice(2, -2)}
          </Text>
        ) : (
          part
        ),
      )}
    </>
  );
}
