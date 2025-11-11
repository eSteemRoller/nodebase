
export interface Workflow {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface WorkflowsResponse {
  data: Workflow[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
