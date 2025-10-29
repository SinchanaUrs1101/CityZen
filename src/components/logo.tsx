import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2 text-lg font-bold tracking-tight", className)} {...props}>
       <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-primary"
      >
        <path d="M12 22a2 2 0 0 0 2-2v-3h-4v3a2 2 0 0 0 2 2Z" />
        <path d="M12 15a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2Z" />
        <path d="M14 8V6a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v2" />
        <path d="M18 12h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1" />
        <path d="m6 12-1 1-1-1" />
        <path d="m5 12-1-1 1-1" />
        <path d M="6,12H5a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2h1" />
      </svg>
      <span className="font-headline">CityZen</span>
    </div>
  );
}
