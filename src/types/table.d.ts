export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
  type?: 'text' | 'number' | 'date' | 'custom';
}

export interface TableAction<T = any> {
  label: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'info'
    | 'error'
    | 'ghost';
  className?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startItem: number;
  endItem: number;
}

export interface DataTableProps<T = any> {
  data: T[];
  title?: string;
  subTitle?: string;
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  pagination?: boolean | PaginationInfo;
  itemsPerPage?: number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onSelectionChange?: (selectedRows: T[]) => void;
}

export interface OrderData {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  status: 'Processing' | 'Success' | 'Failed' | 'Pending';
  amount: number;
  orderDate: string;
  orderTime: string;
}
