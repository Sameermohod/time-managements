import React, { useState } from "react";
import { Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useForm } from "react-hook-form";
import Icon from "react-icons-kit";

const SignDV = () => {
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    // Implement your login logic here
  };

  return (
    <>
      <div className="grid md:grid-cols-2 sm:grid-cols-1">
        <div className="lg:w-[100%]">
          <Link to="/">
            <img
              className="xl:ms-14 xl w-24 lg:ms- lg:mt- lg:md: md:mt- md:mb- sm: sm: sm:mb- mt-4"
              src="./datvisual.png"
              alt="my img"
            />
          </Link>
          <main className="grid grid-col justify-items-center">
            <form
              className="lg:w-7/12 font-[JejuMyeongjo]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className="pb-5 text-3xl font-bold text-center">
                Login Here !
              </h1>
              <section className="mb-4">
                <Input
                  variant="standard"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                      message: "Please enter a valid email",
                    },
                  })}
                  color="black"
                  label="Email*"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </section>
              <br />
              <div className="mb-4 flex justify-end">
                <Input
                  type={type}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[a-zA-Z]).{8,}$/gm,
                      message: `- At least 8 characters \n- Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n- Can contain special characters`,
                    },
                  })}
                  variant="standard"
                  color="black"
                  label="Password*"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="flex justify-around items-center"
                  onClick={handleToggle}
                >
                  <Icon className="absolute mr-10" icon={icon} size={25} />
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <br />
              <br />
              <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  text-white font-bold p-2 rounded-xl w-full">
                Login
              </button>
            </form>
          </main>
        </div>
        <div className="lg:w-full lg:h-screen xl:w-full xl:h-screen md:w-full md:h-screen">
          <img
            src="https://images.unsplash.com/photo-1655721530222-884d311f4b56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80"
            className="relative lg:w-full lg:h-screen xl:w-full xl:h-screen  w-0 md:w-full md:h-screen"
            alt="myimg"
          />
        </div>
      </div>
    </>
  );
};

export default SignDV;