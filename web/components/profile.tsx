import { ChevronDown, Tag, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { signOut } from "@/lib/user";
import { useRouter } from "next/navigation";

export default function Profile({ username }: { username: string }) {

    const router = useRouter()

    const goToMyTodos = () => {
        router.push("/todos/" + username)
    }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src="/placeholder.svg?height=32&width=32"
          alt="@username"
        />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="text-left">
        <p className="text-sm font-medium">{username}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"sm"} variant="ghost">
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={goToMyTodos}>
            <Tag className="h-4 w-4 mr-2" />
            <span>My todos</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
            <User className="h-4 w-4 mr-2" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
