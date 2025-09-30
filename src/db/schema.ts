import { pgTable, text, integer, serial, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  channelId: text('channel_id').notNull(),
  name: text('name').notNull(),
});

export const study = pgTable('study', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  timeSec: integer('time_sec').notNull().default(0),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});


export type StudyRow = typeof study.$inferSelect;
export type UserRow = typeof users.$inferSelect;

// Combined shape for joined result
export interface StudyWithUser {
  channelId: string;
  name: string;
  timeSec: number;
  timestamp: Date;
}
