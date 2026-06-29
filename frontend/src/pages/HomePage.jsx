import NoChatSelected from '../components/NoChatSelected';
import Sidebar from '../components/Sidebar'
import { useChatStore } from '../stores/useChatStore'
import ChatContainer from '../components/ChatContainer';

const HomePage = () => {
  const {selectedUser} = useChatStore();
  return (
    <div>
      <Sidebar/>
      {selectedUser?<ChatContainer/>:<NoChatSelected/>}
    </div>
  )
}

export default HomePage