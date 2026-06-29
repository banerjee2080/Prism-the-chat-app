import { useState } from 'react'
import { useAuthStore } from '../stores/useAuthStore';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [formData,setFromData]=useState({
    fullName:"",
    email:"",
    password:""
  });
  const [showPassword,setShowPassword]=useState(false);
  const { isSigningUp, signup }= useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if(success)signup(formData);
  }


  return (
    <div>
      <div>
        <h2>Sign-Up</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={formData.fullName}
          onChange={(e) => {
            setFromData({ ...formData, fullName: e.target.value });
          }}
        />
        <input
          type="email"
          placeholder="Enter Your email"
          value={formData.email}
          onChange={(e) => {
            setFromData({ ...formData, email: e.target.value });
          }}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Your password"
          value={formData.password}
          onChange={(e) => {
            setFromData({ ...formData, password: e.target.value });
          }}
        />
        <button
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        >
          eye
        </button>
        <button type="submit">
          {isSigningUp ? <>Loading....</> : <>Sign up</>}
        </button>
      </form>

      <div className="text-center">
        <p className="text-base-content/60">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage