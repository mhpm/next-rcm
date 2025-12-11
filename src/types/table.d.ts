/**
 * Defines the configuration for a table column, including display properties and rendering behavior.
 *
 * @template T - The type of the row data object. Defaults to a generic record with string keys and unknown values.
 *
 * @example
 * ```typescript
 * // Basic text column
 * const nameColumn: TableColumn<User> = {
 *   key: 'name',
 *   label: 'Full Name',
 *   sortable: true,
 *   type: 'text'
 * };
 *
 * // Custom rendered column with formatting
 * const emailColumn: TableColumn<User> = {
 *   key: 'email',
 *   label: 'Email Address',
 *   sortable: true,
 *   render: (email, user) => (
 *     <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
 *       {email}
 *     </a>
 *   )
 * };
 *
 * // Date column with custom formatting
 * const createdAtColumn: TableColumn<User> = {
 *   key: 'createdAt',
 *   label: 'Created',
 *   type: 'date',
 *   sortable: true,
 *   render: (date) => new Date(date).toLocaleDateString()
 * };
 * ```
 */
export interface TableColumn<T = Record<string, unknown>> {
  /**
   * The property key from the row data object that this column represents.
   * Must be a valid key that exists in the row data type T.
   *
   * @example
   * ```typescript
   * // For a User interface with { id: string, name: string, email: string }
   * key: 'name' // Valid
   * key: 'email' // Valid
   * key: 'invalidKey' // TypeScript error
   * ```
   */
  key: keyof T;

  /**
   * The display text shown in the column header.
   * Should be descriptive and user-friendly.
   *
   * @example
   * ```typescript
   * label: 'Full Name'        // Good: Clear and descriptive
   * label: 'Email Address'    // Good: Specific and clear
   * label: 'name'            // Poor: Not user-friendly
   * ```
   */
  label: string;

  /**
   * Whether this column can be sorted by clicking the column header.
   * When true, the column header will display sort indicators and handle click events.
   *
   * @default false
   */
  sortable?: boolean;

  /**
   * Custom render function to control how the cell content is displayed.
   * Receives both the cell value and the complete row data for flexible rendering.
   *
   * @param value - The specific value from the row data for this column
   * @param row - The complete row data object
   * @returns React element or content to display in the cell
   *
   * @example
   * ```typescript
   * // Simple formatting
   * render: (value) => value?.toString().toUpperCase()
   *
   * // Complex component with row context
   * render: (status, user) => (
   *   <Badge
   *     variant={status === 'active' ? 'success' : 'error'}
   *     onClick={() => toggleUserStatus(user.id)}
   *   >
   *     {status}
   *   </Badge>
   * )
   *
   * // Conditional rendering
   * render: (value, row) => row.isVip ? (
   *   <span className="font-bold text-gold">{value} ⭐</span>
   * ) : (
   *   <span>{value}</span>
   * )
   * ```
   */
  render?: (value: T[keyof T], row: T) => React.ReactNode;

  /**
   * Additional CSS classes to apply to the column cells.
   * Useful for custom styling, alignment, or responsive behavior.
   *
   * @example
   * ```typescript
   * className: "text-right font-mono"           // Right-aligned monospace
   * className: "hidden md:table-cell"           // Responsive visibility
   * className: "w-32 truncate"                  // Fixed width with text truncation
   * className: "text-center text-sm text-gray-500" // Centered, small, muted text
   * ```
   */
  className?: string;

  /**
   * The data type hint for the column content.
   * Helps with default formatting and sorting behavior.
   *
   * - `text` - String content, default alphabetical sorting
   * - `number` - Numeric content, numerical sorting
   * - `date` - Date/time content, chronological sorting
   * - `custom` - Custom content, requires custom render function
   *
   * @default 'text'
   */
  type?: "text" | "number" | "date" | "custom";
}

/**
 * Represents an action that can be performed on a table row.
 *
 * @template T - The type of the row data object. Defaults to a generic record with string keys and unknown values.
 *
 * @example
 * ```typescript
 * // Basic usage with default row type
 * const editAction: TableAction = {
 *   label: 'Edit',
 *   variant: 'primary',
 *   onClick: (row) => console.log('Editing row:', row)
 * };
 *
 * // Usage with typed row data
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * const deleteUserAction: TableAction<User> = {
 *   label: 'Delete',
 *   variant: 'error',
 *   icon: <TrashIcon />,
 *   onClick: (user) => deleteUser(user.id)
 * };
 * ```
 */
export interface TableAction<T = Record<string, unknown>> {
  /**
   * The display text for the action button or menu item.
   * This text should be descriptive and actionable (e.g., "Edit", "Delete", "View Details").
   */
  label: string;

  /**
   * The visual style variant for the action button.
   * Determines the color scheme and styling of the action element.
   *
   * @default undefined - Uses the default styling when not specified
   *
   * - `primary` - Main action, typically blue
   * - `secondary` - Secondary action, typically gray
   * - `success` - Positive action, typically green
   * - `warning` - Caution action, typically yellow/orange
   * - `info` - Informational action, typically light blue
   * - `error` - Destructive action, typically red
   * - `ghost` - Minimal styling, transparent background
   */
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "info"
    | "error"
    | "ghost";

  /**
   * Additional CSS classes to apply to the action element.
   * Useful for custom styling or overriding default styles.
   *
   * @example
   * ```typescript
   * className: "ml-2 hover:scale-105 transition-transform"
   * ```
   */
  className?: string;

  /**
   * Callback function executed when the action is triggered.
   * Receives the entire row data as a parameter.
   *
   * @param row - The complete data object for the table row where the action was triggered
   *
   * @example
   * ```typescript
   * onClick: (user) => {
   *   // Access typed row data
   *   console.log(`Editing user: ${user.name}`);
   *   router.push(`/users/${user.id}/edit`);
   * }
   * ```
   */
  onClick?: (row: T) => void;

  /**
   * Optional React element to display as an icon alongside or instead of the label.
   * Commonly used for visual identification of actions.
   *
   * @example
   * ```typescript
   * // With Heroicons
   * icon: <PencilIcon className="w-4 h-4" />
   *
   * // With Lucide React
   * icon: <Edit2 size={16} />
   *
   * // Custom SVG
   * icon: (
   *   <svg className="w-4 h-4" viewBox="0 0 24 24">
   *     <path d="..." />
   *   </svg>
   * )
   * ```
   */
  icon?: React.ReactNode;
}

/**
 * Contains pagination state and metadata for table navigation.
 * Provides all necessary information to render pagination controls and display current state.
 *
 * @example
 * ```typescript
 * // Example pagination info for a table with 150 items, showing page 3 with 10 items per page
 * const paginationInfo: PaginationInfo = {
 *   currentPage: 3,
 *   totalPages: 15,        // Math.ceil(150 / 10)
 *   totalItems: 150,
 *   itemsPerPage: 10,
 *   startItem: 21,         // (3 - 1) * 10 + 1
 *   endItem: 30           // Math.min(3 * 10, 150)
 * };
 *
 * // Usage in pagination display
 * const paginationText = `Showing ${paginationInfo.startItem}-${paginationInfo.endItem} of ${paginationInfo.totalItems} results`;
 * // Output: "Showing 21-30 of 150 results"
 * ```
 */
export interface PaginationInfo {
  /**
   * The currently active page number (1-based indexing).
   *
   * @example
   * ```typescript
   * currentPage: 1  // First page
   * currentPage: 5  // Fifth page
   * ```
   */
  currentPage: number;

  /**
   * The total number of pages available based on total items and items per page.
   * Calculated as Math.ceil(totalItems / itemsPerPage).
   *
   * @example
   * ```typescript
   * // With 150 total items and 10 items per page
   * totalPages: 15  // Math.ceil(150 / 10)
   *
   * // With 23 total items and 10 items per page
   * totalPages: 3   // Math.ceil(23 / 10)
   * ```
   */
  totalPages: number;

  /**
   * The total number of items across all pages.
   * Used to calculate pagination metadata and display total count.
   */
  totalItems: number;

  /**
   * The number of items displayed per page.
   * Determines how many rows are shown in each page view.
   *
   * @example
   * ```typescript
   * itemsPerPage: 10   // Show 10 rows per page
   * itemsPerPage: 25   // Show 25 rows per page
   * itemsPerPage: 50   // Show 50 rows per page
   * ```
   */
  itemsPerPage: number;

  /**
   * The 1-based index of the first item shown on the current page.
   * Calculated as (currentPage - 1) * itemsPerPage + 1.
   *
   * @example
   * ```typescript
   * // Page 1 with 10 items per page
   * startItem: 1    // (1 - 1) * 10 + 1 = 1
   *
   * // Page 3 with 10 items per page
   * startItem: 21   // (3 - 1) * 10 + 1 = 21
   * ```
   */
  startItem: number;

  /**
   * The 1-based index of the last item shown on the current page.
   * Calculated as Math.min(currentPage * itemsPerPage, totalItems).
   *
   * @example
   * ```typescript
   * // Page 1 with 10 items per page, 150 total items
   * endItem: 10     // Math.min(1 * 10, 150) = 10
   *
   * // Last page (15) with 10 items per page, 150 total items
   * endItem: 150    // Math.min(15 * 10, 150) = 150
   *
   * // Page 3 with 10 items per page, 23 total items
   * endItem: 23     // Math.min(3 * 10, 23) = 23
   * ```
   */
  endItem: number;
}

/**
 * Configuration for the "Add" or "Create" button typically displayed above the table.
 * Allows customization of appearance and behavior for adding new items to the table.
 *
 * @example
 * ```typescript
 * // Basic add button
 * const addUserButton: AddButtonConfig = {
 *   text: 'Add User',
 *   onClick: () => router.push('/users/new')
 * };
 *
 * // Styled add button with icon
 * const addMemberButton: AddButtonConfig = {
 *   text: 'Add New Member',
 *   variant: 'primary',
 *   icon: <PlusIcon className="w-4 h-4" />,
 *   className: 'shadow-lg hover:shadow-xl transition-shadow',
 *   onClick: () => setShowAddModal(true)
 * };
 *
 * // Success variant for completed actions
 * const importButton: AddButtonConfig = {
 *   text: 'Import Data',
 *   variant: 'success',
 *   icon: <UploadIcon className="w-4 h-4" />,
 *   onClick: () => triggerFileUpload()
 * };
 * ```
 */
export interface AddButtonConfig {
  /**
   * The display text shown on the button.
   * Should be clear and action-oriented.
   *
   * @example
   * ```typescript
   * text: 'Add User'           // Clear and specific
   * text: 'Create New Item'    // Descriptive action
   * text: 'Import Data'        // Alternative action
   * text: '+ New'             // Concise with symbol
   * ```
   */
  text: string;

  /**
   * Callback function executed when the button is clicked.
   * Typically used to open modals, navigate to forms, or trigger creation workflows.
   *
   * @example
   * ```typescript
   * // Navigate to creation page
   * onClick: () => router.push('/users/create')
   *
   * // Open modal
   * onClick: () => setShowCreateModal(true)
   *
   * // Trigger state change
   * onClick: () => dispatch(openCreateForm())
   *
   * // Multiple actions
   * onClick: () => {
   *   analytics.track('add_button_clicked');
   *   setIsCreating(true);
   *   openCreateDialog();
   * }
   * ```
   */
  onClick: () => void;

  /**
   * The visual style variant for the button.
   * Determines the color scheme and emphasis level.
   *
   * @default 'primary' - Most add buttons use primary styling for emphasis
   *
   * - `primary` - Main action, typically blue (recommended for add buttons)
   * - `secondary` - Secondary action, typically gray
   * - `success` - Positive action, typically green
   * - `warning` - Caution action, typically yellow/orange
   * - `info` - Informational action, typically light blue
   * - `error` - Destructive action, typically red (rarely used for add buttons)
   * - `ghost` - Minimal styling, transparent background
   */
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "info"
    | "error"
    | "ghost";

  /**
   * Additional CSS classes to apply to the button element.
   * Useful for custom styling, spacing, or responsive behavior.
   *
   * @example
   * ```typescript
   * className: "ml-auto"                          // Push to right side
   * className: "shadow-lg hover:shadow-xl"        // Enhanced shadows
   * className: "hidden sm:inline-flex"            // Responsive visibility
   * className: "px-6 py-3 text-lg font-semibold" // Custom sizing and typography
   * ```
   */
  className?: string;

  /**
   * Optional React element to display as an icon within the button.
   * Typically placed before the text for better visual hierarchy.
   *
   * @example
   * ```typescript
   * // With Heroicons
   * icon: <PlusIcon className="w-4 h-4" />
   *
   * // With Lucide React
   * icon: <Plus size={16} />
   *
   * // With Font Awesome
   * icon: <FontAwesomeIcon icon={faPlus} />
   *
   * // Custom SVG
   * icon: (
   *   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
   *     <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
   *   </svg>
   * )
   * ```
   */
  icon?: React.ReactNode;
}

/**
 * Props for the DataTable component, providing comprehensive configuration for table display and behavior.
 * Supports features like sorting, pagination, searching, row selection, and column visibility management.
 *
 * @template T - The type of the row data objects. Defaults to a generic record with string keys and unknown values.
 *
 * @example
 * ```typescript
 * // Basic table setup
 * const basicTableProps: DataTableProps<User> = {
 *   data: users,
 *   columns: [
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'email', label: 'Email', sortable: true }
 *   ]
 * };
 *
 * // Full-featured table with all options
 * const advancedTableProps: DataTableProps<User> = {
 *   data: users,
 *   title: 'User Management',
 *   subTitle: 'Manage your organization users',
 *   columns: userColumns,
 *   actions: userActions,
 *   searchable: true,
 *   searchPlaceholder: 'Search users...',
 *   selectable: true,
 *   pagination: true,
 *   itemsPerPage: 25,
 *   loading: isLoading,
 *   emptyMessage: 'No users found',
 *   onSelectionChange: (selected) => setSelectedUsers(selected),
 *   addButton: {
 *     text: 'Add User',
 *     onClick: () => router.push('/users/new'),
 *     variant: 'primary'
 *   },
 *   showColumnVisibility: true
 * };
 * ```
 */
export interface DataTableProps<T = Record<string, unknown>> {
  /**
   * Array of data objects to display in the table rows.
   * Each object represents one row and should match the type T.
   *
   * @example
   * ```typescript
   * data: [
   *   { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
   *   { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
   * ]
   * ```
   */
  data: T[];

  /**
   * Optional main title displayed above the table.
   * Typically used for section headings or table identification.
   *
   * @example
   * ```typescript
   * title: 'User Management'
   * title: 'Recent Orders'
   * title: 'Team Members'
   * ```
   */
  title?: string;

  /**
   * Optional subtitle or description displayed below the title.
   * Provides additional context or instructions for the table.
   *
   * @example
   * ```typescript
   * subTitle: 'Manage your organization users and their permissions'
   * subTitle: 'Last updated 5 minutes ago'
   * subTitle: 'Showing active members only'
   * ```
   */
  subTitle?: string;

  /**
   * Array of column configurations that define the table structure.
   * Each column specifies how to display and interact with data properties.
   *
   * @example
   * ```typescript
   * columns: [
   *   { key: 'name', label: 'Full Name', sortable: true },
   *   { key: 'email', label: 'Email Address', sortable: true },
   *   {
   *     key: 'status',
   *     label: 'Status',
   *     render: (status) => <Badge variant={status === 'active' ? 'success' : 'error'}>{status}</Badge>
   *   }
   * ]
   * ```
   */
  columns: TableColumn<T>[];

  /**
   * Optional array of actions that can be performed on each table row.
   * Actions appear as buttons or menu items for each row.
   *
   * @example
   * ```typescript
   * actions: [
   *   {
   *     label: 'Edit',
   *     variant: 'primary',
   *     icon: <EditIcon />,
   *     onClick: (user) => router.push(`/users/${user.id}/edit`)
   *   },
   *   {
   *     label: 'Delete',
   *     variant: 'error',
   *     icon: <DeleteIcon />,
   *     onClick: (user) => handleDelete(user.id)
   *   }
   * ]
   * ```
   */
  actions?: TableAction<T>[];

  /**
   * Whether to display a search input above the table.
   * When true, enables client-side filtering of table data.
   *
   * @default false
   */
  searchable?: boolean;

  /**
   * Placeholder text for the search input field.
   * Only relevant when searchable is true.
   *
   * @default 'Search...'
   *
   * @example
   * ```typescript
   * searchPlaceholder: 'Search users by name or email...'
   * searchPlaceholder: 'Filter orders...'
   * searchPlaceholder: 'Find members...'
   * ```
   */
  searchPlaceholder?: string;

  /**
   * Optional content to display next to the search input.
   * Useful for adding filter buttons or other controls.
   */
  searchEndContent?: React.ReactNode;

  /**
   * Whether rows can be selected with checkboxes.
   * When true, adds a checkbox column and enables multi-row selection.
   *
   * @default false
   */
  selectable?: boolean;

  /**
   * Pagination configuration for the table.
   * - `false` - No pagination
   * - `true` - Enable pagination with default settings
   * - `PaginationInfo` - Custom pagination state and metadata
   *
   * @default false
   *
   * @example
   * ```typescript
   * pagination: true  // Enable with defaults
   *
   * pagination: {
   *   currentPage: 2,
   *   totalPages: 10,
   *   totalItems: 95,
   *   itemsPerPage: 10,
   *   startItem: 11,
   *   endItem: 20
   * }
   * ```
   */
  pagination?: boolean | PaginationInfo;

  /**
   * Number of items to display per page when pagination is enabled.
   * Only relevant when pagination is true or PaginationInfo.
   *
   * @default 10
   *
   * @example
   * ```typescript
   * itemsPerPage: 25   // Show 25 rows per page
   * itemsPerPage: 50   // Show 50 rows per page
   * itemsPerPage: 100  // Show 100 rows per page
   * ```
   */
  itemsPerPage?: number;

  /**
   * Whether the table is in a loading state.
   * When true, displays loading indicators and disables interactions.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Message to display when the data array is empty.
   * Provides user feedback when no data is available.
   *
   * @default 'No data available'
   *
   * @example
   * ```typescript
   * emptyMessage: 'No users found'
   * emptyMessage: 'No orders match your search criteria'
   * emptyMessage: 'Start by adding your first team member'
   * ```
   */
  emptyMessage?: string;

  /**
   * Additional CSS classes to apply to the table container.
   * Useful for custom styling or layout adjustments.
   *
   * @example
   * ```typescript
   * className: 'shadow-lg rounded-lg'
   * className: 'border border-gray-200'
   * className: 'max-h-96 overflow-auto'
   * ```
   */
  className?: string;

  /**
   * Callback function called when row selection changes.
   * Receives an array of currently selected row data objects.
   * Only relevant when selectable is true.
   *
   * @param selectedRows - Array of selected row data objects
   *
   * @example
   * ```typescript
   * onSelectionChange: (selectedUsers) => {
   *   setSelectedUsers(selectedUsers);
   *   console.log(`${selectedUsers.length} users selected`);
   * }
   *
   * onSelectionChange: (selected) => {
   *   // Enable bulk actions when items are selected
   *   setBulkActionsEnabled(selected.length > 0);
   *   setSelectedItems(selected);
   * }
   * ```
   */
  onSelectionChange?: (selectedRows: T[]) => void;

  /**
   * Configuration for an "Add" button displayed above the table.
   * Can be either a configuration object or a function returning a custom React element.
   *
   * @example
   * ```typescript
   * // Configuration object
   * addButton: {
   *   text: 'Add User',
   *   variant: 'primary',
   *   icon: <PlusIcon />,
   *   onClick: () => router.push('/users/new')
   * }
   *
   * // Custom render function
   * addButton: () => (
   *   <DropdownMenu>
   *     <DropdownMenuTrigger asChild>
   *       <Button variant="primary">
   *         Add <ChevronDownIcon />
   *       </Button>
   *     </DropdownMenuTrigger>
   *     <DropdownMenuContent>
   *       <DropdownMenuItem onClick={() => addSingleUser()}>
   *         Add Single User
   *       </DropdownMenuItem>
   *       <DropdownMenuItem onClick={() => importUsers()}>
   *         Import Users
   *       </DropdownMenuItem>
   *     </DropdownMenuContent>
   *   </DropdownMenu>
   * )
   * ```
   */
  addButton?: AddButtonConfig | (() => React.ReactNode);

  /**
   * Complete array of all available columns for column visibility management.
   * Used in conjunction with visibleColumns to control which columns are displayed.
   * When provided, enables column visibility controls.
   */
  allColumns?: TableColumn<T>[];

  /**
   * Set of column keys that are currently visible.
   * Used to control which columns from allColumns are displayed in the table.
   *
   * @example
   * ```typescript
   * visibleColumns: new Set(['name', 'email', 'status'])
   * // Only name, email, and status columns will be shown
   * ```
   */
  visibleColumns?: Set<string>;

  /**
   * Callback function called when a column's visibility is toggled.
   * Receives the column key that was toggled.
   *
   * @param columnKey - The key of the column being toggled
   *
   * @example
   * ```typescript
   * onToggleColumn: (columnKey) => {
   *   const newVisibleColumns = new Set(visibleColumns);
   *   if (newVisibleColumns.has(columnKey)) {
   *     newVisibleColumns.delete(columnKey);
   *   } else {
   *     newVisibleColumns.add(columnKey);
   *   }
   *   setVisibleColumns(newVisibleColumns);
   * }
   * ```
   */
  onToggleColumn?: (columnKey: string) => void;

  /**
   * Callback function called when "Show All Columns" action is triggered.
   * Receives an array of all available column keys.
   *
   * @param columnKeys - Array of all available column keys
   *
   * @example
   * ```typescript
   * onShowAllColumns: (columnKeys) => {
   *   setVisibleColumns(new Set(columnKeys));
   * }
   * ```
   */
  onShowAllColumns?: (columnKeys: string[]) => void;

  /**
   * Callback function called when "Hide All Columns" action is triggered.
   * Receives an array of all available column keys for reference.
   *
   * @param columnKeys - Array of all available column keys
   *
   * @example
   * ```typescript
   * onHideAllColumns: (columnKeys) => {
   *   // Keep at least one column visible (e.g., the first one)
   *   setVisibleColumns(new Set([columnKeys[0]]));
   * }
   * ```
   */
  onHideAllColumns?: (columnKeys: string[]) => void;

  /**
   * Whether to display column visibility controls.
   * When true, shows UI elements for toggling column visibility.
   * Requires allColumns, visibleColumns, and related callbacks to be provided.
   *
   * @default false
   */
  showColumnVisibility?: boolean;
}

/**
 * Represents order data structure for e-commerce or transaction tables.
 * Contains customer information, order status, financial details, and timing information.
 *
 * @example
 * ```typescript
 * // Complete order example
 * const order: OrderData = {
 *   id: 'ORD-2024-001',
 *   customer: {
 *     name: 'John Doe',
 *     email: 'john.doe@example.com',
 *     avatar: 'https://example.com/avatars/john.jpg'
 *   },
 *   status: 'Processing',
 *   amount: 299.99,
 *   orderDate: '2024-01-15',
 *   orderTime: '14:30:00'
 * };
 *
 * // Order without customer avatar
 * const simpleOrder: OrderData = {
 *   id: 'ORD-2024-002',
 *   customer: {
 *     name: 'Jane Smith',
 *     email: 'jane.smith@example.com'
 *   },
 *   status: 'Success',
 *   amount: 149.50,
 *   orderDate: '2024-01-16',
 *   orderTime: '09:15:30'
 * };
 *
 * // Usage in table columns
 * const orderColumns: TableColumn<OrderData>[] = [
 *   {
 *     key: 'id',
 *     label: 'Order ID',
 *     sortable: true
 *   },
 *   {
 *     key: 'customer',
 *     label: 'Customer',
 *     render: (customer) => (
 *       <div className="flex items-center gap-2">
 *         {customer.avatar && (
 *           <img src={customer.avatar} alt={customer.name} className="w-8 h-8 rounded-full" />
 *         )}
 *         <div>
 *           <div className="font-medium">{customer.name}</div>
 *           <div className="text-sm text-gray-500">{customer.email}</div>
 *         </div>
 *       </div>
 *     )
 *   },
 *   {
 *     key: 'status',
 *     label: 'Status',
 *     render: (status) => (
 *       <Badge variant={status === 'Success' ? 'success' : status === 'Failed' ? 'error' : 'warning'}>
 *         {status}
 *       </Badge>
 *     )
 *   }
 * ];
 * ```
 */
export interface OrderData {
  /**
   * Unique identifier for the order.
   * Typically follows a specific format for easy identification and tracking.
   *
   * @example
   * ```typescript
   * id: 'ORD-2024-001'        // Formatted order ID
   * id: '12345'               // Simple numeric ID
   * id: 'ord_1a2b3c4d5e'      // UUID-style ID
   * ```
   */
  id: string;

  /**
   * Customer information associated with the order.
   * Contains essential customer details for identification and contact.
   */
  customer: {
    /**
     * Full name of the customer who placed the order.
     *
     * @example
     * ```typescript
     * name: 'John Doe'
     * name: 'Jane Smith'
     * name: 'Dr. Michael Johnson'
     * ```
     */
    name: string;

    /**
     * Email address of the customer.
     * Used for communication and order confirmations.
     *
     * @example
     * ```typescript
     * email: 'john.doe@example.com'
     * email: 'customer@company.org'
     * email: 'user+orders@gmail.com'
     * ```
     */
    email: string;

    /**
     * Optional URL to the customer's avatar or profile image.
     * When provided, can be displayed in the table for better visual identification.
     *
     * @example
     * ```typescript
     * avatar: 'https://example.com/avatars/user123.jpg'
     * avatar: 'https://gravatar.com/avatar/hash'
     * avatar: '/uploads/profiles/customer-photo.png'
     * avatar: undefined  // No avatar available
     * ```
     */
    avatar?: string;
  };

  /**
   * Current status of the order in the fulfillment process.
   * Represents the order's progress from placement to completion.
   *
   * - `Processing` - Order is being prepared or fulfilled
   * - `Success` - Order has been completed successfully
   * - `Failed` - Order encountered an error or was cancelled
   * - `Pending` - Order is waiting for payment or approval
   *
   * @example
   * ```typescript
   * status: 'Processing'  // Order is being prepared
   * status: 'Success'     // Order completed successfully
   * status: 'Failed'      // Payment failed or order cancelled
   * status: 'Pending'     // Awaiting payment confirmation
   * ```
   */
  status: "Processing" | "Success" | "Failed" | "Pending";

  /**
   * Total monetary amount of the order.
   * Typically represents the final price including taxes and fees.
   *
   * @example
   * ```typescript
   * amount: 299.99    // $299.99
   * amount: 1500.00   // $1,500.00
   * amount: 49.95     // $49.95
   * amount: 0         // Free order or promotional item
   * ```
   */
  amount: number;

  /**
   * Date when the order was placed.
   * Should be in a consistent date format, typically ISO date string (YYYY-MM-DD).
   *
   * @example
   * ```typescript
   * orderDate: '2024-01-15'     // ISO date format
   * orderDate: '2024-12-25'     // Christmas order
   * orderDate: '2023-11-24'     // Black Friday order
   * ```
   */
  orderDate: string;

  /**
   * Time when the order was placed.
   * Should be in a consistent time format, typically HH:MM:SS.
   *
   * @example
   * ```typescript
   * orderTime: '14:30:00'   // 2:30 PM
   * orderTime: '09:15:30'   // 9:15:30 AM
   * orderTime: '23:59:59'   // Just before midnight
   * orderTime: '00:00:01'   // Just after midnight
   * ```
   */
  orderTime: string;
}
