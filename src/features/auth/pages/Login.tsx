import {  useState, type ChangeEvent, type FormEvent } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { signIn } from "../../../services/operations/auth";
import { ImSpinner3 } from "react-icons/im";
import PopUpMessage from "../../../components/PopupMassage";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(signIn(formData, navigate));
    console.log(formData);
  }

  return (
    <div className="bg-gray-200 h-screen w-screen flex justify-center items-center">
      <div className="bg-white h-11/12 w-11/12 lg:h-[80%] lg:w-[80%]  flex lg:justify-between justify-center rounded-2xl shadow-2xl">
        {/* LEFT DIV */}
        <div className="bg-blue-500 h-full w-9/12 hidden md:flex lg:flex justify-center items-center">
          <div className="">
            <h1 className="text-8xl font-bold font text-white px-1">
              Ticketing
            </h1>
            <p className="text-gray-200 mt-4 text-sm text-center">
              Welcome back to the website!
            </p>
          </div>
        </div>

        {/* RIGHT DIV */}
        <form
          onSubmit={submitHandler}
          className="h-full lg:w-7/12 w-full flex items-center justify-center"
        >
          <div className="flex flex-col lg:w-8/12 w-11/12">
            {/* FIST DIV */}
            <div className="pb-6 ">
              <h1 className="text-3xl text-center font-bold text-sky-500">
                User Login
              </h1>
              <p className="text-center text-gray-500 text-sm pt-2">
                Enter your email and password to access your account.
              </p>
            </div>

            <PopUpMessage/>

            {/* SECOND DIV */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center bg-blue-50 py-3 px-8 rounded-3xl border-2 border-transparent focus-within:border-gray-300">
                <FaUser className="text-xl text-gray-400" />
                <input
                  name="email"
                  required={true}
                  value={formData.email || ""}
                  type="email"
                  placeholder="User email"
                  onChange={onChangeHandler}
                  className="focus:outline-none placeholder:pl-0.5 pl-2 bg-transparent"
                />
              </label>

              <label className="flex items-center bg-blue-50 py-3 px-8 rounded-3xl border-2 border-transparent focus-within:border-gray-300">
                <IoIosLock className="text-2xl text-gray-400" />
                <input
                  name="password"
                  required={true}
                  value={formData.password || ""}
                  type="password"
                  placeholder="Password"
                  onChange={onChangeHandler}
                  className=" focus:outline-none placeholder:pl-0.5 pl-1"
                ></input>
              </label>

              <div className=" flex flex-row-reverse">
                <Link
                  to="/forgot-password"
                  className="text-blue-500  px-3 underline hover:cursor-pointer text-sm"
                >
                  Forgot password
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-10 w-11/12 mx-auto mt-4 font-bold rounded-3xl text-white flex justify-center items-center 
                         bg-blue-400 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? <ImSpinner3 className="animate-spin" /> : "Login"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
