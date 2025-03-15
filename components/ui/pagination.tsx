"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { useState, useEffect } from "react"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Não renderizar se houver apenas uma página
  if (totalPages <= 1) return null

  const renderPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    // Sempre mostrar a primeira página
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink isActive={currentPage === 1} onClick={() => onPageChange(1)} aria-label={`Ir para página 1`}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Lógica para mostrar páginas intermediárias
    if (totalPages <= maxPagesToShow) {
      // Se o total de páginas for pequeno, mostrar todas
      for (let i = 2; i < totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => onPageChange(i)}
              aria-label={`Ir para página ${i}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // Caso contrário, mostrar páginas próximas à atual com elipses
      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Páginas ao redor da atual
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => onPageChange(i)}
              aria-label={`Ir para página ${i}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
    }

    // Sempre mostrar a última página
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label={`Ir para página ${totalPages}`}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return pages
  }

  return (
    <PaginationContent>
      <PaginationPrevious
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationPrevious>
      {renderPageNumbers()}
      <PaginationNext
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationNext>
    </PaginationContent>
  )
}

export const PaginationContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className="flex w-full items-center justify-center gap-2" {...props} />
  ),
)
PaginationContent.displayName = "PaginationContent"

export const PaginationItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className="" {...props} />,
)
PaginationItem.displayName = "PaginationItem"

export const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }
>(({ className, isActive, ...props }, ref) => (
  <Button ref={ref} variant={isActive ? "default" : "outline"} size="icon" {...props} />
))
PaginationLink.displayName = "PaginationLink"

export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <Button variant="outline" size="icon" disabled>
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  ),
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export const PaginationPrevious = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <Button ref={ref} variant="outline" size="icon" className="" {...props}>
      {children}
    </Button>
  ),
)
PaginationPrevious.displayName = "PaginationPrevious"

export const PaginationNext = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <Button ref={ref} variant="outline" size="icon" className="" {...props}>
      {children}
    </Button>
  ),
)
PaginationNext.displayName = "PaginationNext"

