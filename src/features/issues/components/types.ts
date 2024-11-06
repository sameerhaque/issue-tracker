export interface Issue {
  id: string;
  title: string;
  text: string;
  tags: string[];
}

export interface IssueListProps {
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  loading: boolean;
}
