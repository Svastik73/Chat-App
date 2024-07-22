import { HeartIcon, Lock } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
// This just displays whatsapp download logo etc
const ChatPlaceHolder = () => {
	return (
		<div className='w-3/4 bg-gray-secondary flex flex-col items-center justify-center py-10'>
			<div className='flex flex-col items-center w-full justify-center py-10 gap-4'>
				<Image src={"/desktop-hero.png"} alt='Hero' width={320} height={188} />
				<p className='text-3xl font-extralight mt-5 mb-2'>Download Sonnet for Windows</p>
				<p className='w-1/2 text-center text-gray-primary text-sm text-muted-foreground'>
					Make calls, share your screen and get a faster experience with Sonnet.
				</p>

				<Button className='rounded-full my-5 bg-green-primary hover:bg-green-secondary'>
					Get from Microsoft Store
				</Button>
				
			</div>
			
			<p className='w-1/2 mt-auto text-center text-gray-primary text-xs text-muted-foreground flex items-center justify-center gap-1'>
				<Lock size={10} /> Your personal messages are end-to-end encrypted and unaccesible by any 3rd party 
			</p>
		</div>
	);
};
export default ChatPlaceHolder;