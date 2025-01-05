import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser, resetAuthState } from "../../features/authSlice"; 
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./authStyle.css";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user, adminAuthenticated, isAuthenticated } = useSelector((state) => state.auth);

    // Validation Schema using Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Email is required").email("Invalid email address"),
        password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
    try {
        await dispatch(loginUser(values))
        .then((response) => {
            toast.error(error)
        })
    } catch (error) {
    } finally {
        setSubmitting(false);
    }
};


    useEffect(() => {
        if (user) {
            if (user.role === "admin" && adminAuthenticated) {
                navigate("/admin/dashboard");
            } else if (isAuthenticated) {
                navigate("/");
            }
            else{
                navigate('/login')
            }
        }

        if (error === 'Invalid email or password') {
            toast.error(error);
            
        }
    }, [user, error, navigate]);

    
    useEffect(() => {
        dispatch(resetAuthState())
        toast.info("Please Login With Your Credentials");
    }, [dispatch]);

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
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form className="form">
                        <div className="logo">
                            <img src="/logo/logo.png" alt="Logo" />
                        </div>
                        <h2 id="welcomeMessage">Welcome Back!</h2>
                        <Field type="email" name="email" placeholder="Email" />
                        <ErrorMessage name="email" component="div" className="error-message" />
                        <Field type="password" name="password" placeholder="Password" />
                        <ErrorMessage name="password" component="div" className="error-message" />
                        <button type="submit" disabled={isSubmitting || loading}>
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                        {errors.login && <div className="error-message">{errors.login}</div>}
                        <p>
                            No Account?{" "}
                            <Link className="link" to={"/signin"}>
                                Create Account
                            </Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Login;
