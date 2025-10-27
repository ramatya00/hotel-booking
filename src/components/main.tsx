import { getRooms } from "@/lib/data";
import Card from "./card";
import { notFound } from "next/navigation";

export default async function Main() {
  const rooms = await getRooms();
  if (!rooms) return notFound();
  return (
    <div className="max-w-screen-xl py-6 pb-20 px-4 mx-auto">
      <div className="grid gap-7 md:grid-cols-3 ">
        {rooms.map((room) => (
          <Card key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
