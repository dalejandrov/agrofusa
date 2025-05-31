'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.25,
      },
    },
  }

  const itemFadeInUpVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  }

  const logoVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      y: -50,
      rotateY: -90,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12,
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } },
  }

  return (
    <>
      <Header />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-20 min-h-screen flex flex-col items-center justify-center
                   bg-gradient-to-br from-green-50 via-green-100 to-white
                   px-6 py-12 text-center overflow-hidden"
      >
        <motion.div
          variants={logoVariants}
          className="mb-6 sm:mb-8 md:mb-10"
          whileHover={{
            scale: 1.05,
            rotateY: 5,
            transition: { type: 'spring', stiffness: 300, damping: 10 },
          }}
        >
          <Image
            src="/images/logo.png"
            alt="Logo Agrofusa"
            width={200}
            height={200}
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72
                       drop-shadow-2xl object-contain filter brightness-110 contrast-105"
            priority
          />
        </motion.div>

        <motion.h1
          variants={itemFadeInUpVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold
                     text-green-800 mb-2 sm:mb-3 md:mb-4 px-4"
        >
          Agrofusa
        </motion.h1>

        <motion.p
          variants={itemFadeInUpVariants}
          className="text-sm sm:text-base md:text-lg text-green-700 mb-6 sm:mb-8
                     md:mb-10 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4"
        >
          Tu plataforma inteligente para la gestión avanzada de cultivos.
        </motion.p>
      </motion.div>
    </>
  )
}
