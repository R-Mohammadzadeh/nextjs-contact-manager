import ConntactsInfo from "@/components/contactInfo/ContactsInfo"
import Contact from "@/models/Contact"
import connectDB from "@/utils/connectDB"
import styles from '@/styles/contacts.module.css'
import { useState } from "react"
import validateToken from "@/utils/auth"



export default function Contacts ({contacts}) {
const [infoList , setInfoList] = useState(contacts || []) ;
const [search , setSearch] = useState('') 
const [gen , setGen] = useState('')

const clickHandler = async () => {
const res = await fetch(`/api/contacts?gen=${gen}&search=${search}`)
const data = await res.json()
setInfoList(data)
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
    
const userId = payload.userId ;
const {gen , search} = context.query ; // Identifizieren Sie die URL

//  1. Erstellen Sie ein Abfrageobjekt (immer auf den angemeldeten Benutzer beschränkt)
let query = {userId} ;
// 3. Suchfilter für Vor- und Nachnamen hinzufügen (falls in der URL enthalten)
if(gen && gen !== 'all'){
    query.gender = gen ;
}

// 3. Suchfilter für Vor- und Nachnamen hinzufügen (falls in der URL enthalten)
if(search) {
    query.$or = [
        {firstName : {$regex : search , $options : 'i'}} ,
        {lasttName : {$regex : search , $options : 'i'}} ,
    ]
}

// 4. Führen Sie die Abfrage mit integrierten Filtern aus.
const data = await Contact.find(query).sort({createdAt : -1}).lean()
const contacts = JSON.parse(JSON.stringify(data))
return {
    props : {contacts}
}   
}
catch(error){
   console.error("Error in getServerSideProps:", error); 
return {
    props : {
        contacts : []
    }
}
}

}










