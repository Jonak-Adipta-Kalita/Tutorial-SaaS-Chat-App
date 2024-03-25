import { Dispatch, SetStateAction } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  chatId: string;
};

const ShareLink = ({ isOpen, setIsOpen, chatId }: Props) => {
  return <div></div>;
};

export default ShareLink;
