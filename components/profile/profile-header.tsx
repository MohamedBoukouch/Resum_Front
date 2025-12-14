import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ProfileHeaderProps {
  name: string
  email: string
}

export function ProfileHeader({ name, email }: ProfileHeaderProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16 bg-primary">
        <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
          {initials || "U"}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold text-foreground">{name || "User Profile"}</h2>
        <p className="text-muted-foreground">{email}</p>
      </div>
    </div>
  )
}
