import { useEffect, useState } from 'preact/hooks'
import '@/app.css'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type Member = {
  name: string
  image: string
  entry: boolean
  display: boolean
}

const membersMock = [
  {
    name: 'テスト１',
    image: 'https://github.com/shadcn.png',
    entry: true,
    display: true,
  },
  {
    name: 'テスト２',
    image: 'https://github.com/shadcn.png',
    entry: true,
    display: true,
  },
]

export function App() {
  const [members, setMembers] = useState<Member[]>(membersMock)
  const [searchInputValue, setSearchInputValue] = useState('')
  const [addInputValue, setAddInputValue] = useState('')

  useEffect(() => {
    const filteredMembers = members.map((item) => {
      return { ...item, display: item.name.includes(searchInputValue) }
    })
    setMembers(filteredMembers)
  }, [searchInputValue])

  const exclude = (member: Member) => {
    const excludedMember = members.map((item) => {
      if (member.name === item.name) {
        return { ...item, entry: !item.entry }
      }
      return item
    })
    setMembers(excludedMember)
  }

  const add = () => {
    const addMember = {
      name: addInputValue,
      image: '',
      entry: true,
      display: true,
    }
    setMembers([addMember, ...members])
    setAddInputValue('')
  }

  const searchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value
    setSearchInputValue(value)
  }

  const addInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value
    setAddInputValue(value)
  }

  return (
    <div>
      <p className="text-4xl text-center">Meet Nominator</p>
      <div className="h-4" />
      <div className="flex justify-center">
        <Button>抽選スタート</Button>
      </div>
      <div className="h-4" />
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="ユーザー名を入力してください"
          value={searchInputValue}
          onChange={(e) => searchInput(e)}
        />
      </div>
      <Separator className="my-4" />
      <ul className="p-2 bg-slate-100 flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="新規追加する抽選メンバーを入力してください"
            value={addInputValue}
            onChange={(e) => addInput(e)}
          />
          <Button onClick={() => add()}>追加</Button>
        </div>
        <div className="h-2" />
        {members.map((member) => {
          if (member.display) {
            return (
              <li>
                <div className="flex gap-2 items-center">
                  <Label
                    htmlFor={member.name}
                    className="flex items-center w-full cursor-pointer"
                  >
                    <div className="px-2">
                      <Checkbox
                        id={member.name}
                        onClick={() => exclude(member)}
                        checked={member.entry}
                      />
                    </div>
                    <div
                      className={`flex items-center gap-4 py-1 px-2 w-full rounded-lg ${member.entry ? 'bg-white' : 'bg-insert'}`}
                    >
                      <Avatar>
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <p>{member.name}</p>
                    </div>
                  </Label>
                </div>
              </li>
            )
          }
        })}
      </ul>
      <div className="h-4" />
      <div className="p-2 bg-slate-100">
        <p>抽選から除外するメンバー</p>
        <ul>
          {members.map((member) => {
            if (!member.entry) {
              return <li>{member.name} さん</li>
            }
          })}
        </ul>
      </div>
    </div>
  )
}
