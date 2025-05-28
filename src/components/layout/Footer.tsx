'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { when: 'beforeChildren', staggerChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
}

export function Footer() {
  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-12 bg-white/90 backdrop-blur-sm border-t border-green-200"
    >
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center md:justify-between space-y-6 md:space-y-0">        
        <motion.div variants={itemVariants} className="flex items-center space-x-3">
          <Image
            src="/images/logo.png"
            alt="Logo Agrofusa"
            width={40}
            height={40}
            className="w-10 h-10 object-contain filter brightness-110 contrast-105"
            priority
          />
          <span className="text-lg font-bold text-green-700">Agrofusa</span>
        </motion.div>
      
        <motion.nav
          variants={itemVariants}
          className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600"
        >
          <Link href="/" className="hover:text-green-700 transition-colors">
            Inicio
          </Link>
          <Link href="/crops" className="hover:text-green-700 transition-colors">
            Cultivos
          </Link>
          <Link href="/profile" className="hover:text-green-700 transition-colors">
            Mi Perfil
          </Link>
          <Link href="/settings" className="hover:text-green-700 transition-colors">
            Configuración
          </Link>
        </motion.nav>

        <motion.div variants={itemVariants} className="text-sm text-gray-500">
          © {new Date().getFullYear()} Agrofusa. Todos los derechos reservados.
        </motion.div>
      </div>
    </motion.footer>
  )
}
