export const PLAYER_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: true,
  showTableFooter: false,
  showCSVExportButton: true,
  enablePagination: true,
  enableFiltering: true,
  showTableFilterOptions: false,
};

export const UPDATE_EVENTS_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: false,
  showTableFooter: false,
  showCSVExportButton: true,
  enablePagination: true,
  enableFiltering: true,
  showTableFilterOptions: false,
};

export const TPE_EVENTS_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: false,
  showTableFooter: false,
  showCSVExportButton: true,
  enablePagination: true,
  enableFiltering: true,
  showTableFilterOptions: false,
};

export const TPE_SUBMISSION_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: false,
  showTableFooter: false,
  showCSVExportButton: false,
  enablePagination: true,
  enableFiltering: true,
  showTableFilterOptions: false,
};

export const REGRESSION_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: false,
  showTableFooter: false,
  showCSVExportButton: true,
  enablePagination: true,
  enableFiltering: true,
  showTableFilterOptions: false,
};

export const BANK_TRANSACTION_SUMMARY_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: false,
  showTableFooter: false,
  showCSVExportButton: true,
  enablePagination: true,
  enableFiltering: true,
  showTableFilterOptions: false,
};

export const TEAM_BANK_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: false,
  showTableFooter: false,
  showCSVExportButton: true,
  enablePagination: true,
  enableFiltering: true,
  showTableFilterOptions: false,
};

export interface TableBehavioralFlags {
  stickyFirstColumn: boolean;
  showTableFooter: boolean;
  showCSVExportButton: boolean;
  enablePagination: boolean;
  enableFiltering: boolean;
  showTableFilterOptions: boolean;
}
