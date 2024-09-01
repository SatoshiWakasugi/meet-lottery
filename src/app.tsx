import '@/app.css'
import { useEffect, useMemo, useState } from 'preact/hooks'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useGoogleMeet } from '@/hooks/useGoogleMeet'
import { Member } from '@/types/Member'
import { Heading } from './components/Heading'
import { Description } from './components/Description'
import { MemberList, MemberListItem } from './components/MemberList'
import { randomPick, hasItems as hasMembers } from '@/utils'
import { Errors, useError } from '@/hooks/useError'

const DEFAULT_THINKING_TIME = 3

const filterParticipationMember = (members: Member[]) => {
  return members.filter((member) => member.participation)
}

const defineErrors: Errors = {
  emptyAdditionalForm: {
    name: 'empty-additional-form',
    message: '追加したいメンバーが入力されていません。',
  },
  existAdditionalMember: {
    name: 'exist-additional-member-error',
    message: '入力されたメンバーはすでに抽選名簿に存在しています。',
  },
}

export function App() {
  const { members, setMembers } = useGoogleMeet()
  const { errors, setError, removeError, ErrorMessage } = useError()

  const [searchMember, setSearchMember] = useState('')
  const [additionalMember, setAdditionalMember] = useState('')
  const [lotteryModalOpen, setLotteryModalOpen] = useState(false)
  const [inLottery, setInLottery] = useState(false)
  const [winner, setWinner] = useState<Member>({
    name: '',
    image: '',
    participation: true,
    display: true,
  })
  const [timeToLottery, setTimeToLottery] = useState(DEFAULT_THINKING_TIME)

  useEffect(() => {
    const filteredMembers = members.map((item) => {
      return { ...item, display: item.name.includes(searchMember) }
    })
    setMembers(filteredMembers)
  }, [searchMember])

  useEffect(() => {
    if (lotteryModalOpen) {
      handleStartLottery()
    }
  }, [lotteryModalOpen])

  const lotteryAvailable = useMemo(() => {
    return hasMembers(members.filter((member) => member.participation))
  }, [members])

  const notParticipationLottery = (member: Member) => {
    const excludedMember = members.map((item) => {
      if (member.name === item.name) {
        return { ...item, participation: !item.participation }
      }
      return item
    })
    setMembers(excludedMember)
  }

  const joinLotteryMember = () => {
    if (members.find((member) => member.name === additionalMember)) {
      setError(defineErrors.existAdditionalMember)
      return
    }

    const addMember = {
      name: additionalMember,
      image: '',
      participation: true,
      display: true,
    }
    setMembers([addMember, ...members])
    setAdditionalMember('')
  }

  const handleChangeSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = (event.target as HTMLInputElement).value
    setSearchMember(value)
  }

  const handleChangeAdditionalInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = (event.target as HTMLInputElement).value
    removeError(defineErrors.existAdditionalMember.name)
    removeError(defineErrors.emptyAdditionalForm.name)
    setAdditionalMember(value)
  }

  const handleOpenLotteryModal = () => {
    setLotteryModalOpen(true)
  }

  const handleCloseLotteryModal = () => {
    setLotteryModalOpen(false)
  }

  const handleStartLottery = () => {
    setInLottery(true)

    const participationMembers = members.filter((member) => {
      return member.participation
    })

    const pickedLotteryWinner = randomPick(participationMembers)
    setWinner(pickedLotteryWinner)

    setTimeout(() => {
      setInLottery(false)
    }, timeToLottery * 1000)
  }

  const handleChangeTimeToLottery = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = (event.target as HTMLInputElement).value
    setTimeToLottery(Number(value))
  }

  const handleClickAdditionalMemberButton = () => {
    if (!additionalMember) {
      setError(defineErrors.emptyAdditionalForm)
      return
    }

    joinLotteryMember()
  }

  const renderErrorMessage = useMemo(() => {
    if (errors['empty-additional-form']) {
      return <>追加したいメンバーが入力されていません。</>
    }
    if (errors['exist-additional-member-error']) {
      return <>入力しているメンバー名はすでに存在しています。</>
    }
  }, [errors])

  return (
    <>
      <section className="pb-4">
        <Heading>Meet Lottery</Heading>
        <Description>
          Google Meet
          会議に参加しているメンバーからランダムで一人を選ぶ抽選ツールです。
          <br />
          Google Meet
          の会議画面で参加メンバーリストを表示した状態で使用してください。
        </Description>
      </section>
      <section className="pb-4">
        <div className="flex flex-col items-center gap-2">
          <Button
            type="button"
            onClick={handleOpenLotteryModal}
            disabled={!lotteryAvailable}
          >
            抽選スタート
          </Button>
          <Label htmlFor="inLotteryTime" className="flex items-center">
            <span className="shrink-0">抽選時間 :</span>
            <Input
              type="number"
              id="inLotteryTime"
              value={timeToLottery}
              onChange={(e) => handleChangeTimeToLottery(e)}
            />
            <span className="shrink-0">秒</span>
          </Label>
          {!hasMembers(filterParticipationMember(members)) && (
            <ErrorMessage>
              抽選に参加できるメンバーが存在しません。
            </ErrorMessage>
          )}
        </div>
      </section>
      <Separator className="my-4" />
      <section>
        <div className="p-4">
          <Input
            type="text"
            placeholder="検索するメンバー名を入力してください"
            value={searchMember}
            onChange={(e) => handleChangeSearchInput(e)}
          />
        </div>
        <div className="p-4 bg-slate-100 flex flex-col">
          <div class="flex flex-col gap-1">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="抽選に追加するメンバー名を入力してください"
                value={additionalMember}
                onChange={(e) => handleChangeAdditionalInput(e)}
                className={
                  errors['exist-additional-member-error'] ||
                  errors['empty-additional-form']
                    ? 'border-rose-600'
                    : ''
                }
              />
              <Button type="button" onClick={handleClickAdditionalMemberButton}>
                追加
              </Button>
            </div>
            <div className="h-6">
              <ErrorMessage>{renderErrorMessage}</ErrorMessage>
            </div>
          </div>
          <MemberList members={members}>
            {(member) =>
              member.display && (
                <MemberListItem
                  member={member}
                  onClick={() => notParticipationLottery(member)}
                />
              )
            }
          </MemberList>
        </div>
        <div className="h-4" />
        <div className="px-4">
          <p>抽選から除外するメンバー</p>
          <ul>
            {members.map((member) => {
              if (!member.participation) {
                return <li>{member.name} さん</li>
              }
            })}
          </ul>
        </div>
      </section>

      {/* Lottery modal */}
      <Dialog open={lotteryModalOpen} onOpenChange={setLotteryModalOpen}>
        {inLottery ? (
          <DialogContent className="flex flex-col gap-4 justify-center items-center">
            <div className="text-8xl">🤔</div>
            <p className="text-xl">抽選中...</p>
          </DialogContent>
        ) : (
          <DialogContent>
            <p className="text-3xl text-center">抽選結果</p>
            <div className="flex flex-col items-center gap-4 py-1 px-2 w-full rounded-lg bg-insert">
              <Avatar className="w-36 h-36">
                <AvatarImage src={winner.image} alt={winner.name} />
                <AvatarFallback>{winner.name}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-2xl text-center">{winner.name} さん</p>
                <p className="text-center">が選ばれました 🎉</p>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseLotteryModal}
              >
                抽選結果をとじる
              </Button>
              <Button type="button" onClick={handleStartLottery}>
                再抽選する
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
      {/* Lottery modal */}
    </>
  )
}
