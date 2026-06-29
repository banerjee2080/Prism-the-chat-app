import { useAuthStore } from '../stores/useAuthStore';
import { useState } from 'react'

const LoginPage = () => {
  const { login, isLoggingin } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  }
  
  return (
    <div>
      <div>
        <h2>Signin</h2>
        <form onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='you@example.com'
            value={formData.email}
            onChange={(e) => {setFormData({...formData,email:e.target.value})}}
          />
          <input
            type={showPassword?"text":"password"}
            value={formData.password}
            placeholder='Enter your password'
            onChange={(e) => {setFormData({...formData, password:e.target.value})}}
          />
          <button onClick={() => {setShowPassword(!showPassword)}}>eye</button>
          <button type='submit' disabled={isLoggingin}>
            {isLoggingin?<>
              Loading...
            </>:<>
              Login
            </>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage