import { auth } from "@/auth"
import { NotificationBell } from "./Bell";
import { getNotifications } from "@/actions/notifications";

export async function NotificationBellWrapper() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null
  }

  const notifications = await getNotifications(session.user.id)

  return <NotificationBell userId={session.user.id} initialNotifications={notifications} />
}

