import React from 'react';
import { Tag as TagType } from '../../../types';
import './TagSelector.css';

export interface TagSelectorProps {
  tags: TagType[];
  selectedTagIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  disabled?: boolean;
}

// TODO(human)
export const TagSelector: React.FC<TagSelectorProps> = () => {
  // TODO(human): Implement the tag selection logic
  // The component should:
  // 1. Display all available tags in a grid layout
  // 2. Show selected state for tags that are in selectedTagIds
  // 3. Handle click events to toggle tag selection
  // 4. Call onSelectionChange with updated selectedIds array
  // 5. Disable interaction when disabled prop is true

  return (
    <div className="tag-selector">
      {/* TODO(human): Implement the tag selection UI */}
    </div>
  );
};