import LanguageIcon from "@/components/LanguageIcon";
import Unverified from "@/components/Unverified";
import { Card } from "@/components/ui/card";
import { BookCopy, LibraryBig, User } from "lucide-react";

const iconSize = 18;

export default function SeferCard({ sefer }: { sefer: Record<string, any> }) {
  return (
    <Card>
      <div className="p-3 md:p-4 flex flex-col gap-2">
        <div className="flex gap-2 items-center w-full justify-between">
          <span className="w-full inline break-words [&>*]:align-baseline">
            <Unverified confirmed={sefer.confirmed} />
            <h2 className="text-lg break-words inline pr-2">{sefer.title}</h2>
            <p className="text-foreground/60 inline pr-2 break-words">
              {sefer.masechetSection}{" "}
              {sefer.volume && (
                <span className=" text-nowrap">{"Vol. " + sefer.volume}</span>
              )}
            </p>
          </span>
          <LanguageIcon languages={sefer.language} />
        </div>
        {sefer.hebrewTitle && <p>{sefer.hebrewTitle}</p>}
        <div className="flex gap-4 items-center text-sm text-foreground flex-wrap">
          {sefer.shelf && (
            <div className="flex gap-2 items-center">
              <LibraryBig size={iconSize} />{" "}
              <p className="text-foreground/60">
                {sefer.shelfSection ? sefer.shelfSection : sefer.shelf}
              </p>
            </div>
          )}
          {sefer.author && (
            <div className="flex gap-2 items-center">
              <User size={iconSize} />{" "}
              <p className="text-foreground/60">{sefer.author}</p>
            </div>
          )}
          {sefer.publisherType && (
            <div className="flex gap-2 items-center">
              <BookCopy size={iconSize} />{" "}
              <p className="text-foreground/60">{sefer.publisherType}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
