"use client"

import {getProviders, signIn} from 'next-auth/react'
import { useEffect, useState } from 'react'

type Provider = {
  id: string, 
  name: string, 
  type: string,
  signInUrl: string,
  callbackUrl: string,
  signInUrlParams?: Record<string, string> | undefined
}

type Providers = Record<string, Provider>

const AuthProviders = () => {
  const [providers, setProviders] = useState<Providers | null>(null)

  useEffect(() => {
    const fetchProvider = async () => {
     const res = await getProviders()

     console.log(res);

    // @ts-ignore
     setProviders(res)
    }

    fetchProvider()
  } , [])
  
  if(providers)
    return (
      <div>{Object.values(providers).map((provider: Provider, i) => (
        <button 
          key={i}
          onClick={() => signIn(provider?.id)}
        >{provider.id}</button>
      ))}</div>
    )
}

export default AuthProviders