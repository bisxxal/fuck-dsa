import ChatRoom from '@/app/(dashboard)/_components/ChatRoom';
import { authOptions } from '@/lib/auth';
import { getServerSession } from "next-auth"

export const dynamic = 'force-dynamic'; 

export default async function ChatPage({ params }: { params: { chatId: string } }) {

  const session = await getServerSession(authOptions)
  const currentUserId = session?.user.id as string
  const {chatId} =  await params;
  return <ChatRoom chatId={chatId} currentUserId={currentUserId} />;
}
