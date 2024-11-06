import React from 'react';
import { Issue as IssueType } from './types';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Pencil } from 'lucide-react';
import IssueForm from './IssueForm';

interface IssueDialogProps {
  issue: IssueType;
  editingIssue: IssueType | null;
  onEditClick: (issue: IssueType) => void;
  onUpdate: (updatedIssue: IssueType) => void;
}

const IssueDialog: React.FC<IssueDialogProps> = ({
  issue,
  editingIssue,
  onEditClick,
  onUpdate,
}) => {
  return (
    <Dialog
      open={editingIssue?.id === issue.id}
      onOpenChange={() => onEditClick(issue)}
    >
      <DialogTrigger asChild>
        <Pencil className="h-4 w-4 mr-2 cursor-pointer text-gray-500 hover:text-gray-700" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Issue</DialogTitle>
          <DialogDescription>
            Make changes to the issue details.
          </DialogDescription>
        </DialogHeader>
        <IssueForm
          initialIssue={editingIssue || undefined}
          onSubmit={onUpdate}
          onCancel={() => onEditClick(issue)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onEditClick(issue)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDialog;
