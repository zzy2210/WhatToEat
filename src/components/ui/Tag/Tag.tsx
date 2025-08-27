import React from 'react';
import './Tag.css';

export interface TagProps {
  children: React.ReactNode;
  weight?: number;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  children,
  weight = 0,
  icon,
  size = 'medium',
  clickable = false,
  onClick,
}) => {
  const isPositive = weight >= 0;

  const classes = [
    'tag',
    `tag--${size}`,
    isPositive ? 'tag--positive' : 'tag--negative',
    clickable && 'tag--clickable',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <span className={classes} onClick={handleClick}>
      {icon && <span className="tag__icon">{icon}</span>}
      <span className="tag__content">
        <span className="tag__name">{children}</span>
        {weight !== 0 && (
          <span className="tag__weight">
            {isPositive ? '+' : ''}{weight}
          </span>
        )}
      </span>
    </span>
  );
};