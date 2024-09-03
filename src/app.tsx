import '@/app.css'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Description } from '@/components/Description'
import { Heading } from '@/components/Heading'
import {
  MemberList,
  MemberListItem,
  MemberListItemCard,
} from '@/components/MemberList'
import { randomPick, hasItems as hasMembers } from '@/utils'
import { Errors, useError } from '@/hooks/useError'
import { useGoogleMeet } from '@/hooks/useGoogleMeet'
import { Member } from '@/types/Member'
import { useEffect, useMemo, useState } from 'preact/hooks'

const DEFAULT_TIME_TO_LOTTERY = 3

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
    online: false,
  })
  const [timeToLottery, setTimeToLottery] = useState(DEFAULT_TIME_TO_LOTTERY)

  useEffect(() => {
    const searchTerms = searchMember.split(/[,、]/)
    const filteredMembers = members.map((item) => {
      const display = searchTerms.some((term) =>
        item.name.includes(term.trim())
      )
      return { ...item, display }
    })

    setMembers(filteredMembers)
  }, [searchMember])

  useEffect(() => {
    if (lotteryModalOpen) {
      handleClickStartLotteryButton()
    }
  }, [lotteryModalOpen])

  const lotteryAvailable = useMemo(() => {
    return hasMembers(members.filter((member) => member.participation))
  }, [members])

  const handleChangeParticipationLottery = (member: Member) => {
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
      online: false,
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

  const handleClickStartLotteryButton = () => {
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

    const scrollableArea = document.querySelector('#scrollableArea')
    if (scrollableArea) {
      scrollableArea.scrollTop = 0
    }
  }

  const renderErrorMessage = useMemo(() => {
    if (errors['empty-additional-form']) {
      return <>追加したいメンバーが入力されていません。</>
    }
    if (errors['exist-additional-member-error']) {
      return <>入力しているメンバー名はすでに存在しています。</>
    }
  }, [errors])

  document
    ?.querySelector('#imageInputButton')
    ?.addEventListener('click', () => {
      ;(document.querySelector('#imageInput') as HTMLInputElement).click()
    })

  return (
    <>
      <section className="pb-4">
        <div className="flex justify-center items-center pb-2 gap-4">
          <img src="icon.png" alt="Meet Lottery icon" className="w-14" />
          <Heading>
            <span className="text-primary font-bold">M</span>eet{' '}
            <span className="text-primary font-bold">L</span>ottery
          </Heading>
        </div>
        <Description>
          Google Meet
          会議に参加しているメンバーからランダムで一人を選ぶ抽選ツールです。
          <br />
          Google Meet
          の会議画面で参加メンバーリストを表示した状態で使用してください。
        </Description>
      </section>
      <section className="pb-4">
        <div className="flex flex-col items-center gap-4">
          <Button
            type="button"
            onClick={handleOpenLotteryModal}
            disabled={!lotteryAvailable}
          >
            抽選スタート
          </Button>
          <Label htmlFor="inLotteryTime" className="flex items-center">
            <span className="shrink-0">抽選時間&nbsp;:&nbsp;&nbsp;</span>
            <Input
              type="number"
              id="inLotteryTime"
              value={timeToLottery}
              onChange={(e) => handleChangeTimeToLottery(e)}
            />
            <span className="shrink-0">&nbsp;&nbsp;秒</span>
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
        <div className="p-4 bg-slate-100">
          <Input
            type="text"
            placeholder="検索するメンバー名を入力してください"
            value={searchMember}
            onChange={(e) => handleChangeSearchInput(e)}
          />
          <p className="text-xs pt-2 pb-4 px-2">
            ※ 複数検索をする場合は空白なしのカンマ区切りで入力してください。
          </p>
          <div
            id="scrollableArea"
            className="h-72 overflow-scroll scroll-smooth"
          >
            <MemberList members={members}>
              {(member) =>
                member.display && (
                  <MemberListItem
                    member={member}
                    onClick={() => handleChangeParticipationLottery(member)}
                  />
                )
              }
            </MemberList>
          </div>
          <div className="flex">
            <div className="w-8" />
            <MemberListItemCard className="flex gap-2 mt-2">
              <Avatar>
                <AvatarFallback className="text-xl hover:bg-muted/100">
                  😃
                </AvatarFallback>
              </Avatar>
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
            </MemberListItemCard>
          </div>
          <div className="pr-2 pt-2 h-6 flex justify-end">
            <ErrorMessage>{renderErrorMessage}</ErrorMessage>
          </div>
          <p className="pl-2 pt-2 text-sm">抽選から除外するメンバー</p>
          <ul className="grid grid-cols-4 gap-2 py-2">
            {members.map((member) => {
              if (!member.participation) {
                return (
                  <li>
                    <Badge
                      className="py-1 flex justify-between items-center"
                      variant="outline"
                    >
                      <span className="px-2 w-full text-center">
                        {member.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChangeParticipationLottery(member)}
                      >
                        <span className="text-white px-1 bg-slate-400 flex justify-center items-center rounded-full">
                          ×
                        </span>
                      </button>
                    </Badge>
                  </li>
                )
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
                <p className="text-2xl text-center font-bold">
                  {winner.name} さん
                </p>
                <p className="text-center">が当選しました 🎉</p>
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
              <Button type="button" onClick={handleClickStartLotteryButton}>
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
