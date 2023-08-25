"use client"

import {getProviders, signIn} from 'next-auth/react'
import { useEffect, useState } from 'react'
import Button from './Button'

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
        <Button 
          key={i}
          handleClick={() => signIn(provider?.id)}
          title={'Sign in'}
        />
      ))}</div>
    )
}

export default AuthProviders