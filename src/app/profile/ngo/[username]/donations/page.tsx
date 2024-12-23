import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Donations from "./donations"

export default async function ngoProfile() {
    const session=await getServerSession()
    if(session){
        if(session.user?.email==="D"){
            redirect(`/profile/ngo/${session.user.name}/dashboard`)
        }
        else if(session.user?.email==="B"){
            redirect(`/profile/needy/${session.user.name}/dashboard`)
        }
        else if(session.user?.email==="S"){
            redirect(`/profile/service/${session.user.name}/dashboard`)
        }
    }
    else{
        redirect("/login")
    }
    return(
        <>
            <title>AidConnect丨Profile</title>
            <Donations session={session.user?.name || ''}/>
        </>
  )
}
