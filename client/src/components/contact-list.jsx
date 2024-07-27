import { useAppStore } from "@/store"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constant.js";
const ContactList = ({contacts,isChannel = false}) => {
  const {selectedChatData,setSelectedChatData, setSelectedChatType, selectedChatType,setSelectedChatMessages,} = useAppStore();
  const handleClick =(contact)=>{
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
        setSelectedChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {
       contacts.map((item)=>(
        <div key={item._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
          ${selectedChatData && (selectedChatData._id === item._id) ? 
            "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`} onClick={()=> handleClick(item)}>
              <div className="flex gap-5 items-center justify-start text-neutral-300">
                {
                  !isChannel && (
                    <Avatar className="h-10 w-10  rounded-full overflow-hidden">
                          {
                              item.image ? (<AvatarImage src ={`${HOST}/${item.image}`} alt ="profile" className="object-cover w-full h-full bg-black"/> ): 
                              (<div className={`${selectedChatData && selectedChatData._id === item._id ?
                                 "bg-[ffffff22] border border-white/70":getColor(item.color)}uppercase h-10 w-10  text-lg border-[1px] flex items-center justify-center rounded-full `}>
                              {item.firstName ? item.firstName.split("").shift() : item.email.split("").shift()}
                              </div>)
                          }
                    </Avatar>
                  )
                }
                {
                  isChannel && (<div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>)
                }
                {
                  isChannel ? (<span>{item.name}</span>) : (<span>{item.firstName ?`${item.firstName} ${item.lastName}`:item.email}</span>)
                }
              </div>
            </div>
       ))
      }
    </div>
  );
};

export default ContactList;
