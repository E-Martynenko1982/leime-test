import { Link } from '@heroui/link';
import { Navbar as HeroUINavbar, NavbarItem } from '@heroui/navbar';
import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <HeroUINavbar className="flex gap-2 justify-left ml-2">
      <NavbarItem>
        <Link
          className={clsx(
            linkStyles({ color: isActive('/') ? 'primary' : 'foreground', underline: 'hover' }),
            'data-[active=true]:text-primary data-[active=true]:font-medium',
          )}
          color="foreground"
          href="/"
        >
          Table
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link
          className={clsx(
            linkStyles({
              color: isActive('/list') ? 'primary' : 'foreground',
              underline: 'hover',
            }),
            'data-[active=true]:text-primary data-[active=true]:font-medium',
          )}
          color="foreground"
          href="/list"
        >
          List
        </Link>
      </NavbarItem>
    </HeroUINavbar>
  );
};
