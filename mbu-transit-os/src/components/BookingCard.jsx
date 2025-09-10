import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingCard({ onBook }) {
  const [destination, setDestination] = useState("");

  const handleBook = () => {
    const ride = {
      id: Date.now(),
      destination,
      status: "Searching driver...",
    };
    onBook(ride);
  };

  return (
    <Card className="p-6 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Book a Ride</h2>
        <input
          type="text"
          placeholder="Enter Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <Button className="w-full" onClick={handleBook}>Find Auto</Button>
      </CardContent>
    </Card>
  );
}
