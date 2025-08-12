/**
 * Database utility functions for optimizing queries and data access
 */

/**
 * Generates a parameterized WHERE clause for filtering
 * This helps prevent SQL injection and improves query performance
 * 
 * @param filters Object containing filter conditions
 * @returns SQL WHERE clause and parameters
 */
export function generateWhereClause(filters: Record<string, any>): { clause: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Handle array values (IN operator)
        conditions.push(`${key} IN (${value.map(() => `$${paramIndex++}`).join(', ')})`);
        params.push(...value);
      } else if (typeof value === 'object' && value !== null) {
        // Handle operators like >, <, >=, <=, LIKE
        Object.entries(value).forEach(([op, val]) => {
          let operator: string;
          switch (op) {
            case 'gt': operator = '>'; break;
            case 'lt': operator = '<'; break;
            case 'gte': operator = '>='; break;
            case 'lte': operator = '<='; break;
            case 'like': operator = 'LIKE'; break;
            case 'ilike': operator = 'ILIKE'; break;
            case 'contains': 
              conditions.push(`${key} @> $${paramIndex++}`);
              params.push(val);
              return;
            case 'containedBy':
              conditions.push(`${key} <@ $${paramIndex++}`);
              params.push(val);
              return;
            case 'overlaps':
              conditions.push(`${key} && $${paramIndex++}`);
              params.push(val);
              return;
            default: operator = '=';
          }
          conditions.push(`${key} ${operator} $${paramIndex++}`);
          params.push(val);
        });
      } else {
        // Simple equality
        conditions.push(`${key} = $${paramIndex++}`);
        params.push(value);
      }
    }
  });
  
  return {
    clause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
}

/**
 * Generates a parameterized ORDER BY clause
 * 
 * @param orderBy Object containing order conditions
 * @returns SQL ORDER BY clause
 */
export function generateOrderByClause(orderBy: Record<string, 'asc' | 'desc'>): string {
  if (!orderBy || Object.keys(orderBy).length === 0) {
    return '';
  }
  
  const orders = Object.entries(orderBy).map(([column, direction]) => 
    `${column} ${direction.toUpperCase()}`
  );
  
  return `ORDER BY ${orders.join(', ')}`;
}

/**
 * Generates a LIMIT and OFFSET clause for pagination
 * 
 * @param limit Maximum number of rows to return
 * @param offset Number of rows to skip
 * @returns SQL LIMIT and OFFSET clause
 */
export function generatePaginationClause(limit?: number, offset?: number): string {
  let clause = '';
  
  if (limit !== undefined && limit > 0) {
    clause += `LIMIT ${limit}`;
  }
  
  if (offset !== undefined && offset > 0) {
    clause += ` OFFSET ${offset}`;
  }
  
  return clause;
}

/**
 * Optimizes a query by adding appropriate hints
 * 
 * @param query SQL query to optimize
 * @param table Main table being queried
 * @param indexHint Index to use for the query
 * @returns Optimized SQL query
 */
export function optimizeQuery(query: string, table: string, indexHint?: string): string {
  if (!indexHint) {
    return query;
  }
  
  // Add index hint to the query
  return query.replace(
    new RegExp(`FROM\\s+${table}\\b`, 'i'),
    `FROM ${table} /*+ INDEX(${table} ${indexHint}) */`
  );
}

/**
 * Generates a full optimized SQL query with filtering, ordering, and pagination
 * 
 * @param table Table to query
 * @param columns Columns to select
 * @param filters Filter conditions
 * @param orderBy Order conditions
 * @param limit Maximum number of rows
 * @param offset Number of rows to skip
 * @param indexHint Index hint for query optimizer
 * @returns SQL query and parameters
 */
export function buildOptimizedQuery(
  table: string,
  columns: string[] = ['*'],
  filters: Record<string, any> = {},
  orderBy: Record<string, 'asc' | 'desc'> = {},
  limit?: number,
  offset?: number,
  indexHint?: string
): { query: string; params: any[] } {
  const { clause, params } = generateWhereClause(filters);
  const orderByClause = generateOrderByClause(orderBy);
  const paginationClause = generatePaginationClause(limit, offset);
  
  let query = `SELECT ${columns.join(', ')} FROM ${table} ${clause} ${orderByClause} ${paginationClause}`;
  
  // Optimize the query if an index hint is provided
  if (indexHint) {
    query = optimizeQuery(query, table, indexHint);
  }
  
  return { query, params };
}

/**
 * Formats a date for PostgreSQL
 * 
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDateForPostgres(date: Date): string {
  return date.toISOString();
}

/**
 * Parses a PostgreSQL timestamp
 * 
 * @param timestamp PostgreSQL timestamp
 * @returns JavaScript Date object
 */
export function parsePostgresTimestamp(timestamp: string): Date {
  return new Date(timestamp);
}