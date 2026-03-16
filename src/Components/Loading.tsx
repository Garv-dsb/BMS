import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Loader2 className="size-8 animate-spin text-[#8c52ef]/90 dark:text-[#AAC4F5]" />
    </div>
  );
};

export default Loading;
