import { ReactNode } from "react";

export default ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex-1 w-full flex flex-col max-w-4xl mx-auto">
      {children}
    </div>
  );
};
