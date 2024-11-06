import React, { createContext, useState, useEffect } from 'react';
import IssueService from '../services/IssueService';
import { Issue as IssueType } from './types';

interface IssueDataContextType {
  issues: IssueType[];
  setIssues: React.Dispatch<React.SetStateAction<IssueType[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const IssueDataContext = createContext<IssueDataContextType | undefined>(
  undefined
);

interface IssueDataProviderProps {
  children: React.ReactNode;
}

const IssueDataProvider: React.FC<IssueDataProviderProps> = ({ children }) => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      const data = await IssueService.getIssues();
      setIssues(data);
      setLoading(false);
    };
    fetchIssues();
  }, []);

  return (
    <IssueDataContext.Provider
      value={{ issues, setIssues, loading, setLoading }}
    >
      {children}
    </IssueDataContext.Provider>
  );
};

export { IssueDataContext, IssueDataProvider };
