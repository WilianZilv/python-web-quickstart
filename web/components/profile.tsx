import { ChevronDown, Tag, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { getUserData, signOut } from "@/lib/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExitIcon } from "@radix-ui/react-icons";

export default function Profile({ username }: { username: string }) {
  const router = useRouter();
  const user = getUserData();

  const goToMyTodos = () => {
    router.push("/todos/" + username);
  };

  if (!user?.username) {
    return (
      <div>
        <Link href="/sign_in">
          <Button>
            <User className="h-4 w-4 mr-2" />
            <span>Sign in</span>
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = user.username === username;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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
            <Button size={"sm"} variant="ghost">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {!isOwner ? (
            <DropdownMenuItem onClick={goToMyTodos}>
              <Tag className="h-4 w-4 mr-2" />
              <span>My todos</span>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onClick={signOut}>
            <ExitIcon className="h-4 w-4 mr-2" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
