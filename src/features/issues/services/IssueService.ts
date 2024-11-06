import mockData from '../../../data/mockData.json';
import { Issue as IssueType } from '../components/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getIssues = async (): Promise<IssueType[]> => {
  await delay(500);
  return mockData;
};

const addIssue = async (newIssue: IssueType): Promise<IssueType> => {
  await delay(500);
  if (!mockData.find((issue) => issue.id === newIssue.id)) {
    mockData.push(newIssue);
  }
  return newIssue;
};

const updateIssue = async (updatedIssue: IssueType): Promise<IssueType> => {
  await delay(500);
  const issueIndex = mockData.findIndex(
    (issue) => issue.id === updatedIssue.id
  );
  if (issueIndex !== -1) {
    mockData[issueIndex] = updatedIssue;
  }
  return updatedIssue;
};

const deleteIssue = async (issueId: string): Promise<void> => {
  await delay(500);
  const index = mockData.findIndex((issue) => issue.id === issueId);
  if (index !== -1) {
    mockData.splice(index, 1);
  }
};

export default { getIssues, addIssue, updateIssue, deleteIssue };
