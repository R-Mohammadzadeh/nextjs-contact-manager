import ConntactsInfo from "@/components/contactInfo/ContactsInfo"
import Contact from "@/models/Contact"
import connectDB from "@/utils/connectDB"
import styles from '@/styles/contacts.module.css'
import { useEffect, useState } from "react"
import validateToken from "@/utils/auth"
import { generateContactFilter } from "@/utils/contactHelpers"
import { useRouter } from "next/router"


export default function Contacts ({contacts}) {
const [infoList , setInfoList] = useState(contacts || []) ;
const [search , setSearch] = useState('') 
const [gen , setGen] = useState('')
const router = useRouter()
// 2. This will cause the list to update if the user changes the URL directly
useEffect(()=>{
    setInfoList(contacts)
},[contacts])

const clickHandler = async () => {
// 3. Instead of manually fetching, we change the URL
// Next.js will automatically rerun getServerSideProps    
router.push(`/contacts?gen=${gen}&search=${search}`);
}



    return (
        <>
<div className={styles.search}>
<input type="text" placeholder="inter name or family" onChange={(e) => setSearch(e.target.value)} />
<select type="text" placeholder="all" onChange={(e)=>setGen(e.target.value)}  >
    <option value="">all</option>
    <option value="male">male</option>
    <option value="female">female</option>
    <option value="others">others</option>
</select>

<button onClick={clickHandler}>search</button>
    
</div>

        {
  infoList.length > 0 ? (infoList.map(con => (
          <ConntactsInfo key={con._id} {...con} infoList={infoList} setInfoList={setInfoList} />
            ))) : (<p className={styles.noAudience}>No contacts found.</p>)
        }
        </>
    )
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










