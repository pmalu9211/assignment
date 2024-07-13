import axios from "axios";
import { useState } from "react";
import socket from "../socket";

export default function Card({ dish }: any) {
  socket.on("connect", () => {
    console.log(socket.connected); // true
  });
  const path = window.location.pathname;
  const { imageUrl, dishName, isPublished } = dish;
  const [isPublic, setIsPublic] = useState(isPublished);
  console.log(dish);

  const onChangeHandler = (value: number) => {
    const setter = value === 1;

    try {
      axios.post("http://localhost:3000/togglePublish/" + dish.dishId, {
        value: setter,
      });
      setIsPublic(setter);
    } catch (e) {
      console.log(e);
    }
  };
  console.log(dish.dishId, isPublic);
  return (
    <>
      {(path === "/" && isPublished) || path === "/admin" ? (
        <div className="mt-8 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img className="rounded-t-lg" src={imageUrl} alt="" />
          </a>
          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {dishName}
              </h5>
            </a>
            {path === "/admin" ? (
              <>
                <div className="bg-white text-black mt-4">
                  <div>Toggel public</div>
                  <select
                    className=""
                    onChange={(e) => {
                      onChangeHandler(Number(e.target.value));
                    }}
                    defaultValue={isPublished ? 1 : 2}
                  >
                    <option value={1}>True</option>
                    <option value={2}>False</option>
                  </select>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
