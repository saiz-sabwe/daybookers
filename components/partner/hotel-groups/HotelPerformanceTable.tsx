"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HotelPerformance {
  hotelId: string;
  hotelName: string;
  bookings: number;
  revenue: number;
  occupancyRate: number;
}

interface HotelPerformanceTableProps {
  hotels: HotelPerformance[];
  currency?: string;
}

export function HotelPerformanceTable({ hotels, currency = "USD" }: HotelPerformanceTableProps) {
  if (hotels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performances par hôtel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performances par hôtel</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hôtel</TableHead>
              <TableHead className="text-right">Réservations</TableHead>
              <TableHead className="text-right">Revenus</TableHead>
              <TableHead className="text-right">Taux d'occupation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel.hotelId}>
                <TableCell className="font-medium">{hotel.hotelName}</TableCell>
                <TableCell className="text-right">{hotel.bookings}</TableCell>
                <TableCell className="text-right">
                  {currency === "USD" ? "$" : currency} {hotel.revenue.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">{hotel.occupancyRate.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

