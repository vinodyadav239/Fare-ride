export default function RideStatus({ ride }) {
    if (!ride) return <p className="text-gray-500">No active rides</p>;
  
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <h3 className="font-bold">Ride Status</h3>
        <p>ID: {ride.id}</p>
        <p>Status: {ride.status}</p>
        {ride.driver && <p>Driver: {ride.driver.name}</p>}
      </div>
    );
  }
  