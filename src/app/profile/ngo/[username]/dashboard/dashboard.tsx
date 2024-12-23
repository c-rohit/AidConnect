"use client"
import React, { useState, useEffect } from 'react'
import styles from "./dashboard.module.css"
import Image from "next/image"
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface ApiResponse {
  data: {
    id: number,
    name: string,
    username: string,
    campaigns: number,
    volunteers: number,
    wallet: string,
    state:string,
    country:string,
    city:string,
    district:string,
    pin:number,
    phone:number,
    email:string
  }
}

interface ApiResponse2{
  data: {
    map(arg0: (recent: any, index: number) => React.JSX.Element): React.ReactNode
    amount: number,
    type: string,
    from_name: string,
    campaign_id: number
  }
}

export default function Dashboard() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [data2, setData2] = useState<ApiResponse2 | null>(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/profile/ngo/dashboard")
      .then((res) => res.json())
      .then((apiData: ApiResponse) => {
        setData(apiData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setError("An error occurred while fetching data.")
        setLoading(false);
      })
  }, [])

  useEffect(() => {
    fetch("/api/profile/ngo/dashboard/recent")
      .then((res) => res.json())
      .then((apiData: ApiResponse2) => {
        setData2(apiData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setError("An error occurred while fetching data.")
        setLoading(false);
      })
  }, [])

  if (isLoading){
    return (
      <>
        <div className={styles.canvas}>
          <div className={styles.above}>
            <Image className={styles.loading} priority={true} src={"/loading.png"} width={300} height={300} alt="Loading"/>
          </div>
          <div className={styles.below}>
            <h1>Loading...</h1>
          </div>
        </div>
      </>
    )
  }

  if (error){
    return (
      <>
        <div className={styles.canvas}>
          <div className={styles.above}>
            <Image className={styles.error} priority={true} src={"/error.png"} width={300} height={300} alt="Error"/>
          </div>
          <div className={styles.below}>
            <h1>Error loading profile!</h1>
          </div>
        </div>
      </>
    )
  }

  if (!data){
    return (
      <>
        <div className={styles.canvas}>
          <div className={styles.above}>
            <Image className={styles.missing} priority={true} src={"/missing.png"} width={300} height={300} alt="Missing"/>
          </div>
          <div className={styles.below}>
            <h1>No profile data.</h1>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className={styles.canvas}>
        <div className={styles.bar}>
          <div className={styles.one}>
            <Link className={styles.link} href={"/"}>
              <Image className={styles.logo} priority={true} src={"/AidConnect Logo2.png"} width={300} height={150} alt="AidConnect"/>
            </Link>
          </div>
          <div className={styles.two}>
            <div className={styles.select}>
              <Link className={styles.link} href={`/profile/ngo/${data.data.username}/dashboard`}>
                <button className={styles.active}>Dashboard</button>
              </Link>
            </div>
            <div className={styles.select}>
              <Link className={styles.link} href={`/profile/ngo/${data.data.username}/donations`}>
                <button className={styles.button}>Donations</button>
              </Link>
            </div>
            <div className={styles.select}>
              <Link className={styles.link} href={`/profile/ngo/${data.data.username}/campaigns`}>
                <button className={styles.button}>Campaigns</button>
              </Link>
            </div>
            <div className={styles.select}>
              <Link className={styles.link} href={`/profile/ngo/${data.data.username}/approvals`}>
                <button className={styles.button}>Approvals</button>
              </Link>
            </div>
            <div className={styles.select}>
              <Link className={styles.link} href={`/profile/ngo/${data.data.username}/services`}>
                <button className={styles.button}>Services</button>
              </Link>
            </div>
          </div>
          <div className={styles.three}>
            <button className={styles.logout} onClick={()=>{signOut()}}>Logout</button>
          </div>
        </div>
        <div className={styles.dashboard}>
          <div className={styles.info}>
            <div className={styles.left}>
              <div className={styles.top}>
                <div className={styles.details}>
                  <div className={styles.high}>
                    <div className={styles.rt}>
                      <h1 className={styles.name}>{data.data.name}</h1>
                    </div>
                  </div>
                  <div className={styles.low}>
                    <p>Wallet details: {data.data.wallet}</p>
                    <p>Address: {data.data.city}, {data.data.district}, {data.data.state}, {data.data.country}- {data.data.pin}. </p>
                    <p>Email: {data.data.email}</p>
                    <p>Phone: {data.data.phone}</p>
                  </div>
                </div>
              </div>
              <div className={styles.bottom}>
                <div className={styles.west}>
                  <div className={styles.volunteers}>
                    <p>Number of volunteers: {data.data.volunteers}</p>
                  </div>
                </div>
                <div className={styles.east}>
                  <div className={styles.campaigns}>
                    <p>Number of campaigns: {data.data.campaigns}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.recent}>
              <p className={styles.title}>Recent Donations</p>
                <br/>
                <div className={styles.history}>
                  {data2?.data.map((recent: any,index: number) => (
                    <p key={index}>{recent.amount} ETH from {recent.from_name}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
