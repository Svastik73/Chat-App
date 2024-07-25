
// THIS CODE IS REGARDING TO MEDIA UPLOAD ICON IN CHAT BAR

import { useEffect, useRef, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Folder, ImageIcon, Plus, Video } from "lucide-react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";

const MediaDropDown=()=>{
    const imageInput=useRef<HTMLInputElement>(null);
    const videoInput=useRef<HTMLInputElement>(null);
    const [selectedImage,setSelectedImage]=useState<File | null>(null);
    const [selectedVideo,setSelectedVideo]=useState<File|null>(null);

    const [isLoading,setIsLoading]=useState(false);
     const  generateUploadUrl=useMutation(api.conversations.generateUploadUrl);
	 
	 const sendImage=useMutation(api.messages.sendImage);//send image to database
	 const sendVideo=useMutation(api.messages.sendVideo);//send image to database
	
	 const me=useQuery(api.users.getMe);

	 const {selectedConversation}=useConversationStore();
	
	 // create shortlived upload url
    const 	handleSendImage=async()=>{
		setIsLoading(true);
		try{
			// STEP 1 CREATE ASHORT LVIED URL
			const postUrl=await generateUploadUrl();
			//post file to url
			const result =await fetch(postUrl,{
				method:"POST",
				headers:{"Content-Type":selectedImage!.type},
				body:selectedImage
			})
            const {storageId}=await result.json();
			// step 3 save new storage id to databse
           
			 await sendImage({
                 conversation:selectedConversation!._id,
				 imgId: storageId,
				 sender:me!._id
			 })

     setSelectedImage(null);// close dialog

		}catch(err){
			toast.error("Failed to send image");
		}
		finally{
			setIsLoading(false);
		}
	}

   const handleSendVideo=async()=>{
	setIsLoading(true);   
	try {
              const postUrl=await generateUploadUrl();
			  const result =await fetch(postUrl,{
				method:"POST",
				headers:{'Content-Type':selectedVideo!.type},
				body:selectedVideo
			  })
			  const {storageId} =await result.json();
			  await sendVideo({
				videoId:storageId,
				conversation:selectedConversation!._id,
				sender:me!._id
			  })
			  setSelectedVideo(null);
		}
		catch(error){

		}
		finally{
			setIsLoading(false);
		}

   }

    return (
       <>
          <input
             type="file"
             ref={imageInput}
             accept='image/'
             onChange={(e)=>setSelectedImage(e.target.files![0])}
             hidden
          />
          
        
          <input    type="file"
             ref={videoInput}
             accept='video/mp4'
             onChange={(e)=>setSelectedVideo(e.target.files![0])}
             hidden/>
      

      {selectedImage && (
				<MediaImageDialog
					isOpen={selectedImage !== null}
					onClose={() => setSelectedImage(null)}
					selectedImage={selectedImage}
					isLoading={isLoading}
				    handleSendImage={handleSendImage}
				/>
			)}

{selectedVideo && (
				<MediaVideoDialog
					isOpen={selectedVideo !== null}
					onClose={() => setSelectedVideo(null)}
					selectedVideo={selectedVideo}
					isLoading={isLoading}
					handleSendVideo={handleSendVideo}
				/>
			)}


       
       <DropdownMenu> {/*get from shadcn */}
				<DropdownMenuTrigger>
					<Plus className='text-gray-600 dark:text-gray-400' />
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => imageInput.current!.click()}>
						<ImageIcon size={18} className='mr-1' /> Photo
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => videoInput.current!.click()}>
						<Video size={20} className='mr-1' />
						Video
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Folder size={20} className='mr-1' /> File
						{/* ADD FILE UPLOAD FEATURE TOO! */}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>






       </>  
    )
}
export default MediaDropDown;

// below functionality to add image 

type MediaImageDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedImage: File;
	isLoading: boolean;
	handleSendImage: () => void;
};

const MediaImageDialog = ({ isOpen, onClose, selectedImage, isLoading ,handleSendImage}: MediaImageDialogProps) => {
	const [renderedImage, setRenderedImage] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedImage) return;
		const reader = new FileReader();
		reader.onload = (e) => setRenderedImage(e.target?.result as string);
		reader.readAsDataURL(selectedImage);
	}, [selectedImage]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent>
				<DialogDescription className='flex flex-col gap-10 justify-center items-center'>
					{renderedImage && <Image src={renderedImage} width={300} height={300} alt='selected image' />}
					<Button className='w-full' disabled={isLoading} 
					  onClick={handleSendImage} >
						{isLoading ? "Sending..." : "Send"}
					</Button>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};


type MediaVideoDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedVideo: File;
	isLoading: boolean;
	handleSendVideo: () => void;
};

const MediaVideoDialog = ({ isOpen, onClose, selectedVideo, isLoading ,handleSendVideo}: MediaVideoDialogProps) => {
	const renderedVideo = URL.createObjectURL(new Blob([selectedVideo], { type: "video/mp4" }));

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent>
				<DialogDescription>Video</DialogDescription>
				<div className='w-full'>
				{renderedVideo && <ReactPlayer url={renderedVideo} controls width='100%' />}  
				</div>
				<Button className='w-full' disabled={isLoading}  onClick={handleSendVideo}>
					{isLoading ? "Sending..." : "Send" }
				</Button>
			</DialogContent>
		</Dialog>
	);
};
