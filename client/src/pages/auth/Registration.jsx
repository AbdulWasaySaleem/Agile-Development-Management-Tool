import React from 'react'
import Layout from '../../components/Layout'
import { useAuth } from '../../components/Context/UserContext'


const Registration = () => {
  const [auth,setauth] = useAuth()
  return ( 
    <>
      <Layout>
        <p>This is registration</p>
        <h1>{JSON.stringify(auth,null,4)}</h1>
      </Layout>
    </>
  )
}

export default Registration