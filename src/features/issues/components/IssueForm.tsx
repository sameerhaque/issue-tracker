import React, { useState, useEffect } from 'react';
import { Issue as IssueType } from './types';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Label } from '@/ui/label';
import { Badge } from '@/ui/badge';

interface IssueFormProps {
  initialIssue?: IssueType;
  onSubmit: (newIssue: IssueType) => void;
  onCancel: () => void;
}

const IssueForm: React.FC<IssueFormProps> = ({
  initialIssue,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialIssue?.title || '');
  const [text, setText] = useState(initialIssue?.text || '');
  const [tags, setTags] = useState<string[]>(initialIssue?.tags || []);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (initialIssue) {
      setTitle(initialIssue.title);
      setText(initialIssue.text);
      setTags(initialIssue.tags);
    }
  }, [initialIssue]);

  const calculate = (expression: string): number => {
    let total = 0,
      currentNumber = 0,
      operator: '+' | '-' = '+';
    const trimmedExpression = expression.trim();

    for (let i = 0; i < trimmedExpression.length; i++) {
      const char = trimmedExpression[i];
      if (/\d/.test(char)) {
        currentNumber = currentNumber * 10 + parseInt(char, 10);
      }
      if (!/\d/.test(char) || i === trimmedExpression.length - 1) {
        total =
          operator === '+' ? total + currentNumber : total - currentNumber;
        currentNumber = 0;
        if (char === '+' || char === '-') operator = char;
      }
    }
    return total;
  };

  const evaluateAndReplaceExpressions = (text: string): string => {
    const regex = /(-?\d+(\.\d+)?(\s*[-+]\s*-?\d+(\.\d+)?)+)/g;
    return text.replace(regex, (match) => calculate(match).toString());
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const evaluatedText = evaluateAndReplaceExpressions(text);
    const newIssue: IssueType = {
      id: initialIssue
        ? initialIssue.id
        : Math.random().toString(36).substring(2, 15),
      title,
      text: evaluatedText,
      tags,
    };
    onSubmit(newIssue);
    if (!initialIssue) {
      setTitle('');
      setText('');
      setTags([]);
      setNewTag('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <div className="flex flex-col mb-6">
        <Label className="mb-2" htmlFor="title">
          Title
        </Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter issue title"
        />
      </div>
      <div className="flex flex-col space-y-2 mb-6">
        <Label htmlFor="text" className="mb-2">
          Description
        </Label>
        <Textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          placeholder="Enter issue description (e.g., 4+5-6)"
        />
      </div>
      <div className="flex flex-col mb-6">
        <Label className="mb-2">Tags</Label>
        <div className="flex flex-wrap items-center">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="mr-2 mb-2">
              {tag}
              <Button
                variant="outline"
                onClick={() => handleRemoveTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="ml-2 text-red-500"
              >
                &times;
              </Button>
            </Badge>
          ))}
        </div>
        <div className="flex w-full justify-end items-center">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            className="mr-2 flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
          >
            Add Tag
          </Button>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          {initialIssue ? 'Update Issue' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default IssueForm;
