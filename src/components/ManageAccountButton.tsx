import { generatePortalLink } from "@/actions/generatePortalLink";

export default () => {
  return (
    <form className="w-full px-3.5 py-2" action={generatePortalLink}>
      <button type="submit">Manage Account</button>
    </form>
  );
};
