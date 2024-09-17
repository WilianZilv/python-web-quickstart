import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export function FieldError({ errors, path }: any) {
  const message = errors[path];

  const className = cn(
    "flex items-center gap-1 text-red-500 transition-all duration-500",
    message ? "opacity-100 h-full" : "opacity-0 h-0"
  );
  return (
    <div className={className}>
      <AlertCircle size={12} />
      <p className="text-xs"> {message} </p>
    </div>
  );
}
