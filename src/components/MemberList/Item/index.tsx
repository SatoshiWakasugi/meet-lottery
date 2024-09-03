import { FC } from 'preact/compat'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Member } from '@/types/Member'
import { Badge } from '../Badge'
import { Card } from '../Card'

type Props = {
  member: Member
  onClick: () => void
  className?: string
}

export const Item: FC<Props> = ({ member, onClick, className }) => {
  return (
    <li className={className}>
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
        <Card
          skelton={!member.participation}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={member.image} alt={member.name} />
              <AvatarFallback className="text-xl">👤</AvatarFallback>
            </Avatar>
            <p>{member.name}</p>
          </div>
          <div className="px-4">{member.online && <Badge>online</Badge>}</div>
        </Card>
      </Label>
    </li>
  )
}
