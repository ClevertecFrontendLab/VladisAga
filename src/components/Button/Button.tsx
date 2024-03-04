import cn from 'classnames';
import styles from './Button.module.scss';
import React, { ReactNode } from 'react';

type IButton = {
    onClick?: () => void;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    style?: object;
}

export const ButtonFC: React.FC<IButton> = ({ children, className, ...props }) => (
    <button {...props}  className={cn(styles['btn'], className)}  >
        {children}
    </button>
);
