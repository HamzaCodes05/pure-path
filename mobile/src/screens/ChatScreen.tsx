import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { FormattedText } from "../components/FormattedText";
import { API_BASE_URL } from "../config";
import { images } from "../data/purePath";
import { cn } from "../utils/cn";
import { Card, PageHero, ScreenScroll } from "../components/ui";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatApiResponse = {
  success: boolean;
  reply?: string;
  message?: string;
};

const starterMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Assalamu alaikum. I can help with Pure Path Hajj and Umrah packages, documents, hotels, flights, restaurants, and travel support.",
  },
];

const promptChips = [
  "What documents do I need for Umrah?",
  "Compare Hajj and Umrah packages",
  "Do you help with hotels near Haram?",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ChatScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendMessage(messageText: string) {
    const content = messageText.trim();

    if (!content || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      });

      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok || !data.success || !data.reply) {
        throw new Error(data.message ?? "Chat request failed.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createId(),
          role: "assistant",
          content: data.reply!,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The assistant is unavailable right now.";

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createId(),
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <ScreenScroll
      ref={scrollRef}
      className="bg-pure-softBg"
      contentContainerClassName="pb-0"
    >
      <PageHero
        image={images.hero}
        title="Chat"
        body="Get focused help for Hajj, Umrah, documents, hotels, flights, restaurants, and travel support."
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="px-5 py-7"
      >
        <Card tone="white" borderTone="line" className="gap-4">
          <View className="gap-2">
            {promptChips.map((prompt) => (
              <Pressable
                key={prompt}
                accessibilityRole="button"
                disabled={isSending}
                onPress={() => void sendMessage(prompt)}
                className="min-h-[46px] justify-center rounded-lg border border-[#d9e3df] bg-pure-softBg px-3.5 active:opacity-80 disabled:opacity-60"
              >
                <Text className="text-[14px] font-extrabold leading-5 text-pure-ink">
                  {prompt}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="max-h-[420px] gap-3">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <View
                  key={message.id}
                  className={cn(
                    "flex-row",
                    isUser ? "justify-end" : "justify-start",
                  )}
                >
                  <View
                    className={cn(
                      "max-w-[88%] rounded-lg px-3.5 py-2.5",
                      isUser
                        ? "bg-pure-green"
                        : "border border-[#d9e3df] bg-pure-white",
                    )}
                  >
                    <Text
                      className={cn(
                        "text-[14px] leading-6",
                        isUser ? "text-pure-white" : "text-pure-ink",
                      )}
                    >
                      <FormattedText text={message.content} />
                    </Text>
                  </View>
                </View>
              );
            })}

            {isSending ? (
              <View className="flex-row justify-start">
                <View className="rounded-lg border border-[#d9e3df] bg-pure-white px-3.5 py-2.5">
                  <Text className="text-[14px] font-bold text-pure-muted">
                    Thinking...
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          <View className="gap-3 border-t border-[#d9e3df] pt-4">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about Pure Path..."
              maxLength={1200}
              multiline
              textAlignVertical="top"
              className="min-h-[104px] rounded-lg border border-[#cfd9d5] bg-pure-softBg px-3.5 py-3 text-base leading-6 text-pure-ink placeholder:text-[#7a8782]"
            />
            <Pressable
              accessibilityRole="button"
              disabled={!input.trim() || isSending}
              onPress={() => void sendMessage(input)}
              className="min-h-[48px] items-center justify-center rounded-lg bg-pure-green px-5 active:opacity-80 disabled:bg-[#8ca69b]"
            >
              <Text className="text-base font-extrabold text-pure-white">
                {isSending ? "Sending..." : "Send"}
              </Text>
            </Pressable>
          </View>
        </Card>
      </KeyboardAvoidingView>
    </ScreenScroll>
  );
}
