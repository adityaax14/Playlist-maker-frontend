import React from "react";

const BASE_URL = import.meta.env.VITE_API_URL + "/api/v2/users";

export const registerUser = async (data) => {
 const res = await fetch(`${BASE_URL}/register`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include",
  body: JSON.stringify(data)
});


  if (!res.ok) {
  const error = await res.text();
  throw new Error( "User already exists");
}

return res.json();

};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data)
  });

  if (!res.ok) {
  const error = await res.text();
  throw new Error("Invalid username or password");
}

return res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include"
  });

  if (!res.ok) {
  const error = await res.text();
  throw new Error(error);
}

return res.json();

};

export const getCurrentUser = async () => {
  const res = await fetch(`${BASE_URL}/current-user`, {
    credentials: "include"
  });

 

if (!res.ok) {
  const error = await res.text();
  throw new Error(error);
}

return res.json();


};
