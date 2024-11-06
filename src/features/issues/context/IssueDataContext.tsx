import { createContext } from 'react';
import { Issue as IssueType } from '../components/types';

interface IssueDataContextType {
  issues: IssueType[];
  setIssues: React.Dispatch<React.SetStateAction<IssueType[]>>;
  loading: boolean;
}

const IssueDataContext = createContext<IssueDataContextType | undefined>(
  undefined
);

export default IssueDataContext;
