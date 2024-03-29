import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { UserContext } from "../../context/AuthContext";
import { AccountType } from "../../context/UserAccoutContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup, updateUser, googleSignin, signout } = useContext(UserContext);
  const { userDataInsert } = useContext(AccountType);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null])
      .required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  //   Sign up
  const onSubmit = (data) => {
    console.log(data);
    data.status = 'unverified'

    // Sign up with email and password
    signup(data.email, data.password)
      .then((result) => {
        const userInfo = {
          displayName: data.name,
        };

        updateUser(userInfo)
          .then(() => {})
          .catch((error) => console.log(error));

        const user = result.user;
        const currentUser = {
          email: user.email,
        };

        // Jwt Authentication
        fetch("https://next-car-inky.vercel.app/jwt", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(currentUser),
        })
          .then((res) => {
            if (res.status === 401 || res.status === 403) {
              return signout();
            }
            return res.json();
          })
          .then((data) => {
            console.log(data);
            // set the value in local storage
            localStorage.setItem("token", data.token);
            navigate(from, { replace: true });
          })

          .catch((err) => console.log(err));

        console.log(result);
        toast.success("Sign up successfully!");
      })
      .catch((error) => {
        toast.error(error.message);
      });

    userDataInsert(data)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  // Sign up with google
  const handleGoogleSignin = () => {
    googleSignin()
      .then((result) => {
        console.log(result);
        toast.success("Sign up successfully!");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="hero h-[80vh] w-full mt-16 mb-36">
        <div className="hero-content w-full flex-col">
          <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
            <form onSubmit={handleSubmit(onSubmit)} className="card-body">
              <h2 className="text-center text-xl">Sign Up </h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Name"
                  className={`input input-bordered ${
                    errors.name ? "input-error" : "input-accent"
                  }`}
                />
                <small className="text-red-500">{errors.name?.message}</small>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="text"
                  {...register("email")}
                  placeholder="Email"
                  className={`input input-bordered ${
                    errors.email ? "input-error" : "input-accent"
                  }`}
                />
                <small className="text-red-500">{errors.email?.message}</small>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  className={`input input-bordered ${
                    errors.password ? "input-error" : "input-accent"
                  }`}
                />
                <small className="text-red-500">
                  {errors.password?.message}
                </small>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Confirm Password"
                  className={`input input-bordered ${
                    errors.confirmPassword ? "input-error" : "input-accent"
                  }`}
                />
                <small className="text-red-500">
                  {errors.confirmPassword?.message}
                </small>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Accout Type</span>
                </label>

                <select
                  {...register("accountType")}
                  className="select select-bordered w-full"
                >
                  <option selected>Buyer</option>
                  {/* <option>Seller</option> */}
                </select>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary text-white bg-gradient-to-r from-secondary to-primary">
                  Sign Up
                </button>
              </div>
              <label className="text-center">
                <span className="label-text-alt mr-2">
                  All ready have an accout?
                </span>
                <Link
                  to='/login'
                  className="label-text-alt link link-hover text-secondary"
                >
                  Login Here
                </Link>
              </label>

              {/* <div className="divider">OR</div> */}
            </form>
            {/* <div className="form-control">
              <button
                onClick={handleGoogleSignin}
                className="btn mb-8 mx-8 border-gray-500 no-animation hover:text-white font-semibold text-gray-600 border-2 bg-transparent"
              >
                CONTINUE WITH GOOGLE
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
