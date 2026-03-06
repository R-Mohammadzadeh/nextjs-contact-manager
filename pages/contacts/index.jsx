import ConntactsInfo from "@/components/contactInfo/ContactsInfo"
import Contact from "@/models/Contact"
import connectDB from "@/utils/connectDB"
import styles from '@/styles/contacts.module.css'
import { useEffect, useState } from "react"
import validateToken from "@/utils/auth"
import { generateContactFilter } from "@/utils/contactHelpers"
import { useRouter } from "next/router"
import { MdOutlineFavoriteBorder , MdFavorite} from "react-icons/md"

export default function Contacts ({ contacts }) {
  const [infoList , setInfoList] = useState(contacts || []);
  const [search , setSearch] = useState('');
  const [gen , setGen] = useState('');
  const [favStatus , setFaveStatus] = useState(false);
  const router = useRouter();

  // Update infoList whenever server-side props change (e.g., after search)
  useEffect(() => {
    setInfoList(contacts);
    setFaveStatus(false); // Reset favorite filter when a new search is performed
  }, [contacts]);

  const clickHandler = async () => {
    // Update URL to trigger getServerSideProps with new filters
    router.push({
        pathname:'/contacts' ,
        query : {gen, search}
    });
  };

  const likeHandler = () => {
    const nextStatus = !favStatus;
    if (nextStatus) {
     const faveContacts = contacts.filter(item => Boolean(item.likes)) ;
     setInfoList(faveContacts)
    } else {
      // Restore the full list from server props
      setInfoList(contacts);
    }
    setFaveStatus(nextStatus);
  };

  return (
    <>
      <div className={styles.search}>
        <input 
          type="text" 
          placeholder="Enter name or family" 
          onChange={(e) => setSearch(e.target.value)} 
          value={search}
          onKeyDown={(e)=>{
            if(e.key === 'Enter') clickHandler()
          }}
        />
        <select onChange={(e) => setGen(e.target.value)} value={gen}>
          <option value="">all</option>
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="others">others</option>
        </select>

        <button onClick={clickHandler}>search</button>
        
        {/* Toggle between outline and filled heart icons */}
        <div onClick={likeHandler} style={{ cursor: 'pointer', display: 'inline-block' }}>
          {favStatus ? 
            <MdFavorite size='35px' color='red' /> : 
            <MdOutlineFavoriteBorder size='35px' color='black' />
          }
        </div>
      </div>

      {infoList.length > 0 ? (
        infoList.map(con => (
          <ConntactsInfo 
            key={con._id} 
            {...con} 
            infoList={infoList} 
            setInfoList={setInfoList} 
          />
        ))
      ) : (
        <p className={styles.noAudience}>No contacts found.</p>
      )}
    </>
  );
}

// ================= SERVER-SIDE AUTH =================


export async function getServerSideProps(context) {
try{
 await connectDB()

 const payload = validateToken(context)
 if(!payload) return {redirect : {destination : '/auth/login'}}
    
const userId = payload.userId
// 4. Run the query using built-in filters.
const filter = generateContactFilter(userId , context.query) ;

const data = await Contact.find(filter).sort({createdAt : -1}).lean()
const contacts = JSON.parse(JSON.stringify(data))



return {props : {contacts}} 
    
  
}
catch(error){
   console.error("Error in getServerSideProps:", error); 
return {props : {contacts : [] }}  

}

}










