import { FC } from 'preact/compat'
import { Member } from '@/types/Member'

type Props = {
  children: (member: Member) => React.ReactNode
  members: Member[]
}

export const List: FC<Props> = ({ children, members }) => {
  return (
    <ul className="flex flex-col gap-2">
      {members.map((member) => children(member))}
    </ul>
  )
}
