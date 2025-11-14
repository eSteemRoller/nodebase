
export interface WorkflowData {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface WorkflowsAll {
  items: any;
  data: WorkflowData[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
