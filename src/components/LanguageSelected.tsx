"use client";

import {
  LanguagesSupportedMap,
  useLanguageStore,
  useSubscriptionStore,
} from "@/lib/store";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";

type Props = {};

const LanguageSelected = (props: Props) => {
  const { language, setLanguage, getLanguages, getNotSupportedLanguages } =
    useLanguageStore();

  const { subscription } = useSubscriptionStore();
  const isPro =
    subscription?.role === "pro" && subscription?.status === "active";

  const pathName = usePathname();
  const isChatPage = pathName.includes("/chat");

  return (
    isChatPage && (
      <Select>
        <SelectTrigger className="w-[150px] text-black dark:text-white">
          <SelectValue
            className=""
            placeholder={LanguagesSupportedMap[language]}
          />
        </SelectTrigger>
        <SelectContent>
          {subscription === undefined ? (
            <LoadingSpinner />
          ) : (
            <>
              {getLanguages(isPro).map((language) => (
                <SelectItem key={language} value={language}>
                  {LanguagesSupportedMap[language]}
                </SelectItem>
              ))}
              {getNotSupportedLanguages(isPro).map((language) => (
                <Link href={"/register"} key={language} prefetch={false}>
                  <SelectItem
                    key={language}
                    value={language}
                    disabled
                    className="bg-gray-300/50 text-gray-500 dark:text-white py-2 mt-1"
                  >
                    {LanguagesSupportedMap[language]} (PRO)
                  </SelectItem>
                </Link>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    )
  );
};

export default LanguageSelected;
