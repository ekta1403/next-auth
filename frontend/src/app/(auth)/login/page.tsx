"use client"

import axios from "axios"
import { ChangeEvent, FormEvent, useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}


export default function Login (){
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password:""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
        setFormData({
            ...formData, [e.target.name]:e.target.value,
        });
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            const response = await axios.post("http://localhost:22000/api/user/login",formData)

            if(response.status === 200) {
                alert("Login successful");
            }else{
                alert(response.data.error || "Login failed.... try again ..!")
            }
        }catch(error:unknown){
           if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(error.response.data.error || "Error logging in");
        } else {
          alert("Error logging in");
        }
      } else {
        alert("An unexpected error occurred");
      } 
        }
    }


     return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-black mb-4">
          Login
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-orange-400 text-black py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}