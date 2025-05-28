import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthContext();

  // Navigation items based on user role
  const navigation = [
    user?.role === 'ADMIN'
      ? { name: 'Panel Config', href: '/panel-config' }
      : null,
    { name: 'Tabulador', href: '/' },
    user?.role === 'ADMIN'
      ? { name: 'Panel Admin Envíos', href: '/panelAdmin' }
      : null,
          user?.role === 'ADMIN'
      ? { name: 'Gestión de Usuarios', href: '/refresh-user-admin' }
      : null,
    { name: 'Panel de Envío', href: '/panel-user' },
  ].filter((item) => item !== null);

  // Detect scroll for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={` top-0 w-full z-50 transition-all duration-300 bg-white/90`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Image
                src="/logo.png"
                alt="GhalMaca Transporte"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </motion.div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <motion.div key={item.name} whileHover={{ y: -2 }}>
              <Link
                href={item.href}
                className="relative text-sm font-medium text-primary group"
              >
                {item.name}
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex flex-1 items-center justify-end gap-x-6">
          {user ? (
            <>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:block text-sm font-medium text-primary"
              >
                Bienvenido, {user.firstName}
              </motion.span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="rounded-md bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-white shadow-md transition-all"
              >
                Cerrar sesión
              </motion.button>
            </>
          ) : (
            <>
              <motion.div whileHover={{ y: -2 }}>
                <Link
                  href="/login"
                  className="hidden lg:block text-sm font-medium text-primary relative group"
                >
                  Iniciar sesión
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                  />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="rounded-md bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-white shadow-md transition-all"
                >
                  Registrarse
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            className="p-2 text-primary"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menú</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu Dialog */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white/95 shadow-2xl backdrop-blur-lg px-6 py-6 sm:max-w-sm"
            >
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/logo.png"
                    alt="GhalMaca Transporte"
                    width={140}
                    height={42}
                    className="h-10 w-auto"
                  />
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="p-2 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Cerrar menú</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </motion.button>
              </div>

              {user && (
                <div className="mt-6 border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-500">Bienvenido</p>
                  <p className="text-base font-medium text-primary">
                    {user.firstName}
                  </p>
                </div>
              )}

              <div className="mt-6 flow-root">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <motion.div
                      key={item.name}
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 text-base font-medium text-primary border-b border-gray-100"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {!user ? (
                  <div className="flex flex-col gap-3 mt-8">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 text-primary border border-primary rounded-md font-medium"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 bg-primary text-white rounded-md font-medium shadow-md"
                    >
                      Registrarse
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-8 text-center py-2.5 bg-primary text-white rounded-md font-medium shadow-md"
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
