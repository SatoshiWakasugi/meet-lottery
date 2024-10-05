import { FC } from 'preact/compat'

type Props = {
  children: React.ReactNode
  skelton?: boolean
  className?: string
}

export const Card: FC<Props> = ({ children, skelton = false, className }) => {
  return (
    <div
      className={`py-1 px-2 rounded-lg w-full ${className} ${skelton ? 'bg-insert' : 'bg-white'}`}
    >
      {children}
    </div>
  )
}
