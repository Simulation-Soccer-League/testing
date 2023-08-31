import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { Squash as Hamburger } from 'hamburger-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useSession } from '../contexts/AuthContext';
import { useCurrentPlayer } from '../hooks/useCurrentPlayer';
import { BaseUserData } from '../pages/api/v1/user';
import { query } from '../utils/query';

import { PermissionGuard } from './auth/PermissionGuard';
import { RoleGuard } from './auth/RoleGuard';
import { Link } from './common/Link';
import { LeagueLogo } from './LeagueLogo';
import { SudoButton } from './SudoButton';

export const Header = ({
  showAuthButtons = true,
}: {
  showAuthButtons?: boolean;
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { session, loggedIn, handleLogout } = useSession();
  const { status } = useCurrentPlayer();
  const router = useRouter();

  const { data } = useQuery<BaseUserData>({
    queryKey: ['baseUser', session?.token],
    queryFn: () =>
      query(`api/v1/user`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }),
    enabled: loggedIn,
  });

  return (
    <div>
      {!window.location.origin.startsWith('https://portal.') && (
        <div className="w-full items-center bg-red200 py-2 text-center text-xs lg:text-sm">
          <span className="font-semibold">
            This is a development environment. Any User/Player data reflected
            here is probably inaccurate, and any changes will not be reflected
            for your actual User/Player accounts.
          </span>
        </div>
      )}
      <div
        className="z-50 h-16 w-full bg-grey900"
        role="navigation"
        aria-label="Main"
      >
        <div className="relative mx-auto flex h-full w-full items-center justify-between px-[5%] sm:w-11/12 sm:justify-start sm:p-0 lg:w-3/4">
          <Link
            href={{
              pathname: '/',
            }}
            className="order-2 m-0 h-full w-max transition-all sm:mx-2 sm:inline-block sm:h-full"
          >
            <LeagueLogo
              league="shl"
              className="relative top-[5%] h-[90%] sm:top-[2.5%]"
            />
          </Link>
          <div
            className={classnames(
              !drawerVisible && 'hidden',
              'absolute top-16 left-0 z-50 order-1 h-auto w-full flex-col bg-grey800 sm:relative sm:top-0 sm:order-3 sm:flex sm:h-full sm:w-auto sm:flex-row sm:bg-[transparent]',
            )}
          >
            {loggedIn && (
              <>
                {status && status !== 'retired' ? (
                  <Link
                    href="/player"
                    _hover={{ textDecoration: 'none' }}
                    className="!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max"
                  >
                    Player
                  </Link>
                ) : (
                  <Link
                    href="/create"
                    _hover={{ textDecoration: 'none' }}
                    className="!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max"
                  >
                    Create
                  </Link>
                )}
              </>
            )}
            <Link
              href="/teams"
              _hover={{ textDecoration: 'none' }}
              className="!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max"
            >
              Teams
            </Link>

            <Link
              href="/bank"
              _hover={{ textDecoration: 'none' }}
              className="!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max"
            >
              Bank
            </Link>

            <Link
              href="/search"
              _hover={{ textDecoration: 'none' }}
              className="!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max"
            >
              Search
            </Link>

            <Link
              href="/player/build"
              _hover={{ textDecoration: 'none' }}
              className="!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max"
            >
              Build Tool
            </Link>

            {loggedIn && (
              <RoleGuard
                userRoles={[
                  'SHL_GM',
                  'SMJHL_GM',
                  'SHL_HO',
                  'SMJHL_HO',
                  'SMJHL_INTERN',
                  'IIHF_COMMISSIONER',
                  'IIHF_HO',
                  'SHL_COMMISSIONER',
                  'SMJHL_COMMISSIONER',
                  'PT_GRADER',
                ]}
              >
                <Menu>
                  <MenuButton className="!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max">
                    Jobs
                  </MenuButton>
                  <MenuList>
                    <PermissionGuard userPermissions="canApprovePlayers">
                      <MenuItem>
                        <Link href="/head-office">Head Office</Link>
                      </MenuItem>
                    </PermissionGuard>
                    <PermissionGuard userPermissions="canAssignPlayerIIHFNation">
                      <MenuItem>
                        <Link href="/head-office/iihf">IIHF Head Office</Link>
                      </MenuItem>
                    </PermissionGuard>
                    <PermissionGuard userPermissions="canHandleTeamTransactions">
                      <MenuItem>
                        <Link href="/manager">General Manager</Link>
                      </MenuItem>
                    </PermissionGuard>
                    <PermissionGuard userPermissions="canApprovePlayers">
                      <MenuItem>
                        <Link href="/approvals">Approvals</Link>
                      </MenuItem>
                    </PermissionGuard>
                    <PermissionGuard userPermissions="canAdjustPlayerTPE">
                      <MenuItem>
                        <Link href="/tpe">TPE Management</Link>
                      </MenuItem>
                    </PermissionGuard>
                  </MenuList>
                </Menu>
              </RoleGuard>
            )}
          </div>
          <div className="inline-block sm:hidden">
            <Hamburger
              toggled={drawerVisible}
              toggle={() =>
                setDrawerVisible((currentVisibility) => !currentVisibility)
              }
              color="#F8F9FA"
              size={24}
            />
          </div>
          <div className="relative order-3 mr-4 flex items-center space-x-3 sm:mr-[2%] sm:ml-auto sm:w-auto">
            {!loggedIn && showAuthButtons && (
              <Button onClick={() => router.push('/login')}>Log In</Button>
            )}
            {loggedIn && showAuthButtons && (
              <>
                <RoleGuard userRoles={'PORTAL_MANAGEMENT'}>
                  <SudoButton />
                </RoleGuard>
                <Menu isLazy>
                  <MenuButton className="space-x-1 font-mont text-grey100 hover:underline">
                    {data?.username}
                    <ChevronDownIcon />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                  </MenuList>
                </Menu>
                <Avatar size="sm" name={data?.username} src={data?.avatar} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
