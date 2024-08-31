import { useEffect, useState } from 'preact/hooks'
import '@/app.css'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { membersMock } from '@/mock.ts'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Member = {
  name: string
  image: string
  entry: boolean
  display: boolean
}

export function App() {
  const [members, setMembers] = useState<Member[]>(membersMock)
  const [searchInputValue, setSearchInputValue] = useState('')
  const [addInputValue, setAddInputValue] = useState('')
  const [addInputError, setAddInputError] = useState(false)
  const [resultDialogOpen, setResultDialogOpen] = useState(false)
  const [inLottery, setInLottery] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member>({
    name: '',
    image: '',
    entry: true,
    display: true,
  })

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
    if (members.find((member) => member.name === addInputValue)) {
      return setAddInputError(true)
    }

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
    setAddInputError(false)
    setAddInputValue(value)
  }

  const closeDialog = () => {
    setResultDialogOpen(false)
  }

  const openDialog = () => {
    setResultDialogOpen(true)
  }

  useEffect(() => {
    if (resultDialogOpen) {
      lottery()
    }
  }, [resultDialogOpen])

  const lottery = () => {
    setInLottery(true)
    const randomSelect = members[Math.floor(Math.random() * members.length)]
    setSelectedMember(randomSelect)

    setTimeout(() => {
      setInLottery(false)
    }, 2000)
  }

  // @ts-ignore
  chrome.runtime?.sendMessage({ type: 'GET_MEMBERS' }, (response) => {
    if (response && response.names && response.images) {
      const members = response.names.map((name: any, index: number) => ({
        name,
        image: response.images[index] || '',
      }))
      const setupMembers = members.map((member: any) => {
        return { ...member, entry: true, display: true }
      })
      setMembers(setupMembers)
    } else {
      console.log('Failed to retrieve members')
    }
  })

  return (
    <div>
      <p className="text-4xl text-center">Meet Nominator</p>
      <div className="h-4" />
      <div className="flex justify-center">
        <Button type="button" onClick={openDialog}>
          抽選スタート
        </Button>
        <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
          {inLottery ? (
            <DialogContent className="sm:max-w-[425px]">
              <p>抽選中...</p>
            </DialogContent>
          ) : (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>抽選結果</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div
                  className={`flex flex-col items-center gap-4 py-1 px-2 w-full rounded-lg bg-insert}`}
                >
                  <Avatar className="w-36 h-36">
                    <AvatarImage
                      src={selectedMember.image}
                      alt={selectedMember.name}
                    />
                    <AvatarFallback>{selectedMember.name}</AvatarFallback>
                  </Avatar>
                  <p className="text-2xl">{selectedMember.name} さん</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={closeDialog}>
                  抽選結果をとじる
                </Button>
                <Button type="submit" onClick={lottery}>
                  再抽選する
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
      <div className="h-4" />
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="検索するユーザー名を入力してください"
          value={searchInputValue}
          onChange={(e) => searchInput(e)}
        />
      </div>
      <Separator className="my-4" />
      <div className="p-4 bg-slate-100 flex flex-col">
        <div class="flex flex-col gap-1">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="新規追加するメンバー名を入力してください"
              value={addInputValue}
              onChange={(e) => addInput(e)}
              className={addInputError ? 'border-rose-600' : ''}
            />
            <Button type="button" onClick={() => add()}>
              追加
            </Button>
          </div>
          <div className="h-4">
            {addInputError && (
              <p className="text-rose-600 text-xs pl-2">
                追加したメンバーはすでに存在しています。
              </p>
            )}
          </div>
        </div>
        <ul className="flex flex-col gap-2 max-h-72 overflow-scroll">
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
      </div>
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
