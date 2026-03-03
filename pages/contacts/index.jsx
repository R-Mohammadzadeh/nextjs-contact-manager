import ConntactsInfo from "@/components/contactInfo/ContactsInfo"
import Contact from "@/models/Contact"
import connectDB from "@/utils/connectDB"
import styles from '@/styles/contacts.module.css'
import { useState } from "react"

export default function contacts ({contacts}) {
const [infoList , setInfoList] = useState(contacts) ;
const [search , setSearch] = useState('') 
const [gen , setGen] = useState('')

const clickHandler = async () => {
const res = await fetch(`api/contact?gen=${gen}&search=${search}`)
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


export async function getServerSideProps() {

await connectDB()
const data = await Contact.find().lean().sort({createdAt : -1})
const contacts = await JSON.parse(JSON.stringify(data))
return {
    props : {contacts}
}

}










