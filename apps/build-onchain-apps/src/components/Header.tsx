import { useState, ReactNode, useEffect } from 'react';
import { Flex, IconButton, Theme, Tooltip } from '@radix-ui/themes';
import Image from 'next/image';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { AccountConnectButton } from '@/onchain/components';
import logo from '../../public/logo.svg';
import { classNames } from '../utils/classNames';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

export type HeaderProps = {
  children?: ReactNode;
  gitHubLink?: string;
  ghost?: boolean;
};

type ScrollState = 'at-top' | 'scrolling-up' | 'scrolling-down';

export function Header({ children, gitHubLink, ghost }: HeaderProps) {
  const [scrollState, setScrollState] = useState<ScrollState>('at-top');

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const direction = previousScrollY < window.scrollY ? 'scrolling-down' : 'scrolling-up';
      const state = window.scrollY < 30 ? 'at-top' : direction;
      previousScrollY = window.scrollY;
      setScrollState(state);
    };

    if (ghost) {
      addEventListener('scroll', handleScroll, { passive: true });
    } else {
      removeEventListener('scroll', handleScroll);
    }

    handleScroll();
    return () => removeEventListener('scroll', handleScroll);
  }, [ghost]);

  return (
    <Theme asChild className="radix-themes-custom-fonts">
      <div
        data-scroll-state={scrollState}
        className={classNames(styles.HeaderRoot, ghost ? styles.ghost : '')}
      >
        <div className={styles.HeaderInner}>
          <Flex align="center" position="absolute" top="0" bottom="0" left="0" pl="4">
            <NextLink href="/" passHref legacyBehavior>
              <Image src={logo} alt="Onchain Coffee App" />
            </NextLink>
          </Flex>

          <Flex align="center" gap="5" position="absolute" top="0" bottom="0" right="0" pr="4">
            {children}
            <AccountConnectButton />

            {gitHubLink && (
              <Tooltip className="radix-themes-custom-fonts" content="View GitHub ">
                <IconButton asChild size="3" variant="ghost" color="gray">
                  <a href={gitHubLink} target="_blank" aria-labelledby="View GitHub Button">
                    <GitHubLogoIcon width="16" height="16" />
                  </a>
                </IconButton>
              </Tooltip>
            )}

            <ThemeToggle />
          </Flex>
        </div>
      </div>
    </Theme>
  );
}
