import { IoNotificationsOutline } from "react-icons/io5";
const Header = () => {
  return (
    <div>
        <div className="navbar  fixed bg-gradient-custom ">
  <div className="flex-1">
    
    <div className=' flex items-center gap-1'>
    <img className='  w-32 h-16' src="/public/assets/logo1.png" alt="logo"  />
    
    </div>
  </div>

  
  <div className="flex-none">
    <button className="btn btn-square btn-ghost">
     <IoNotificationsOutline color='white' size={28}/>
    </button>
  </div>
</div>
      
    </div>
  )
}

export default Header
