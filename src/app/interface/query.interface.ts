export interface PrismaFindManyArgs {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, boolean> | Record<string, unknown>;
  orderBy: Record<string, unknown> | Record<string, unknown>[];
  skip?: number;
  take?: number;
  cursor?: Record<string, unknown>;
  distinct?: string[] | string;
  [key: string]: unknown;
}

// searchableFields

export interface PrismaCountArgs {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, boolean> | Record<string, unknown>;
  orderBy: Record<string, unknown> | Record<string, unknown>[];
  skip?: number;
  take?: number;
  cursor?: Record<string, unknown>;
  distinct?: string[] | string;
  [key: string]: unknown;
}

export interface PrismaModelDelegate {
  findMany(args?: any): Promise<any[]>;
  count(args: any): Promise<number>;
}

export interface IQueryParams {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  fields?: string;
  include?: string;
  [key: string]: unknown;
}
export interface IQueryConfig {
  searchableFields?: string[];
  filterrableFields?: string[];
}

export interface PrismaStringFiltered {
  contains: string;
  startsWith?: string;
  endWitch?: string;
  mode?: "insensitive" | "default";
  equald?: string;
  in?: string[];
  notIn?: string[];
  lt?: string;
  lte?: string;
  ge?: string;
  gte?: string;
  not?: PrismaStringFiltered | string;
}

export interface PrismaNumberFilter {
  equals?: number;
  in?: number[];
  notIn?: number[];
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  not?: PrismaNumberFilter | number;
}

export interface PrismaWhereCondition {
  OR?: Record<string, unknown>[];
  AND?: Record<string, unknown>[];
  NOT?: Record<string, unknown>[];
  [ket: string]: unknown;
}

export interface IQueryResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
