import {ConvexError, v} from "convex/values";
import { internalMutation,query } from "./_generated/server";
export const createUser=internalMutation({
      args:{
        name:v.string(),
        email:v.string(),
        image:v.string(),
        tokenIdentifier: v.string(),
      },
      handler:async(ctx,args)=>{
       await ctx.db.insert("users",{
        name:args.name,
        email:args.email,
        image:args.image,
        tokenIdentifier: args.tokenIdentifier,
        isOnline:true,
       })
      }

});
export const updateUser=internalMutation({
    args:{tokenIdentifier: v.string(),image:v.string()},
    async handler(ctx,args){
        const user=await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier",(q)=>q.eq("tokenIdentifier",args.tokenIdentifier))
        .unique();
        if(!user) throw new ConvexError("No user found");
        await ctx.db.patch(user._id,{
            image:args.image,
        });
    },
})
export const setUserOffline=internalMutation({
   args:{tokenIdentifier:v.string()},
   handler:async (ctx,args)=>{
       const user=await ctx.db
       .query("users")  // we used indexs to find user easily!
       .withIndex("by_tokenIdentifier",q=>q.eq("tokenIdentifier",args.tokenIdentifier)) //convex syntax
        .unique();
        if(!user) throw new ConvexError("No user found");
        else await ctx.db.patch(user._id,{isOnline:false}) 
    }
});
export const setUserOnline=internalMutation({
    args:{tokenIdentifier:v.string()},
    handler:async (ctx,args)=>{
        const user=await ctx.db
        .query("users")  // we used indexs to find user easily!
        .withIndex("by_tokenIdentifier",q=>q.eq("tokenIdentifier",args.tokenIdentifier)) //convex syntax
         .unique();
         if(!user) throw new ConvexError("No user found");
         else await ctx.db.patch(user._id,{isOnline:true}) 
     }
});


export const getUsers = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const users = await ctx.db.query("users").collect();
        // return users ; this will include yourself too in group chat addition function!  
		return users.filter((user) => user.tokenIdentifier !== identity.tokenIdentifier);
	},
});
export const getMe=query({
    args:{},
    handler :async(ctx,args)=>{
        const identity=await ctx.auth.getUserIdentity();
        if(!identity) throw new ConvexError("Unauthorized");
        const user=await ctx.db.query("users")
        .withIndex("by_tokenIdentifier",(q)=>q.eq("tokenIdentifier",identity.tokenIdentifier))
        .unique();
        if(!user) throw new ConvexError("No user");
        return user;
    },
});


// todo: add group users 
