import LanguageIcon from "@/components/LanguageIcon";
import Unverified from "@/components/Unverified";
import { Card } from "@/components/ui/card";
import { capitalize } from "@/lib/utils";
import {
  Blend,
  BookCopy,
  ChevronRight,
  Group,
  LibraryBig,
  User,
} from "lucide-react";

const iconSize = 18;

export default function SeferCard({ sefer }: { sefer: Record<string, any> }) {
  return (
    <Card className="z-10 overflow-hidden">
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 p-3 md:p-4">
          <div className="flex w-full items-center justify-between gap-2">
            <span className="inline w-full break-words [&>*]:align-baseline">
              <Unverified confirmed={sefer.confirmed} />
              <h2 className="inline break-words pr-2 text-lg">{sefer.title}</h2>
              <p className="inline break-words pr-2 text-foreground/60">
                {sefer.masechetSection}{" "}
                {sefer.volume && (
                  <span className=" text-nowrap">{"Vol. " + sefer.volume}</span>
                )}
              </p>
            </span>
            <LanguageIcon languages={sefer.language} />
          </div>
          {sefer.hebrewTitle && <p>{sefer.hebrewTitle}</p>}
          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground">
            {sefer.shelf && (
              <div className="flex items-center gap-2">
                <LibraryBig size={iconSize} />{" "}
                <p className="text-foreground/60">
                  {sefer.shelfSection ? sefer.shelfSection : sefer.shelf}
                </p>
              </div>
            )}
            {sefer.author && (
              <div className="flex items-center gap-2">
                <User size={iconSize} />{" "}
                <p className="text-foreground/60">{sefer.author}</p>
              </div>
            )}
            {sefer.publisherType && (
              <div className="flex items-center gap-2">
                <BookCopy size={iconSize} />{" "}
                <p className="text-foreground/60">{sefer.publisherType}</p>
              </div>
            )}
          </div>
        </div>
        {(sefer.category || sefer.crosslist || sefer.crosslist2) && (
          <div className="z-0 flex flex-col gap-2 bg-secondary p-2">
            {sefer.category && (
              <div className="inline text-sm [&>*]:inline [&>*]:break-words [&>*]:pr-2 [&>*]:align-middle">
                <Group size={iconSize} className="min-w-max" />
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
            {(sefer.crosslist || sefer.crosslist2) && (
              <div className="flex items-center gap-1 text-sm">
                <Blend />
                {sefer.crosslist && <p>{capitalize(sefer.crosslist)}</p>}
                {sefer.crosslist && sefer.crosslist2 && <p> - </p>}
                {sefer.crosslist2 && <p>{capitalize(sefer.crosslist2)}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
