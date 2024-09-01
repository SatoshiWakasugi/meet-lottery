import { FC } from 'preact/compat'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Member } from '@/types/Member'

type Props = {
  member: Member
  onClick: () => void
  className?: string
}

export const Item: FC<Props> = ({ member, onClick, className }) => {
  return (
    <li className={className}>
      <div className="flex gap-2 items-center">
        <Label
          htmlFor={member.name}
          className="flex items-center w-full cursor-pointer"
        >
          <div className="px-2">
            <Checkbox
              id={member.name}
              onClick={onClick}
              checked={member.participation}
            />
          </div>
          <div
            className={`flex items-center gap-4 py-1 px-2 w-full rounded-lg ${member.participation ? 'bg-white' : 'bg-insert'}`}
          >
            <Avatar>
              <AvatarImage src={member.image} alt={member.name} />
              <AvatarFallback className="text-xl">👤</AvatarFallback>
            </Avatar>
            <p>{member.name}</p>
          </div>
        </Label>
      </div>
    </li>
  )
}
