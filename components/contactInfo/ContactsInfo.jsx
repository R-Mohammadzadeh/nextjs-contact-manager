import Link from 'next/link'
import styles from './ContactsInfo.module.css'
import toast, { Toaster } from 'react-hot-toast'
import { MdDeleteForever } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { MdOutlineFavoriteBorder } from "react-icons/md";


export default function ContactsInfo ({firstName , lastName , age , phone , gender ,_id , infoList , setInfoList}) {

 const deleteHandler =  async (_id) => {

     
    try{
const res = await fetch(`/api/contact/${_id}` , {method : 'DELETE'})
const data = await res.json()

if(!res.ok){
    toast.error(data.message || 'Failed to delete') 
    return ;

}
toast.success(data.message || "Deleted successfully")
    // update UI
const filtered = infoList.filter(item => item._id != _id)
setInfoList(filtered)
}
 catch(error){
toast.error("Server error")
 }
}

    return (
        <>
    <Toaster position='top-right' toastOptions={{duration :1000}} />

        <div className={styles.card}>
            <div>
            <b>firstName :</b> {firstName}
            </div>

            <div>
            <b>lastName :</b> {lastName}
            </div>

            <div>
            <b>gender :</b> {gender}
            </div>

            <div>
            <b>age :</b> {age}
            </div>

              <div>
            <b>phone :</b> {phone}
            </div>
            <div className={styles.icons}>
            <div>
                <MdDeleteForever onClick={ () => deleteHandler(_id)} />
            </div>

        <div>
        <Link href={`/contacts/edit/${_id}`}>
        <AiFillEdit />
        </Link>
        </div>

         <div>
        <MdOutlineFavoriteBorder />
         </div>

            </div>
        </div>
        
        </>
    )
}