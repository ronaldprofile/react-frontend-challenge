import { Link } from '@tanstack/react-router'
import { Clapperboard, LogOut, Moon, Sun } from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/authStore'
import { useThemeStore } from '@/features/theme/store/themeStore'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

export function AppHeader() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <Clapperboard className="size-6 text-primary" />
          <span>CineDash</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link
              to="/dashboard"
              activeOptions={{ exact: true }}
              activeProps={{ className: 'text-primary' }}
            >
              Descobrir
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/watchlist" activeProps={{ className: 'text-primary' }}>
              Minha Lista
            </Link>
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Perfil">
                <Avatar className="size-8">
                  <AvatarFallback>{(user?.email ?? 'U').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}