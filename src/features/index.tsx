import React from 'react';
import IssueList from './issues/components/IssueList';

const Issues: React.FC = () => {
  return (
    <div className="issues-container aspect-video rounded-xl bg-muted/80">
      <IssueList />
    </div>
  );
};

export default Issues;
