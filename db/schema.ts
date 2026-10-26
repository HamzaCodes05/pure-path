import {
  boolean,
  decimal,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  })
    .notNull()
    .unique(),

  username: varchar("username", {
    length: 255,
  })
    .notNull()
    .unique(),

  password: varchar("password", {
    length: 255,
  }).notNull(),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const refreshTokens = mysqlTable("refresh_tokens", {
  id: int("id").primaryKey().autoincrement(),

  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // SHA-256 of the raw token, so a database leak cannot be replayed.
  tokenHash: varchar("token_hash", {
    length: 64,
  })
    .notNull()
    .unique(),

  expiresAt: timestamp("expires_at").notNull(),

  revokedAt: timestamp("revoked_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hotels = mysqlTable("hotels", {
  id: int("id").primaryKey().autoincrement(),
  link: varchar("link", {
    length: 2048,
  }),
  city: varchar("city", {
    length: 32,
  }).notNull(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  nearestLandmark: varchar("nearest_landmark", {
    length: 128,
  }).notNull(),

  distanceMeters: int("distance_meters").notNull(),

  rating: varchar("rating", {
    length: 16,
  }).notNull(),

  reviewCount: int("review_count").default(0).notNull(),

  reviewSummary: varchar("review_summary", {
    length: 255,
  }).notNull(),

  priceFrom: varchar("price_from", {
    length: 64,
  }),

  imageUrl: varchar("image_url", {
    length: 512,
  }),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const restaurants = mysqlTable("restaurants", {
  id: int("id").primaryKey().autoincrement(),

  link: varchar("link", {
    length: 2048,
  }),

  city: varchar("city", {
    length: 32,
  }).notNull(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  category: varchar("category", {
    length: 100,
  }).notNull(),

  nearestLandmark: varchar("nearest_landmark", {
    length: 128,
  }).notNull(),

  distanceMeters: int("distance_meters").notNull(),

  address: varchar("address", {
    length: 255,
  }).notNull(),

  rating: decimal("rating", {
    precision: 2,
    scale: 1,
  }).notNull(),

  reviewSummary: varchar("review_summary", {
    length: 255,
  }).notNull(),

  reviewCount: int("review_count").default(0).notNull(),

  imageUrl: varchar("image_url", {
    length: 512,
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const flights = mysqlTable("flights", {
  id: int("id").primaryKey().autoincrement(),

  airline: varchar("airline", {
    length: 100,
  }).notNull(),

  departureCity: varchar("departure_city", {
    length: 100,
  }).notNull(),

  arrivalCity: varchar("arrival_city", {
    length: 100,
  }).notNull(),

  departureTime: timestamp("departure_time").notNull(),

  arrivalTime: timestamp("arrival_time").notNull(),

  fare: decimal("fare", {
    precision: 10,
    scale: 2,
  }).notNull(),

  seatsAvailable: int("seats_available").default(0).notNull(),

  rating: decimal("rating", {
    precision: 2,
    scale: 1,
  }).notNull(),

  bookingLink: varchar("booking_link", {
    length: 2048,
  }).notNull(),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const apartments = mysqlTable("apartments", {
  id: int("id").primaryKey().autoincrement(),
  link: varchar("link", {
    length: 2048,
  }),
  city: varchar("city", {
    length: 32,
  }).notNull(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  nearestLandmark: varchar("nearest_landmark", {
    length: 128,
  }).notNull(),

  distanceMeters: int("distance_meters").notNull(),

  rating: varchar("rating", {
    length: 16,
  }).notNull(),

  reviewCount: int("review_count").default(0).notNull(),

  reviewSummary: varchar("review_summary", {
    length: 255,
  }).notNull(),

  priceFrom: varchar("price_from", {
    length: 64,
  }),

  imageUrl: varchar("image_url", {
    length: 512,
  }),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
