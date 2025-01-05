import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./authStyle.css";
import { registerUser } from "../../features/authSlice";

function Signin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.auth);

    // Define Yup validation schema
    const validationSchema = Yup.object({
        username: Yup.string().required("Username Required"),
        email: Yup.string().email("Invalid email address").required("Email Required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password Required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords Must Match")
            .required("Confirm Password Required"),
    });

    return (
        <div className="form-container">
            <ToastContainer
                position="top-center"
                autoClose={350}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
                limit={1}
            />
            <Formik
                initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await dispatch(registerUser(values)).unwrap()
                        .then((response) => {
                            navigate("/login");
                            toast.success("Account Created! You're ready to log.");
                        })
                    } catch (error) {
                        setSubmitting(false);
                        toast.error(error);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="form">
                        <div className="logo">
                            <img src="/logo/logo.png" alt="Logo" />
                        </div>
                        <Field type="text" name="username" placeholder="Username" />
                        <ErrorMessage name="username" component="div" className="error-message" />
                        <Field type="email" name="email" placeholder="Email" />
                        <ErrorMessage name="email" component="div" className="error-message" />
                        <Field type="password" name="password" placeholder="Password" />
                        <ErrorMessage name="password" component="div" className="error-message" />
                        <Field type="password" name="confirmPassword" placeholder="Confirm Password" />
                        <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                        <button type="submit" disabled={isSubmitting || loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                        <p>
                            Have an Account?{" "}
                            <Link className="link" to={"/login"}>
                                Please Login
                            </Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Signin;
