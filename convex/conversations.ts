import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const createConversation=mutation({
    args:{
        participants: v.array(v.id("users")),
		isGroup: v.boolean(),
		groupName: v.optional(v.string()),
		groupImage: v.optional(v.id("_storage")), // explain later
		admin: v.optional(v.id("users")),
    },
    handler:async (ctx,args)=>{
        const identity=await ctx.auth.getUserIdentity();
        if(!identity) throw new ConvexError("No conversation exist");
        
        
        //jane and john have conversation
        // participation array look like [jane,john]
        // if participation array is [john,jane] it wwont be checked
        const existingConversation=await ctx.db.query("conversations") 
        .filter((q)=>
        q.or(
            q.eq(q.field("participants"),args.participants),
            q.eq(q.field("participants"),args.participants.reverse())
        )).first();
        if(existingConversation) return existingConversation._id;
        let groupImage;
        if(args.groupImage){
            // todo upload image later!
        }
        const conversationId=await ctx.db.insert("conversations",{
            participants:args.participants,
            isGroup:args.isGroup,
            groupImage,
            groupName:args.groupName,
            admin:args.admin,
        })
        return conversationId;
    }
})
export const generateUploadUrl = mutation(async (ctx) => {
	return await ctx.storage.generateUploadUrl();
});