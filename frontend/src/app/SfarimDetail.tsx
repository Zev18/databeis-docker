import UserAvatar from "@/components/UserAvatar";
import { capitalize } from "@/lib/utils";
import {
  Blend,
  BookCopy,
  Check,
  ChevronRight,
  FileDigit,
  Group,
  Languages,
  LibraryBig,
  User,
  X,
} from "lucide-react";
import { useEffect } from "react";

const iconSize = 16;

export default function SfarimDetail({
  sefer,
}: {
  sefer: Record<string, any> | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        <div className="flex max-w-min items-center gap-2 rounded bg-secondary p-2">
          <FileDigit size={iconSize} />
          <p>{sefer?.ID}</p>
        </div>
        <div className="flex max-w-min items-center gap-2 rounded bg-secondary p-2">
          <p>Confirmed:</p>
          {sefer?.confirmed ? (
            <Check size={iconSize} className="text-green-500" />
          ) : (
            <X size={iconSize} className="text-red-500" />
          )}
        </div>
      </div>
      {sefer?.shelf && (
        <div className="flex items-center gap-2">
          <LibraryBig size={iconSize} className="min-w-max" />
          <p className="font-bold">Shelf:</p>
          <p>{sefer.shelfSection ? sefer.shelfSection : sefer.shelf}</p>
        </div>
      )}
      {sefer?.hebrewTitle && (
        <div className="flex items-center gap-2">
          <p className="font-bold">Hebrew Title:</p>
          <p>{sefer.hebrewTitle}</p>
        </div>
      )}
      {sefer?.author && (
        <div className="flex items-center gap-2">
          <User size={iconSize} className="min-w-max" />
          <p className="font-bold">Author:</p>
          <p>{capitalize(sefer.author)}</p>
        </div>
      )}
      {sefer?.publisherType && (
        <div className="flex items-center gap-2">
          <BookCopy size={iconSize} className="min-w-max" />
          <p className="font-bold">Publisher/Type:</p>
          <p>{sefer.publisherType}</p>
        </div>
      )}
      {sefer?.masechetSection && (
        <div className="flex items-center gap-2">
          <p className="font-bold">Masechet/Section:</p>
          <p>{sefer.masechetSection}</p>
        </div>
      )}
      {sefer?.volume && (
        <div className="flex items-center gap-2">
          <p className="font-bold">Volume:</p>
          <p>{sefer.volume}</p>
        </div>
      )}
      {sefer?.category && (
        <div className="inline [&>*]:inline [&>*]:break-words [&>*]:pr-2 [&>*]:align-middle">
          <Group size={iconSize} className="min-w-max" />
          <p className="font-bold">Category:</p>
          <p>{capitalize(sefer.category.name)}</p>
          {sefer.subcategory && (
            <>
              <ChevronRight size={iconSize} className="min-w-max" />
              <p>{capitalize(sefer.subcategory.name)}</p>
            </>
          )}
          {sefer.subsubcategory && (
            <>
              <ChevronRight size={iconSize} className="min-w-max" />
              <p>{capitalize(sefer.subsubcategory.name)}</p>
            </>
          )}
        </div>
      )}
      {(sefer?.crosslist || sefer?.crosslist2) && (
        <div className="flex items-center gap-2">
          <Blend size={iconSize} className="min-w-max" />
          <p className="font-bold">Crosslist:</p>
          {sefer.crosslist && <p>{capitalize(sefer.crosslist)}</p>}
          {sefer.crosslist && sefer.crosslist2 && <p> - </p>}
          {sefer.crosslist2 && <p>{capitalize(sefer.crosslist2)}</p>}
        </div>
      )}
      {sefer?.language && (
        <div className="flex items-center gap-2">
          <Languages size={iconSize} className="min-w-max" />
          <p className="font-bold">Language:</p>
          <p>{getLanguages(sefer.language)}</p>
        </div>
      )}
      {sefer?.users && sefer?.users.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-bold">Bookmarked By:</p>
          {sefer?.users.map((user: Record<string, any>, index: number) => (
            <div
              key={index}
              className="flex items-center gap-3 text-foreground/60"
            >
              <UserAvatar user={user} size="xs" />
              <p>{capitalize(user.name)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const getLanguages = (languages: string): string => {
  const l: string[] = [];
  let finalString = "";
  if (languages.includes("english")) {
    l.push("English");
  }
  if (languages.includes("hebrew")) {
    l.push("Hebrew");
  }
  if (languages.includes("aramaic")) {
    l.push("Aramaic");
  }
  l.forEach((lang, i) => {
    finalString += lang;
    if (i < l.length - 1) {
      finalString += ", ";
    }
  });
  return finalString;
};
