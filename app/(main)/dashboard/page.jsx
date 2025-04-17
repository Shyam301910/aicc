
import { getIndustryInsights } from '@/actions/dashboard';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'
import DashbooardView from './_components/DashboardView';

// Index page for Dashboard Page, renders the DashboardView component
const IndustryInsightsPage = async () => {
  //check if user is already onboarded
  const { isOnboarded } = await getUserOnboardingStatus();
  const insights= await getIndustryInsights()

  if (!isOnboarded) {
    redirect('/onboarding')
  }

  return (
    <div className='container mx-auto'>
      <DashbooardView insights={insights}/>
    </div>
  )
}

export default IndustryInsightsPage