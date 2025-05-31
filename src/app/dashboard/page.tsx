// components/dashboard/DashboardPage.tsx
'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Thermometer, Droplet, SunMedium, Wind } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import { DashboardHeader } from '@/components/dashboard/Header'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import DataTable from '@/components/dashboard/DataTable'
import Chart from '@/components/dashboard/Chart'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// Define types explicitly for better TS inference
export type Station = { id: string; name: string }
export type EventRecord = {
  id: string
  capture_date: string
  capture_hour: string
  temperature_dht22: number
  humidity_dht22: number
  hydrogen_mq: number
  radiation: number
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error: any = new Error('Error al obtener datos')
    error.info = await res.json()
    error.status = res.status
    throw error
  }
  return res.json()
}

export default function DashboardPage() {
  // Authentication
  const { data: session, status } = useSession()
  const router = useRouter()

  // Date range: last 7 days
  const today = new Date()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const [startDate, setStartDate] = useState<string>(
    weekAgo.toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState<string>(
    today.toISOString().split('T')[0]
  )

  // Load stations
  const {
    data: stations = [],
    error: errStations,
  } = useSWR<Station[]>('/api/stations', fetcher)
  const [stationId, setStationId] = useState<string>('')

  // Build events API URL
  const apiUrl = stationId
    ? `/api/capture-events?from=${startDate}&to=${endDate}&station=${stationId}`
    : null

  // Load events
  const {
    data: events = [],
    error: errEvents,
    isLoading,
  } = useSWR<EventRecord[]>(apiUrl, fetcher)

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(undefined, { callbackUrl: '/dashboard' })
    }
  }, [status])

  // Set default station on load
  useEffect(() => {
    if (stations.length > 0 && !stationId) {
      setStationId(stations[0].id)
    }
  }, [stations, stationId])

  // Show loading skeleton while auth is loading
  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Skeleton className="h-8 w-48" />
      </main>
    )
  }

  // Don't render page if unauthenticated (will redirect)
  if (!session) return null

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="mt-16 p-4 md:p-6 lg:p-8 flex-1 overflow-auto space-y-6">
          {/* Filters */}
          <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Station selector */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <label htmlFor="station" className="text-sm font-medium">
                  Estación:
                </label>
                {errStations ? (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      No se cargaron estaciones.
                    </AlertDescription>
                  </Alert>
                ) : !stations.length ? (
                  <Skeleton className="h-10 w-40" />
                ) : (
                  <Select
                    value={stationId}
                    onValueChange={setStationId}
                  >
                    <SelectTrigger
                      id="station"
                      className="w-40"
                    >
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {/* Date pickers */}
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <label htmlFor="from" className="text-sm font-medium">
                    Desde:
                  </label>
                  <Input
                    id="from"
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                    className="w-full sm:w-36"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="to" className="text-sm font-medium">
                    Hasta:
                  </label>
                  <Input
                    id="to"
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                    className="w-full sm:w-36"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Card key={idx} className="p-4">
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-8 w-20" />
                  </Card>
                ))}
              </div>
            ) : errEvents ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  No se cargaron las lecturas.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Temperature */}
                <Card>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-sm">
                      Temperatura
                    </CardTitle>
                    <Thermometer className="h-5 w-5 text-red-500" />
                  </CardHeader>
                  <CardContent className="text-2xl font-bold">
                    {events[0]?.temperature_dht22?.toFixed(1) ||
                      '–'}
                    °C
                  </CardContent>
                </Card>
                {/* Humidity */}
                <Card>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-sm">
                      Humedad
                    </CardTitle>
                    <Droplet className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent className="text-2xl font-bold">
                    {events[0]?.humidity_dht22?.toFixed(1) ||
                      '–'}
                    %
                  </CardContent>
                </Card>
                {/* Radiation */}
                <Card>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-sm">
                      Radiación
                    </CardTitle>
                    <SunMedium className="h-5 w-5 text-yellow-500" />
                  </CardHeader>
                  <CardContent className="text-2xl font-bold">
                    {events[0]?.radiation?.toFixed(1) || '–'}
                  </CardContent>
                </Card>
                {/* Hydrogen */}
                <Card>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-sm">
                      H₂ (MQ)
                    </CardTitle>
                    <Wind className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent className="text-2xl font-bold">
                    {events[0]?.hydrogen_mq?.toFixed(1) ||
                      '–'}
                  </CardContent>
                </Card>
              </div>
            )}
          </section>

          {/* Charts */}
          <section>
            {apiUrl &&
              (isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Skeleton className="h-60 w-full rounded-lg" />
                  <Skeleton className="h-60 w-full rounded-lg" />
                </div>
              ) : errEvents ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    No se pudieron cargar gráficos.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Chart
                    title="Temp. & Hum."
                    apiUrl={apiUrl}
                  />
                  <Chart
                    title="H₂ & Radiación"
                    apiUrl={apiUrl}
                  />
                </div>
              ))}
          </section>

          {/* Data Table */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Datos Históricos</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-72 w-full" />
                ) : errEvents ? (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      No se cargaron los datos de la tabla.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-auto">
                    <DataTable data={events} />
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
