import React,{useState,useEffect, use} from "react";
import { useDispatch,useSelector } from "react-redux";
import Navbar from "./Navbar";
import "../styles/SideChat.css"
import logo from "../assets/logo3.png"; 
import EditNoteIcon from '@mui/icons-material/EditNote';
import Chatwindow from "./ChatWindow";
import { getThreads,deleteThread,resetChat,getThreadById,setActiveThread } from "../features/chat/chatSlice";
import DeleteIcon from '@mui/icons-material/Delete';





export default function SideChat(){
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
     const [activeThread, setActiveThread] = useState(null);
    const dispatch = useDispatch();
   
    const { threads, status } = useSelector((state) => state.chat);
    useEffect(() => {
        
        dispatch(getThreads());

        const interval=setInterval(()=>{
            dispatch(getThreads())

return () => clearInterval(interval); 
    },5000)
      }, [dispatch]);

      
    // ✅ NEW: Handler for “New Chat” button
  const handleNewChat = () => {
    dispatch(resetChat());
    setActiveThread(null);
  };


  useEffect(() => {
    if (activeThread) {
      dispatch(getThreadById(activeThread));
    }
  }, [ activeThread, dispatch]);
//   activeThread

// activeThread,
// const handleThreadClick = (threadId) => {
//     setActiveThread(threadId);
//     dispatch(getThreadById(threadId));
// };


const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
};
    return(
        <>
      
         <div className="mainPage">
          <Navbar toggleSidebar={toggleSidebar}/>
      
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
            <div className="sidebar-box">
                <div className="sidebar-top">
          <img src={logo} alt="logo" className="logo"  style={{ width: "40px", height: "40px" }}/>
           <EditNoteIcon className="edit-note"
           sx={{
            fontSize:40,
            cursor:"pointer",
            transformBox:"scale(1.5)",
            
            
           }}
       onClick={handleNewChat}
           />
           </div>


           {/* {history section in sidebar} */}
           <div >
            <ul className="history-section">
                {/* <li>History 1</li>
                <li>History 2</li>
                <li>History 3</li>
                <li>History 4</li>
                <li>History 5</li> */}
               
   
              {threads.length === 0 ? (
                <li className="empty">No chats yet</li>
              ) : (
                threads.map((thread) => (
                  <li
                    key={thread.threadId}
                    className={activeThread === thread.threadId ? "active" : ""}
                    onClick={() =>{

                         setActiveThread(thread.threadId)
                        dispatch(setActiveThread(thread.threadId));}}
                    // onClick={() => handleThreadClick(thread.threadId)}
                  >
                    <div className="list-styles">
                    {thread.messages[0].content}

                    <span className="delete-icon"><DeleteIcon 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent selecting thread
                        dispatch(deleteThread(thread.threadId))
                      dispatch(resetChat())
                        }}
 
                    /></span>
                    </div>
                  </li>

                ))
              )}
            


            </ul>
           </div>


            </div>

        </div>



         <div className={`chat-window ${isSidebarOpen && window.innerWidth > 768 ? "shifted" : ""} ${isSidebarOpen && window.innerWidth <= 768 ? "dimmed" : ""}`} >
        {/* Main chat content goes here */}
        <h1>Welcome to ChatGPT</h1>
        <p style={{ textAlign: "center" ,fontSize:"20px"}}>Your personal assistant.</p>

        <Chatwindow></Chatwindow>
      </div>
    








{/* className={`chat-window ${isSidebarOpen ? "shifted" : ""}`} */}








        </div>

        </>
    )
}
