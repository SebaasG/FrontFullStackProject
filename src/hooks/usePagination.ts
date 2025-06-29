import { useState, useMemo } from 'react';

export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  startIndex: number;
  endIndex: number;
  goToNext: () => void;
  goToPrev: () => void;
  goToFirst: () => void;
  goToLast: () => void;
}

export const usePagination = (
  totalItems: number, 
  itemsPerPage: number = 10
): PaginationResult => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    return {
      totalPages,
      hasNext,
      hasPrev,
      startIndex,
      endIndex,
    };
  }, [totalItems, itemsPerPage, currentPage]);

  const goToNext = () => {
    if (paginationData.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (paginationData.hasPrev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(paginationData.totalPages);

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    goToNext,
    goToPrev,
    goToFirst,
    goToLast,
    ...paginationData,
  };
};