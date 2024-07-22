"use client"
import { ListFilter, LogOut, MessageSquareDiff, Search, User } from "lucide-react";
import { Input } from "../ui/input";
import ThemeSwitch from "./theme-switch";
import Conversation from "./conversations";

import { Key } from "react";

import { UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignIn, SignOutButton } from "@clerk/clerk-react";
import UserListDialog from "./user-list-dialog";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const LeftPanel = () => {
	const {isAuthenticated}=useConvexAuth();
	const  conversations=useQuery(api.conversations.getMyConversations,isAuthenticated?undefined:"skip"); 
	// isAuthenticated is used to give authentication time to do its work else it will trhow eror
	// hence dont update screen until it is uthenticated
	console.log(conversations);
	return (
		<div className='w-1/4 border-gray-600 border-r'>
			<div className='sticky top-0 bg-left-panel z-10'>
				{/* Header */}
				<div className='flex justify-between bg-gray-primary p-3 items-center'>
					<UserButton/> {/*import from clerk user*/}
<SignedIn><SignOutButton></SignOutButton></SignedIn>  {/* we get these from clerk*/}
<SignedOut><SignIn></SignIn></SignedOut> {/*If signed out show sign in*/}
					<div className='flex items-center gap-3'>
						{isAuthenticated && <UserListDialog/> }
											<ThemeSwitch />
						<LogOut size={20} className='cursor-pointer' />
					</div>
				</div>
				<div className='p-3 flex items-center'>
					{/* Search */}
					<div className='relative h-10 mx-3 flex-1'>
						<Search
							className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 Poppins'
							size={18}
							fontFamily="Poppins"
							color="green"
						/>
						<Input
							type='text'
							placeholder='Search or start a new chat'
							className='pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent'
						/>
					</div>
					<ListFilter className='cursor-pointer' />
				</div>
			</div>

			{/* Chat List */}
			<div className='my-3 flex flex-col gap-0 max-h-[80%] overflow-auto'>
				{/* Conversations will go here*/}
				{conversations?.map((conversation) => (
					<Conversation key={conversation._id} conversation={conversation}  />
				))}

				{conversations?.length === 0 && (
					<>
						<p className='text-center text-gray-500 text-sm mt-3'>No conversations yet</p>
						<p className='text-center text-gray-500 text-sm mt-3 '>
							Lets start to chat!
						</p>
					</>
				)}
			</div>
		</div>
	);
};
export default LeftPanel;