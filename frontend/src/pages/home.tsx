import axios from "axios";
import { useEffect, useState } from "react";
import Card from "../components/card";
import socket from "../socket";

export function Home() {
  const [dishList, setDishList] = useState([{}]);

  useEffect(() => {
    try {
      axios.get("http://localhost:3000/getList").then((e) => {
        setDishList(e.data.data);
        console.log(e.data.data);
      });
      socket.on("dishUpdated", (message) => {
        console.log("pratham is cool");
        console.log(message);
        setDishList((dishes) =>
          dishes.map((dish: any) =>
            dish.dishId === message.dishId ? message : dish
          )
        );
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <>
      <div className="w-screen h-screen flex flex-col">
        {dishList.map((dish: any) => (
          <Card key={dish.dishId} dish={dish} />
        ))}
      </div>
    </>
  );
}
