import ChatList from "@/components/ChatList";

export default ({
  searchParams: { error },
}: {
  params: {};
  searchParams: { error: string };
}) => {
  return (
    <div>
      <ChatList />
    </div>
  );
};
