export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
  type?: 'text' | 'number' | 'date' | 'custom';
}

export interface TableAction<T = Record<string, unknown>> {
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
  onClick?: (row: T) => void;
  icon?: React.ReactNode;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startItem: number;
  endItem: number;
}

export interface AddButtonConfig {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'ghost';
  className?: string;
  icon?: React.ReactNode;
}

export interface DataTableProps<T = Record<string, unknown>> {
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
  addButton?: AddButtonConfig | (() => React.ReactNode);
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
