import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

const Navbar = () => {
    const { authUser, logout } = useAuthStore();
  return (
    <div>
        <Link to="/">Chatty</Link>
        <Link to={"/settings"}>Settings</Link>
        {authUser && <>
            <Link to={"/profile"}>Profile</Link>
            <button onClick={logout}>logout</button>
        </>}
    </div>
  )
}

export default Navbar