'use client'

import useSWR from 'swr'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitlePlugin,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitlePlugin,
  Tooltip,
  Legend
)

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  })

interface Event {
  capture_date: string
  capture_hour: string
  temperature_dht22: number
  humidity_dht22: number
  hydrogen_mq: number
  radiation: number
}

interface ChartApiProps {
  title: string
  /** Debe incluir from, to y station en la URL */
  apiUrl: string
}

export default function Chart({ title, apiUrl }: ChartApiProps) {
  const { data: events, error } = useSWR<Event[]>(apiUrl, fetcher, {
    refreshInterval: 10000,
  })

  if (error) return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>❌ Error: {error.message}</CardContent>
    </Card>
  )
  if (!events) return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>⌛ Cargando…</CardContent>
    </Card>
  )

  // Preparar arrays para Chart.js
  const labels = events.map(e => `${e.capture_date} ${e.capture_hour}`)
  const tempData = events.map(e => e.temperature_dht22)
  const humData  = events.map(e => e.humidity_dht22)
  const h2Data   = events.map(e => e.hydrogen_mq)
  const radData  = events.map(e => e.radiation)

  // Si quieres un solo Chart (temp & hum):
  const dataTH = {
    labels,
    datasets: [
      { label: 'Temp (°C)', data: tempData, fill: false, tension: 0.3 },
      { label: 'Hum (%)',   data: humData,  fill: false, tension: 0.3 },
    ],
  }
  // Y otro para H2 & Radiación:
  const dataHR = {
    labels,
    datasets: [
      { label: 'H₂ (MQ)',     data: h2Data,  fill: false, tension: 0.3 },
      { label: 'Radiación',   data: radData, fill: false, tension: 0.3 },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Fecha y Hora' } },
      y: { title: { display: true, text: 'Valor' }, beginAtZero: true },
    },
    plugins: {
      title:    { display: true, text: title },
      legend:   { position: 'bottom' },
      tooltip:  { enabled: true },
    },
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="h-80">
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className="h-full">
          <div className="h-full">
            {title.includes('H₂')
              ? <Line data={dataHR} options={options} />
              : <Line data={dataTH} options={options} />
            }
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
