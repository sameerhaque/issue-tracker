import React, { useState, useEffect } from 'react';
import IssueForm from './IssueForm';
import IssueService from '../services/IssueService';
import { Issue as IssueType } from './types';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { Check, Trash, Plus, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/ui/dialog';

const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<IssueType[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIssue, setEditingIssue] = useState<IssueType | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      const data = await IssueService.getIssues();
      const uniqueIssues = Array.from(
        new Map(data.map((issue) => [issue.id, issue])).values()
      );
      setIssues(uniqueIssues);
      setFilteredIssues(uniqueIssues);
      setLoading(false);
    };
    fetchIssues();
  }, []);

  useEffect(() => {
    setFilteredIssues(
      selectedTags.length === 0
        ? issues
        : issues.filter((issue) =>
            issue.tags.some((tag) => selectedTags.includes(tag))
          )
    );
  }, [issues, selectedTags]);

  const handleIssueSubmit = async (newIssue: IssueType) => {
    const existingIssue = issues.find((issue) => issue.id === newIssue.id);
    if (!existingIssue) {
      const addedIssue = await IssueService.addIssue(newIssue);
      setIssues((prevIssues) => [...prevIssues, addedIssue]);
    }
    setIsDialogOpen(false);
  };

  const handleIssueDelete = (issueId: string) => {
    setIssues((prevIssues) =>
      prevIssues.filter((issue) => issue.id !== issueId)
    );
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleNewIssueClick = () => {
    setEditingIssue(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClick = (issue: IssueType) => {
    setEditingIssue(issue);
    setIsDialogOpen(true);
  };

  const handleIssueUpdate = async (updatedIssue: IssueType) => {
    await IssueService.updateIssue(updatedIssue);
    setIssues((prevIssues) =>
      prevIssues.map((i) => (i.id === updatedIssue.id ? updatedIssue : i))
    );
    setEditingIssue(undefined);
    setIsDialogOpen(false);
  };

  const allTags = Array.from(new Set(issues.flatMap((issue) => issue.tags)));

  return (
    <div className="issue-list">
      <div className="flex justify-end mb-6 ">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={handleNewIssueClick}>
              <Plus className="mr-2 h-4 w-4" />
              New Issue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIssue ? 'Edit Issue' : 'Create New Issue'}
              </DialogTitle>
              <DialogDescription>
                {editingIssue
                  ? 'Edit the details of the issue.'
                  : 'Enter the details of the new issue.'}
              </DialogDescription>
            </DialogHeader>
            <IssueForm
              initialIssue={editingIssue}
              onSubmit={editingIssue ? handleIssueUpdate : handleIssueSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="tag-filters flex flex-wrap justify-center mb-4">
        {allTags.map((tag) => (
          <Badge
            key={tag}
            className="mx-2 flex items-center mb-3"
            onClick={() => handleTagClick(tag)}
            variant={selectedTags.includes(tag) ? undefined : 'secondary'}
          >
            {selectedTags.includes(tag) && <Check className="mr-0 h-4 w-4" />}
            <span className="ml-2">{tag}</span>
          </Badge>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="issue-card p-6 relative">
              <div className="card-actions absolute top-2 right-2">
                <Pencil
                  className="h-4 w-4 mr-2 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => handleEditClick(issue)}
                />
                <Trash
                  className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => handleIssueDelete(issue.id)}
                />
              </div>
              <h3 className="font-bold text-lg">{issue.title}</h3>
              <p
                className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: issue.text }}
              />
              <div className="mt-2">
                {issue.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="mr-2 mt-2">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueList;
