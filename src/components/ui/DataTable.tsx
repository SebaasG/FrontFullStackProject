import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import LoadingSpinner from './LoadingSpinner';
import { listVariants, listItemVariants } from '../../animations/pageTransitions';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
}

function DataTable<T extends { id: number | string }>({
  data,
  columns,
  loading = false,
  pagination,
  onPageChange,
  onSort,
  searchable = false,
  searchValue = '',
  onSearchChange,
  actions,
  emptyMessage = 'No hay datos disponibles',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && onSearchChange && (
        <div className="flex justify-between items-center">
          <Input
            placeholder="Buscar..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            variant="glass"
            className="max-w-md"
          />
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-4 text-left text-sm font-medium text-white/90 ${
                      column.width || ''
                    }`}
                  >
                    {column.sortable && onSort ? (
                      <button
                        onClick={() => onSort(column.key, 'asc')}
                        className="hover:text-primary-electric transition-colors"
                      >
                        {column.label}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
                {actions && (
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/90">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <motion.tr variants={listVariants} initial="hidden" animate="visible">
                {data.length === 0 ? (
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-12 text-center text-white/60"
                  >
                    {emptyMessage}
                  </td>
                ) : (
                  data.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      variants={listItemVariants}
                      className="hover:bg-white/5 transition-colors"
                    >
                      {columns.map((column) => (
                        <td
                          key={String(column.key)}
                          className="px-6 py-4 text-sm text-white"
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : String(row[column.key] || '')}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            {actions(row)}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </motion.tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-sm text-white/60">
              Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de{' '}
              {pagination.totalItems} resultados
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange?.(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-white px-3 py-1">
                {pagination.currentPage} de {pagination.totalPages}
              </span>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange?.(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;