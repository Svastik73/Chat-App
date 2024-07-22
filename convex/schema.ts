import {defineSchema, defineTable } from 'convex/server';
import {v} from 'convex/values';
export default defineSchema({
    users: defineTable({
      name:v.optional(v.string()),
      email:v.string(),
      image:v.string(),
      tokenIdentifier: v.string(),
      isOnline:v.boolean()

    }).index("by_tokenIdentifier",["tokenIdentifier"]),
// now create table for conversations
    conversations:defineTable({
       participants: v.array(v.id("users")),
       isGroup: v.boolean(),
       groupName: v.optional(v.string()), // optional becasue it can be group or single participant
       groupImage: v.optional(v.string()),
       admin: v.optional(v.id("users")),
    }),
    
    messages:defineTable({
        conversation: v.id("conversations"),
        sender: v.string(),// because later chatgpt will work too
        content:v.string(),
        messageType: v.union(v.literal("text"),v.literal("image"),v.literal("video"))

    }).index("by_conversation",["conversation"]),




  });
// we will use functions provided by convex to design backend