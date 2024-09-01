import { membersMock } from '@/mocks'
import { Member } from '@/types/Member'
import { useEffect, useState } from 'preact/hooks'

export const useGoogleMeet = () => {
  const [members, setMembers] = useState<Member[]>(membersMock)

  useEffect(() => {
    try {
      // @ts-ignore
      chrome.runtime?.sendMessage({ type: 'GET_MEMBERS' }, (response) => {
        if (response && response.names && response.images) {
          const members = response.names.map((name: any, index: number) => ({
            name,
            image: response.images[index] || '',
          }))
          const setupMembers = members.map((member: any) => {
            return {
              ...member,
              participation: true,
              display: true,
              online: true,
            }
          })
          setMembers(setupMembers)
        } else {
          console.log('Failed to retrieve members')
        }
      })
    } catch (e) {
      console.error(e)
    }
  }, [])

  return { members, setMembers }
}
