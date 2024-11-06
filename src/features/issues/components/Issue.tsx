import React, { useState } from 'react';
import { Issue as IssueType } from './types';
import IssueService from '../services/IssueService';
import { Button } from '@/ui/button';

interface IssueProps {
  issue: IssueType;
  onDelete: (issueId: string) => void;
}

const Issue: React.FC<IssueProps> = ({ issue, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIssue, setEditedIssue] = useState({ ...issue });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    await IssueService.updateIssue(editedIssue);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedIssue({ ...issue });
    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    await IssueService.deleteIssue(issue.id);
    onDelete(issue.id);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedIssue({
      ...editedIssue,
      [name]: value,
    });
  };

  return (
    <div className="issue">
      {isEditing ? (
        <div className="issue-edit">
          <input
            type="text"
            name="title"
            value={editedIssue.title}
            onChange={handleInputChange}
          />
          <textarea
            name="text"
            value={editedIssue.text}
            onChange={handleInputChange}
          />
          <Button onClick={handleSaveClick}>Save</Button>
          <Button variant="destructive" onClick={handleCancelClick}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="issue-view">
          <h3>{editedIssue.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: editedIssue.text }} />
          <Button onClick={handleEditClick}>Edit</Button>
          <Button variant="destructive" onClick={handleDeleteClick}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default Issue;
