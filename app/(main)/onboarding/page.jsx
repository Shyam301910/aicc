import React from 'react'
import OnboardingForm from './_components/OnboardingForm'
import { industries } from '@/data/industries'
import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'

const OnboardingPage = async () => {
  //check if user is already onboarded
  const {isOnboarded}=await getUserOnboardingStatus();

  if(isOnboarded){
    //redirect to dashboard
    redirect('/dashboard')
  }

  return (
    <main>
      <OnboardingForm industries={industries}/>
    </main>
  )
}

export default OnboardingPage