import cn from 'classnames';
import styles from './Link.module.scss';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ILink {
    href: string;
    children: ReactNode;
    className?: string;
}

export const LinkFC: React.FC<ILink> = ({children, className, href, ...props}) => {
    return (   
            <Link {...props} to={href} className={cn(styles['link'], className )}  >
                {children}
            </Link>
        
    )
}