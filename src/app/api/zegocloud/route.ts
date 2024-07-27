import { generateToken04 } from "./zegoServerAssistant";

export async function GET(req:Request){
    const url=new URL(req.url);
    const userID=url.searchParams.get("userID")!;
    const appID= +process.env.NEXT_PUBLIC_ZEGO_APP_ID!;
// + is used to convert it to string
    const serverSecret=process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
// we r storign server secret in backend!
    const effectiveTimeInSeconds=3600;
    const payload="";
    const token=generateToken04(appID,userID,serverSecret,effectiveTimeInSeconds,payload);
    return Response.json({token,appID});
}