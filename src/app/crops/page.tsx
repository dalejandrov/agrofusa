'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

type Crop = {
  id: string;
  type: string;
  cycleName: string;
};

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/crops')
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Crop[]) => setCrops(data))
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message || 'Ocurrió un error desconocido');
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 90 } },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-800 mb-6 sm:mb-8 text-center">
          Listado de Cultivos
        </h1>

        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <p className="text-center text-red-600 bg-red-50 rounded-lg p-4 border border-red-200">
              Error cargando cultivos: {error}
            </p>
          </div>
        )}

        {!error && crops === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Card key={idx} className="animate-pulse border border-green-200 rounded-lg">
                <CardHeader className="p-4">
                  <CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!error && crops && crops.length === 0 && (
          <div className="max-w-2xl mx-auto mt-8">
            <p className="text-center text-gray-700 bg-gray-100 rounded-lg p-6 border border-gray-200 text-lg shadow">
              No se encontraron cultivos en este momento.
            </p>
          </div>
        )}

        {!error && crops && crops.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {crops.map(crop => (
              <motion.div key={crop.id} variants={itemVariants} className="h-full">
                <Card className="border border-green-200 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:border-green-400 hover:scale-[1.03] h-full flex flex-col">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg font-semibold text-green-900 leading-tight">
                        {crop.type}
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs whitespace-nowrap shrink-0 font-medium">
                        {crop.cycleName}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-sm text-gray-600 truncate" title={`ID: ${crop.id}`}>
                      ID: {crop.id}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
