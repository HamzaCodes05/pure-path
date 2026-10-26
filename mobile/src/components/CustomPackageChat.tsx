import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { API_BASE_URL } from "../config";
import { cn } from "../utils/cn";
import { FormattedText } from "./FormattedText";

type Message = { role: "user" | "assistant"; content: string };

const welcome: Message = {
  role: "assistant",
  content:
    "Assalamu alaikum. Tell me about your trip and I will build a custom package for you. Is this for Hajj or Umrah, and when are you hoping to travel?",
};

const quickStarts = [
  "10-day Umrah for 4 people",
  "Budget Hajj package for a couple",
  "Senior-friendly Umrah near Haram",
];

export function CustomPackageChat() {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function send(text = input) {
    const content = text.trim();
    if (!content || isSending) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setIsSending(true);

    let reply: string;
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "custom-package", messages: next }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message);
      reply = data.reply;
    } catch (error) {
      reply =
        error instanceof Error && error.message
          ? error.message
          : "The assistant is unavailable right now.";
    }
    setMessages((current) => [...current, { role: "assistant", content: reply }]);
    setIsSending(false);
  }

  return (
    <View className="overflow-hidden rounded-2xl border border-[#cfdcd6] bg-pure-white">
      <View className="flex-row items-center gap-3 border-b border-[#d9e3df] px-4 py-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-pure-green">
          <Text className="text-lg font-black text-pure-white">P</Text>
        </View>
        <View>
          <Text className="text-base font-black text-pure-ink">
            Pure Path Assist
          </Text>
          <Text className="text-xs text-pure-muted">Package designer</Text>
        </View>
      </View>

      <View className="gap-3 bg-[#f4f8f6] p-3.5">
        {messages.map((m, i) => (
          <View
            key={i}
            className={cn(
              "max-w-[92%] rounded-2xl px-3.5 py-3",
              m.role === "user"
                ? "self-end rounded-br-sm bg-pure-green"
                : "self-start rounded-bl-sm border border-[#d9e3df] bg-pure-white",
            )}
          >
            <Text
              className={cn(
                "text-[15px] leading-[22px]",
                m.role === "user" ? "text-pure-white" : "text-pure-ink",
              )}
            >
              <FormattedText text={m.content} />
            </Text>
          </View>
        ))}
        {isSending ? (
          <Text className="text-sm font-bold text-pure-muted">
            Designing your package...
          </Text>
        ) : null}
      </View>

      {messages.length === 1 ? (
        <View className="flex-row flex-wrap gap-2 px-3.5 pt-3.5">
          {quickStarts.map((q) => (
            <Pressable
              key={q}
              onPress={() => send(q)}
              className="rounded-full border border-[#d9e3df] bg-[#f8fbfb] px-3.5 py-2 active:opacity-70"
            >
              <Text className="text-sm font-bold text-pure-ink">{q}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View className="gap-3 p-3.5">
        <TextInput
          value={input}
          onChangeText={setInput}
          maxLength={1200}
          multiline
          placeholder="e.g. 10-day Umrah for 4 people in March"
          className="min-h-[52px] rounded-2xl border border-[#cfd9d5] bg-pure-white px-4 py-3 text-base text-pure-ink placeholder:text-[#7a8782]"
        />
        <Pressable
          onPress={() => send()}
          disabled={!input.trim() || isSending}
          className={cn(
            "min-h-[48px] items-center justify-center rounded-full bg-pure-green active:opacity-80",
            (!input.trim() || isSending) && "opacity-50",
          )}
        >
          <Text className="text-base font-extrabold text-pure-white">Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
