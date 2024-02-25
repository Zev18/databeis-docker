import { cn, setUrlPage } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { ReadonlyURLSearchParams } from "next/navigation";

export default function SfarimPagination({
  pagination,
  params,
  className,
}: {
  pagination: Record<string, any>;
  params: ReadonlyURLSearchParams;
  className?: string;
}) {
  const visiblePages = range(pagination);

  return (
    <Pagination className={className}>
      <PaginationContent>
        {pagination.currentPage != 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={setUrlPage(params, pagination.prevPage)}
            />
          </PaginationItem>
        )}
        {visiblePages[0] > 1 && (
          <PaginationItem>
            <PaginationLink href={setUrlPage(params, 1)}>1</PaginationLink>
          </PaginationItem>
        )}
        {visiblePages[0] > 2 && <PaginationEllipsis />}
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={setUrlPage(params, page)}
              isActive={page === pagination.currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {visiblePages[visiblePages.length - 1] < pagination.totalPages && (
          <PaginationEllipsis />
        )}
        {visiblePages[visiblePages.length - 1] < pagination.totalPages && (
          <PaginationItem>
            <PaginationLink href={setUrlPage(params, pagination.totalPages)}>
              {pagination.totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        {pagination.currentPage != pagination.totalPages && (
          <PaginationItem>
            <PaginationNext href={setUrlPage(params, pagination.nextPage)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

const range = (pagination: Record<string, any>): number[] => {
  const start = Math.max(1, pagination.currentPage - 2);
  const end = Math.min(pagination.totalPages, start + 4);
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};
