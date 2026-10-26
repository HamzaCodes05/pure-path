import { forwardRef, useState, type ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import type { ImageSourcePropType } from "react-native";

import type { Navigate, RouteName } from "../types";
import { cn } from "../utils/cn";
import { MobileFooter } from "./MobileFooter";
import { useMobileNavigation } from "./MobileNavigationContext";

type ScreenScrollProps = {
  children: ReactNode;
  className?: string;
  contentContainerClassName?: string;
};

export const ScreenScroll = forwardRef<ScrollView, ScreenScrollProps>(
  function ScreenScroll(
    { children, className, contentContainerClassName },
    ref,
  ) {
    const mobileNavigate = useMobileNavigation();

    return (
      <ScrollView
        ref={ref}
        className={cn("flex-1", className ?? "bg-pure-softBg")}
        contentContainerClassName={cn("pb-7", contentContainerClassName)}
        showsVerticalScrollIndicator={false}
      >
        {children}
        {mobileNavigate ? <MobileFooter onNavigate={mobileNavigate} /> : null}
      </ScrollView>
    );
  },
);

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "green" | "white" | "outline" | "black";
  className?: string;
};

export function PrimaryButton({
  label,
  onPress,
  variant = "green",
  className,
}: ButtonProps) {
  const isWhite = variant === "white";
  const isOutline = variant === "outline";
  const isBlack = variant === "black";
  const toneClass = isWhite
    ? "border-pure-white bg-pure-white"
    : isOutline
      ? "border-pure-green bg-transparent"
      : isBlack
        ? "border-black bg-black"
        : "border-pure-green bg-pure-green";
  const textClass =
    isWhite || isOutline ? "text-pure-green" : "text-pure-white";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        "min-h-[52px] items-center justify-center rounded-full border px-6 active:opacity-80",
        toneClass,
        className,
      )}
    >
      <Text className={cn("text-base font-extrabold", textClass)}>{label}</Text>
    </Pressable>
  );
}

type SectionProps = {
  children: ReactNode;
  tone?: "paper" | "green" | "white" | "soft";
  compact?: boolean;
};

export function Section({ children, tone = "paper", compact }: SectionProps) {
  const toneClass =
    tone === "green"
      ? "bg-pure-green"
      : tone === "white"
        ? "bg-pure-white"
        : tone === "soft"
          ? "bg-pure-softBg"
          : "bg-pure-paper";

  return (
    <View
      className={cn(
        "w-full shrink-0 gap-7 px-5 py-[46px]",
        toneClass,
        compact && "py-[34px]",
      )}
    >
      {children}
    </View>
  );
}

type SectionHeadingProps = {
  title: string;
  body?: string;
  inverse?: boolean;
  center?: boolean;
};

export function SectionHeading({
  title,
  body,
  inverse,
  center,
}: SectionHeadingProps) {
  const eyebrowColorClass = inverse ? "text-pure-goldSoft" : "text-pure-green";
  const titleColorClass = inverse ? "text-pure-white" : "text-pure-heading";
  const bodyColorClass = inverse ? "text-white/90" : "text-pure-muted";

  return (
    <View className={cn("gap-3", center && "items-center")}>
      <Text
        className={cn(
          "text-[13px] font-black uppercase leading-[18px] tracking-normal",
          eyebrowColorClass,
        )}
      ></Text>
      <Text
        className={cn(
          "font-serif text-[20px] font-bold leading-11",
          titleColorClass,
        )}
      >
        {title}
      </Text>
      {body ? (
        <Text
          className={cn(
            "text-base leading-[25px]",
            bodyColorClass,
            center && "text-center",
          )}
        >
          {body}
        </Text>
      ) : null}
    </View>
  );
}

type PageHeroProps = {
  title: string;
  body: string;
  image: ImageSourcePropType;
};

export function PageHero({ title, body, image }: PageHeroProps) {
  return (
    <ImageBackground
      source={image}
      resizeMode="cover"
      className="min-h-[220px] justify-center overflow-hidden"
    >
      <View className="absolute inset-0 bg-white/75" />
      <View className="items-center px-[22px] py-[42px]">
        <Text className="text-center font-serif text-3xl font-bold leading-[48px] text-pure-heading">
          {title}
        </Text>
        <Text className="mt-3.5 max-w-[520px] text-center text-base leading-6 text-pure-muted">
          {body}
        </Text>
      </View>
    </ImageBackground>
  );
}

type ImageCardProps = {
  image: ImageSourcePropType;
  caption?: string;
  tall?: boolean;
};

export function ImageCard({ image, caption, tall }: ImageCardProps) {
  return (
    <View className="overflow-hidden rounded-lg border-2 border-pure-gold bg-pure-green shadow-lg shadow-pure-greenDeep/20 elevation-md">
      <Image
        alt={caption ?? ""}
        source={image}
        resizeMode="cover"
        className={cn("h-[300px] w-full", tall && "h-[400px]")}
      />
      {caption ? (
        <View className="items-end border-t border-white/70 px-[18px] py-3.5">
          <Text className="font-serif text-md font-extrabold text-pure-white text-center">
            {caption}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export function Card({
  children,
  className,
  tone = "cream",
  borderTone = "line",
}: {
  children: ReactNode;
  className?: string;
  tone?: "cream" | "white" | "green";
  borderTone?: "line" | "white" | "gold";
}) {
  const toneClass =
    tone === "green"
      ? "bg-pure-green"
      : tone === "white"
        ? "bg-pure-white"
        : "bg-pure-cream";
  const borderClass =
    borderTone === "gold"
      ? "border-[#d99a32]"
      : borderTone === "white"
        ? "border-pure-white"
        : "border-[#d9e3df]";

  return (
    <View
      className={cn(
        "rounded-lg border p-5 shadow-lg shadow-pure-greenDeep/20 elevation-md",
        toneClass,
        borderClass,
        className,
      )}
    >
      {children}
    </View>
  );
}

export function BulletList({
  items,
  inverse,
}: {
  items: string[];
  inverse?: boolean;
}) {
  const dotColorClass = inverse ? "bg-pure-white" : "bg-pure-gold";
  const textColorClass = inverse ? "text-pure-white" : "text-pure-ink";

  return (
    <View className="gap-3">
      {items.map((item) => (
        <View key={item} className="flex-row items-start gap-2.5">
          <View
            className={cn("mt-1.5 h-2.5 w-2.5 rounded-full", dotColorClass)}
          />
          <Text
            className={cn(
              "flex-1 text-[15px] font-bold leading-4",
              textColorClass,
            )}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function FeatureGrid({ items }: { items: string[] }) {
  return (
    <View className="gap-3">
      {items.map((item) => (
        <View
          key={item}
          className="min-h-[58px] flex-row items-center gap-3 rounded-lg border border-[#d9e3df] bg-pure-white px-4"
        >
          <View className="h-2.5 w-2.5 rounded-full bg-pure-gold" />
          <Text className="flex-1 text-base font-extrabold text-pure-ink">
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ContactSupportBlock() {
  return (
    <View className="flex-row items-center gap-3.5">
      <View className="size-16 items-center justify-center rounded-full border border-white/70">
        <Text className="text-lg font-black text-pure-white p-1">24/7</Text>
      </View>
      <View>
        <Text className="text-base font-extrabold text-pure-white">
          Need Help?
        </Text>
        <Text className="font-serif text-lg font-bold leading-5 text-pure-white">
          +92 307 5629214
        </Text>
      </View>
    </View>
  );
}

export function ScreenActionRow({
  onNavigate,
  route,
  label,
  secondaryLabel,
  secondaryRoute,
}: {
  onNavigate: Navigate;
  route: RouteName;
  label: string;
  secondaryLabel?: string;
  secondaryRoute?: RouteName;
}) {
  return (
    <View className="flex-row flex-wrap gap-3">
      <PrimaryButton label={label} onPress={() => onNavigate(route)} />
      {secondaryLabel && secondaryRoute ? (
        <PrimaryButton
          label={secondaryLabel}
          onPress={() => onNavigate(secondaryRoute)}
          variant="outline"
        />
      ) : null}
    </View>
  );
}

export function PasswordInput({ className, ...props }: TextInputProps) {
  const [show, setShow] = useState(false);

  return (
    <View className="justify-center">
      <TextInput
        {...props}
        secureTextEntry={!show}
        autoComplete="password"
        className={`${className ?? ""} pr-12`}
      />
      <Pressable
        onPress={() => setShow((s) => !s)}
        accessibilityLabel={show ? "Hide password" : "Show password"}
        hitSlop={8}
        className="absolute right-3.5"
      >
        <Ionicons name={show ? "eye-off" : "eye"} size={22} color="#7a8782" />
      </Pressable>
    </View>
  );
}
