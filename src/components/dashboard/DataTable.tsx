import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from '@/components/ui/table'
  import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
  
  export default function DataTable({ data }: { data: any[] }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Eventos de Captura</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Temp (°C)</TableHead>
                <TableHead>Hum (%)</TableHead>
                <TableHead>H₂ (MQ)</TableHead>
                <TableHead>Radiación</TableHead>
              </TableRow>
            </TableHeader>
  
            <TableBody>
              {data.map(ev => (
                <TableRow key={ev.id}>
                  <TableCell>{`${ev.capture_date} ${ev.capture_hour}`}</TableCell>
                  <TableCell>{ev.temperature_dht22.toFixed(1)}</TableCell>
                  <TableCell>{ev.humidity_dht22.toFixed(1)}</TableCell>
                  <TableCell>{ev.hydrogen_mq.toFixed(1)}</TableCell>
                  <TableCell>{ev.radiation.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }
  